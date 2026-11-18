import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { parseAlbumCovers } from './album-covers.mjs';

test('Album Covers 목록만 파싱하며 다른 갤러리 항목은 제외한다', () => {
  const covers = parseAlbumCovers('x="Album Covers",y=[{name:"album_test_01",text:"MARIA-n"}],z=[{name:"scene_01",text:"Other"}]');
  assert.equal(covers.size, 1);
  assert.match(covers.get('marian'), /albums\/album_test_01\.png$/);
  assert.equal(parseAlbumCovers('not a gallery').size, 0);
});

test('임시 → Album Cover → 위키로 승격하고 위키 수집 후에만 대기를 해제한다', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'storyline-sync-'));
  const root = pathToFileURL(folder + sep);
  const originalFetch = globalThis.fetch;
  try {
    for (const path of ['src/data', 'src/assets/thumbs', 'scripts']) await mkdir(new URL(path, root), { recursive: true });
    for (const file of ['timeline', 'bonus', 'settingStories']) {
      await writeFile(new URL(`src/data/${file}.ts`, root), file === 'timeline' ? "  title: 'MARIA-n',\n" : '');
    }
    const placeholder = new URL('scripts/wiki-image-placeholders.json', root);
    const sourceFile = new URL('src/thumbnail-sources.json', root);
    const thumb = new URL('src/assets/thumbs/maria-n.webp', root);
    const initial = await sharp({ create: { width: 256, height: 256, channels: 3, background: 'blue' } }).webp().toBuffer();
    const album = await sharp({ create: { width: 512, height: 512, channels: 3, background: 'red' } }).png().toBuffer();
    const wiki = await sharp({ create: { width: 256, height: 256, channels: 3, background: 'green' } }).png().toBuffer();
    await writeFile(thumb, initial);
    await writeFile(placeholder, '["MARIA-n"]\n');
    await writeFile(sourceFile, '{"maria-n":{"kind":"promo-crop"}}\n');
    let hasAlbum = false, hasWiki = false, imageDownloads = 0;
    globalThis.fetch = async (input) => {
      const url = new URL(input);
      const json = (body) => ({ ok: true, json: async () => body });
      if (url.searchParams.get('action') === 'parse') {
        const page = url.searchParams.get('page');
        assert(['Campaign/Storyline', 'Event'].includes(page));
        return json({ parse: { wikitext: { '*': page === 'Event' ? '' : '[[File:Storyline MARIA-n.png|200px|link=MARIA-n]]' } } });
      }
      if (url.searchParams.get('action') === 'query') return json({ query: { pages: hasWiki ? { 1: { title: 'File:Storyline MARIA-n.png', imageinfo: [{ url: 'https://fixture.test/wiki.png' }] } } : {} } });
      if (url.pathname === '/gallery') return { ok: true, text: async () => '<script src="/assets/gallery.js"></script>' };
      if (url.pathname === '/assets/gallery.js') return { ok: true, text: async () => `x="Album Covers",y=[${hasAlbum ? '{name:"album_marian_01",text:"MARIA-n"}' : '{name:"album_other_01",text:"Other"}'}]` };
      imageDownloads++;
      return { ok: true, arrayBuffer: async () => url.hostname === 'fixture.test' ? wiki : album };
    };
    const require = createRequire(import.meta.url);
    let script = await readFile(new URL('./sync-wiki-images.mjs', import.meta.url), 'utf8');
    script = script.replace("const root = new URL('../', import.meta.url);", `const root = new URL(${JSON.stringify(root.href)});`)
      .replace("from 'sharp'", `from '${pathToFileURL(require.resolve('sharp')).href}'`)
      .replace("from './album-covers.mjs'", `from '${new URL('./album-covers.mjs', import.meta.url).href}'`);
    let runId = 0;
    const run = () => import('data:text/javascript;base64,' + Buffer.from(script + `\n// run ${runId++}`).toString('base64'));
    await run();
    assert.deepEqual(await readFile(thumb), initial, '출처 둘 다 없으면 기존 임시 이미지를 보존');
    hasAlbum = true;
    await run();
    assert.equal(JSON.parse(await readFile(sourceFile, 'utf8'))['maria-n'].kind, 'nikke-db-album');
    assert.deepEqual(JSON.parse(await readFile(placeholder, 'utf8')), ['MARIA-n']);
    assert.equal(imageDownloads, 1);
    await run();
    assert.equal(imageDownloads, 1, '동일한 앨범 이미지는 다시 받지 않음');
    hasWiki = true;
    await run();
    assert.equal(JSON.parse(await readFile(sourceFile, 'utf8'))['maria-n'].kind, 'wiki-storyline');
    assert.deepEqual(JSON.parse(await readFile(placeholder, 'utf8')), []);
    const finalImage = await readFile(thumb);
    hasWiki = false;
    await run();
    assert.deepEqual(await readFile(thumb), finalImage, '위키 수집 완료 후 앨범으로 돌아가지 않음');
    assert.equal(imageDownloads, 2);
  } finally {
    globalThis.fetch = originalFetch;
    if (!resolve(folder).startsWith(resolve(tmpdir()) + sep) || !folder.includes('storyline-sync-')) throw new Error('Unsafe temporary path');
    await rm(folder, { recursive: true, force: true });
  }
});
