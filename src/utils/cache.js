import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.resolve(process.cwd(), '.whisper-cache.json');

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
  }
  return {};
}

function saveCache(cacheData) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8');
  } catch (err) {
  }
}

export function getErrorHash(errorMessage, targetFile, targetLine) {
  const rawString = `${errorMessage}-${targetFile}-${targetLine}`;
  return crypto.createHash('md5').update(rawString).digest('hex');
}

export function getCachedAnalysis(errorHash) {
  const cache = loadCache();
  const entry = cache[errorHash];
  
  if (entry && Date.now() - entry.timestamp < 3600000) {
    return entry.aiResponse;
  }
  return null;
}

export function setCachedAnalysis(errorHash, aiResponse) {
  const cache = loadCache();
  cache[errorHash] = {
    aiResponse,
    timestamp: Date.now()
  };
  saveCache(cache);
}