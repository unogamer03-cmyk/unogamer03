const { chromium } = require('playwright');
(async () => {
  const [file, fps, k, n] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5]];
  const N = fps * 15;
  const b = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await pg.addInitScript(() => { window.__HQ = true; });
  await pg.goto('file://' + file);
  await pg.addStyleTag({ content: `body{padding:0!important;gap:0!important;background:#160D25!important}.controls{display:none!important}.frame{width:1080px!important;border-radius:0!important;box-shadow:none!important}` });
  await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(1500);
  const el = pg.locator('#frame');
  const fs = require('fs');
  for (let i = k; i < N; i += n) {
    const out = `frames/f${String(i).padStart(4, '0')}.png`;
    if (i < 672 && fs.existsSync(out)) continue;
    await pg.evaluate((t) => window.__render(t), i / fps);
    await el.screenshot({ type: 'png', path: `frames/f${String(i).padStart(4, '0')}.png` });
  }
  await b.close(); console.log('worker', k, 'done');
})();
