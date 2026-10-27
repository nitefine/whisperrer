import { spawn } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import { parseStackTrace } from './parser.js';
import { analyzeErrorWithAI } from '../services/ai.js';
import { printAIAnalysis } from '../utils/formatter.js';
import { getErrorHash, getCachedAnalysis, setCachedAnalysis } from '../utils/cache.js';

let crashTimestamps = [];
const MAX_CRASHES = 3;
const TIME_WINDOW_MS = 10000; 

export function runScript(scriptPath, scriptArgs) {
  console.log(chalk.blue(`🚀 [Whisper] Running: ${path.basename(scriptPath)}...\n`));

  const child = spawn('node', [scriptPath, ...scriptArgs], {
    stdio: ['inherit', 'inherit', 'pipe'],
    env: process.env
  });

  let stderrOutput = '';

  child.stderr.on('data', (data) => {
    const chunk = data.toString();
    stderrOutput += chunk;
    process.stderr.write(chunk);
  });

  child.on('close', async (code) => {
    if (code !== 0 && stderrOutput.trim().length > 0) {
      await handleCrash(stderrOutput, scriptPath);
    } else {
      process.exit(code);
    }
  });
}

async function handleCrash(stderr, scriptPath) {
  const now = Date.now();

  crashTimestamps = crashTimestamps.filter((timestamp) => now - timestamp < TIME_WINDOW_MS);
  crashTimestamps.push(now);

  if (crashTimestamps.length > MAX_CRASHES) {
    console.log(chalk.bgRed.white.bold(' ⚠️ WARNING: Infinite Crash Loop detected! '));
    console.log(chalk.yellow(`The application crashed ${MAX_CRASHES}x dalam waktu ${TIME_WINDOW_MS / 1000} second(s).`));
    console.log(chalk.yellow('AI analysis is paused to prevent token wastage.\n'));
    process.exit(1);
  }

  console.log(chalk.magenta('\n🔍 [Whisper] Analyzing stack traces & code snippets...'));

  try {
    const parsedData = parseStackTrace(stderr);

    const errorHash = getErrorHash(
      parsedData.errorMessage, 
      parsedData.targetFile, 
      parsedData.targetLine
    );

    let aiResponse = getCachedAnalysis(errorHash);

    if (aiResponse) {
      console.log(chalk.green('⚡ [Whisper] Retrieving analysis from local cache (0 tokens used!)...'));
    } else {
      console.log(chalk.magenta('🤖 [Whisper] Contacting Gemini AI for repair solutions...'));
      aiResponse = await analyzeErrorWithAI(parsedData);
      
      setCachedAnalysis(errorHash, aiResponse);
    }

    printAIAnalysis(aiResponse, parsedData);
  } catch (err) {
    console.log(chalk.red(`\n❌ Failed to obtain AI analysis: ${err.message}`));
  }

  process.exit(1);
}