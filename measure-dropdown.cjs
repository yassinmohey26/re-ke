const fs = require('fs');
const path = require('path');

const DEBUG_PORT = 9222;
const URL = 'http://localhost:3000/de/touren';

async function getJson(endpoint) {
  const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}${endpoint}`);
  return res.json();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const targets = await getJson('/json');
  const page = targets.find(t => t.type === 'page');
  if (!page) throw new Error('No page target found');

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = ++id;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
  });

  await send('Page.navigate', { url: URL });
  await sleep(5000);

  const evalExpr = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return r.result ? r.result.value : r;
  };

  const clickResult = await evalExpr(`(() => {
    const t = document.querySelector('[aria-haspopup="dialog"]');
    if (!t) return 'NO TRIGGER';
    t.click();
    return 'clicked';
  })()`);
  console.log('click:', clickResult);
  await sleep(800);

  const geometry = await evalExpr(`(() => {
    const info = (el, name) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { name, cls: typeof el.className === 'string' ? el.className : String(el.className),
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        right: Math.round(r.right), bottom: Math.round(r.bottom),
        position: cs.position, display: cs.display, zIndex: cs.zIndex, gap: cs.gap,
        top: cs.top, left: cs.left, rightCss: cs.right, maxWidth: cs.maxWidth, width: cs.width,
        padding: cs.padding, borderRadius: cs.borderRadius };
    };
    const trigger = document.querySelector('[aria-haspopup="dialog"]');
    const field = trigger && trigger.parentElement;
    const dropdown = field && Array.from(field.querySelectorAll('div')).find(d => (d.className || '').toString().includes('guestDropdown'));
    const stepper = dropdown && Array.from(dropdown.querySelectorAll('div')).find(d => (d.className || '').toString().includes('guestStepper'));
    const searchBar = field && field.parentElement;
    const heroContent = searchBar && searchBar.parentElement;
    const hero = heroContent && heroContent.parentElement;
    return JSON.stringify({
      viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
      trigger: info(trigger, 'trigger'),
      field: info(field, 'field'),
      dropdown: info(dropdown, 'dropdown'),
      stepper: info(stepper, 'stepper'),
      searchBar: info(searchBar, 'searchBar'),
      heroContent: info(heroContent, 'heroContent'),
      hero: info(hero, 'hero'),
    });
  })()`);
  console.log('geometry:', geometry);

  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const outPath = path.join('C:', 'Users', 'YASSIN MOHEY', 'AppData', 'Local', 'Temp', 'opencode', 'dropdown-mobile.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('screenshot saved:', outPath);

  ws.close();
}

main().catch(err => { console.error('FATAL', err); process.exit(1); });
