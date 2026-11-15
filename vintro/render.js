// node render.js stills <dir> T1 T2 ... | node render.js video <out.mp4>   (env SCALE=1|2)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http'), fs = require('fs'), path = require('path');
const FPS = 24, DUR = 12.5, SCALE = process.env.SCALE || 1;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const server = http.createServer((q, r) => { const f = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
(async () => {
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  page.on('console', m => console.log('[page]', m.text())); page.on('pageerror', e => console.error('[pageerror]', e));
  await page.goto(`http://localhost:${server.address().port}/reveal.html?render=1&scale=${SCALE}`);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
  const grab = T => page.evaluate(T => window.renderFrame(T).toDataURL('image/png').split(',')[1], T);
  const [mode, outp, ...rest] = process.argv.slice(2);
  if (mode === 'stills') { fs.mkdirSync(outp, { recursive: true }); for (const t of rest) { const s = Date.now(); fs.writeFileSync(path.join(outp, `T${(+t).toFixed(2).padStart(5, '0')}.png`), Buffer.from(await grab(+t), 'base64')); console.log('T', t, Date.now() - s, 'ms'); } }
  else {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outp], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(FPS * DUR), t0 = Date.now();
    for (let f = 0; f < N; f++) { const b = Buffer.from(await grab(f / FPS), 'base64'); if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r)); if (f % 24 === 0) console.log(`frame ${f}/${N} ${((Date.now() - t0) / 1000).toFixed(0)}s`); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close(); server.close();
})();
