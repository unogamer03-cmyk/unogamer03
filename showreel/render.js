// Usage: node render.js stills <outdir> t1 t2 ...   |   node render.js video <out.mp4>
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http'), fs = require('fs'), path = require('path');
const FPS = 30, DUR = 15;
const types = { '.html': 'text/html', '.woff2': 'font/woff2', '.js': 'text/javascript' };
const server = http.createServer((q, r) => {
  const f = path.join(__dirname, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
});
(async () => {
  await new Promise(res => server.listen(0, res));
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => console.error('[pageerror]', e));
  await page.goto(`http://localhost:${port}/reel.html?render=1`);
  await page.evaluate(() => window.ready);
  const grab = t => page.evaluate(t => window.renderFrame(t).toDataURL('image/png').split(',')[1], t);
  const [mode, outp, ...rest] = process.argv.slice(2);
  if (mode === 'stills') {
    fs.mkdirSync(outp, { recursive: true });
    for (const t of rest) fs.writeFileSync(path.join(outp, `t${(+t).toFixed(2)}.png`), Buffer.from(await grab(+t), 'base64'));
  } else {
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outp], { stdio: ['pipe', 'ignore', 'inherit'] });
    const N = FPS * DUR, t0 = Date.now();
    for (let f = 0; f < N; f++) {
      const b = Buffer.from(await grab(f / FPS), 'base64');
      if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 30 === 0) console.log(`frame ${f}/${N}  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close(); server.close();
})();
