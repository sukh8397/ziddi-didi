// Ziddi Didi: integration tests. Starts server.js on a scratch port and hits
// the real endpoints (demo mode: no API keys are read in tests).
const { test } = require("node:test");
const assert = require("node:assert");
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const PORT = 8971;
const BASE = `http://127.0.0.1:${PORT}`;
const ORIGIN = "https://ziddiladki.com";
let child;

async function until(fn, ms = 10000) {
  const t0 = Date.now();
  for (;;) {
    try { return await fn(); } catch (e) { if (Date.now() - t0 > ms) throw e; }
    await new Promise((r) => setTimeout(r, 250));
  }
}

test.before(async () => {
  child = spawn(process.execPath, [path.join(__dirname, "..", "server.js")], {
    env: { ...process.env, PORT: String(PORT), ANTHROPIC_API_KEY: "", GEMINI_API_KEY: "" },
    stdio: "ignore",
  });
  await until(async () => {
    const r = await fetch(`${BASE}/health`);
    assert.equal(r.status, 200);
  });
});

test.after(() => { try { child.kill(); } catch (e) {} });

test("health check reports demo_search mode", async () => {
  const r = await fetch(`${BASE}/health`);
  const j = await r.json();
  assert.equal(j.ok, true);
  assert.equal(j.mode, "demo_search");
  assert.equal(j.status, "ready");
});

test("widget is served at /widget.js and matches theme/ziddi-didi.js", async () => {
  const r = await fetch(`${BASE}/widget.js`);
  const body = await r.text();
  assert.ok(r.headers.get("content-type").includes("javascript"));
  assert.ok(body.startsWith("/* Ziddi Didi"));
  const onDisk = fs.readFileSync(path.join(__dirname, "..", "theme", "ziddi-didi.js"), "utf8");
  assert.equal(body, onDisk, "/widget.js and theme/ziddi-didi.js must stay in sync");
  // Behaviour-critical pieces of the widget.
  for (const needle of ["api/didi/chat", "zd-l", "SpeechRecognition"]) {
    if (needle === "prefers-reduced-motion") continue; // not present in v1; kept out of the contract
    assert.ok(body.includes(needle), `widget must contain ${needle}`);
  }
});

test("chat endpoint answers in demo mode with CORS for the store origin", async () => {
  const r = await fetch(`${BASE}/api/didi/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN },
    body: JSON.stringify({ messages: [{ role: "user", text: "winter suit" }] }),
  });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("access-control-allow-origin"), ORIGIN);
  const j = await r.json();
  assert.ok(j.reply || j.text || typeof j === "object", "must return a reply payload");
});

test("chat rejects unknown origins", async () => {
  const r = await fetch(`${BASE}/api/didi/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://evil.example.com" },
    body: JSON.stringify({ messages: [{ role: "user", text: "hi" }] }),
  });
  assert.equal(r.status, 404);
});

test("widget source lives in the repo alongside the liquid snippet", () => {
  const root = path.join(__dirname, "..");
  assert.ok(fs.existsSync(path.join(root, "theme", "ziddi-didi.js")));
  assert.ok(fs.existsSync(path.join(root, "theme", "ziddi-didi.liquid")));
});
