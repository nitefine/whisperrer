import fs from 'fs';
import path from 'path';

/**
 * Extracting key information from a stack trace and retrieving code snippets
 */
export function parseStackTrace(stderr) {
  const lines = stderr.split('\n');
  let errorMessage = lines[0] || 'Unknown Error';
  
  const stackLineRegex = /\s+at\s+(?:.*?\s+\()?(?:file:\/\/)?(.*?):(\d+)(?:\:\d+)?\)?/;
  
  let targetFile = null;
  let targetLine = null;
  let codeSnippet = '';

  for (const line of lines) {
    const match = line.match(stackLineRegex);
    if (match) {
      const filePath = match[1];
      const lineNumber = parseInt(match[2], 10);

      if (!filePath.includes('node_modules') && !filePath.startsWith('internal/')) {
        targetFile = filePath;
        targetLine = lineNumber;
        break;
      }
    }
  }

  if (targetFile && targetLine && fs.existsSync(targetFile)) {
    try {
      const fileContent = fs.readFileSync(targetFile, 'utf-8');
      const fileLines = fileContent.split('\n');
      
      const start = Math.max(0, targetLine - 6); 
      const end = Math.min(fileLines.length, targetLine + 5); 
      codeSnippet = fileLines
        .slice(start, end)
        .map((line, idx) => {
          const currentLineNum = start + idx + 1;
          const isErrorLine = currentLineNum === targetLine;
          return `${isErrorLine ? '==> ' : '    '}${currentLineNum}: ${line}`;
        })
        .join('\n');
    } catch (err) {
      codeSnippet = 'Failed to read source file snippet.';
    }
  }

  return {
    errorMessage,
    fullStackTrace: stderr,
    targetFile: targetFile ? path.relative(process.cwd(), targetFile) : null,
    targetLine,
    codeSnippet
  };
}