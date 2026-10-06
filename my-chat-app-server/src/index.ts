import { config } from './config.js';
import { createApp } from './app.js';
import { loadScenarios } from './services/scenarioStore.js';
import { loadScripts } from './services/scriptStore.js';

await loadScenarios();
await loadScripts();

createApp().listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
  console.log(config.geminiApiKey ? `Chat engine: Gemini (${config.geminiModel})` : 'Chat engine: scripted (no GEMINI_API_KEY in .env)');
});
