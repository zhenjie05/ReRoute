// Refresh curated Wikimedia image URLs and attribution. Run manually when updating photos.
const fs = require('node:fs');
const path = require('node:path');
const target = path.resolve(__dirname, '../src/features/trip-room/data/location-photos.json');
const files = Object.keys(JSON.parse(fs.readFileSync(target, 'utf8')));
const strip = value => (value || '').replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
(async () => {
  const catalogue = {};
  for (let offset = 0; offset < files.length; offset += 40) {
    if (offset) await new Promise(resolve => setTimeout(resolve, 2000));
    const url = new URL('https://commons.wikimedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|extmetadata',
      iiurlwidth: '960', titles: files.slice(offset, offset + 40).map(file => 'File:' + file).join('|'),
    });
    const response = await fetch(url);
    if (!response.ok) throw new Error('Photo catalogue request failed: ' + response.status);
    const data = await response.json();
    for (const page of Object.values(data.query.pages)) {
      const info = page.imageinfo?.[0];
      if (!info) throw new Error('Missing photograph: ' + page.title);
      const meta = info.extmetadata || {};
      catalogue[page.title.replace(/^File:/, '')] = {
        imageUrl: (info.thumburl || info.url).split('?')[0],
        sourceUrl: info.descriptionurl,
        credit: [strip(meta.Artist?.value), strip(meta.LicenseShortName?.value), 'Wikimedia Commons'].filter(Boolean).join(' · '),
        description: strip(meta.ImageDescription?.value),
      };
    }
  }
  fs.writeFileSync(target, JSON.stringify(catalogue, null, 2) + '\n');
  console.log('Verified ' + Object.keys(catalogue).length + ' curated photographs.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
