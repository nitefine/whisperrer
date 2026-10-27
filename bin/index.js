#!/usr/bin/env node

import path from 'path';
import { runScript } from '../src/core/runner.js';
import chalk from 'chalk';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(chalk.red('❌ Error: Please include the Node.js file you want to run.'));
  console.log(chalk.yellow('💡 Example of usage: npx whisper app.js'));
  process.exit(1);
}

const targetFile = args[0];
const targetArgs = args.slice(1);
const absolutePath = path.resolve(process.cwd(), targetFile);

runScript(absolutePath, targetArgs);