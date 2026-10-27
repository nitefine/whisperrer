import chalk from 'chalk';

export function printAIAnalysis(aiResponse, parsedData) {
  console.log('\n' + '='.repeat(60));
  console.log(chalk.bgRed.white.bold(' 🤖 WHISPER AI ERROR INTERCEPTOR '));
  console.log('='.repeat(60) + '\n');

  if (parsedData.targetFile) {
    console.log(chalk.yellow(`📍 Error Point:`) + ` ${parsedData.targetFile}:${parsedData.targetLine}`);
  }
  
  console.log(chalk.yellow(`🚨 Error Message:`) + ` ${chalk.red(parsedData.errorMessage)}\n`);

  console.log(chalk.cyan('-------------------- AI ANALYSIS --------------------'));
  console.log(aiResponse);
  console.log(chalk.cyan('-----------------------------------------------------\n'));
}