# 🤖 Whisperrer AI Error Interceptor

> An AI-powered error interceptor and debugger for your Node.js terminal.

[![Status](https://img.shields.io/badge/status-experimental-red?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green?style=flat-square)](https://nodejs.org)

---

> [!CAUTION]
> **⚠️ WARNING: UNSTABLE & EXPERIMENTAL REPOSITORY**
> 
> This repository is currently under heavy development and **is not ready for general use**. APIs, structures, and core logic are subject to change. Use at your own risk.

---

## 🚀 Overview

**Whisper** is a CLI wrapper tool for Node.js (e.g., `npx whisper app.js`). When your application crashes, Whisper intercepts the stack trace, extracts the relevant code snippet, analyzes it via an LLM, and prints human-readable explanations and code fixes directly in your terminal—saving you from constantly copying and pasting errors into a browser.

---

## ✨ Features

- **CLI Wrapper Execution:** Run target scripts effortlessly.
- **Token-Efficient Parsing:** Extracts only critical code frames instead of entire files.
- **Crash Loop Protection:** Built-in rate limiting to prevent runaway API requests during infinite loops.
- **Local Error Caching:** Caches analyzed errors locally to avoid redundant API token usage.

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/whisper.git
   cd whisper
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Link for local testing:**
   ```bash
   npm link
   ```

---

## 💻 Usage

Run your application using Whisper:

```bash
npx whisper app.js
```

---

## ⚠️ Known Issues

- **API Limits / RPD Quota:** Heavy usage during unstable network conditions or rapid continuous crashes may trigger rate limits (HTTP 503 / quota exhaustion). Use with caution.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
```