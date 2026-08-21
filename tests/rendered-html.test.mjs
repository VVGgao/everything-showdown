import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

test("server-renders the multi-category showdown platform", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>万物对决 · Showdown Arena<\/title>/i);
  assert.match(html, /万物皆可/);
  assert.match(html, /对决/);
  assert.match(html, /中国嘻哈/);
  assert.match(html, /K-POP/);
  assert.match(html, /游戏对比/);
  assert.match(html, /选 TA 晋级/);
  assert.match(html, /试听片段/);
  assert.match(html, /官方页面播放/);
  assert.match(html, /class="record"[^]*?<img[^>]+alt="[^"]+ 封面"/);
  assert.match(html, /<audio[^>]+preload="none"/);
  assert.match(html, /<audio[^>]+data-default-volume="0\.35"/);
  assert.match(html, /Demo 模拟数据/);
  assert.match(html, /参赛阵容/);
  assert.match(html, /按厂牌与团体查看/);
  assert.match(html, /SUP MUSIC/);
  assert.match(html, /个人 \/ ARTIST/);
  assert.equal([...html.matchAll(/class="roster-song"/g)].length, 64);
  assert.match(html, /组建 64 强/);
  assert.match(html, /选择多个厂牌/);
  assert.match(html, /第一赛段优先安排跨厂牌对决/);
  assert.match(html, /从所选歌池抽取 64 首/);
  assert.match(html, /全赛区热门优先 64 首/);
  assert.match(html, /完整曲库/);
  assert.match(html, /<details class="pool-catalog"[^>]*>/);
  assert.match(html, /href="#pool-catalog"/);
  assert.match(html, /id="pool-catalog"/);
  assert.match(html, /展开歌单/);
  assert.doesNotMatch(html, /<details class="pool-catalog"[^>]*\sopen(?:\s|>|=)/);
  assert.match(html, /<h3>SUP MUSIC<\/h3>/);
  assert.ok([...html.matchAll(/class="pool-track"/g)].length >= 32);
  assert.match(html, /创建我的对决/);
  assert.match(html, /for="custom-title"/);
  assert.match(html, /id="custom-entry"/);
  assert.match(html, /添加参赛项/);
  assert.match(html, /生成本地对决/);
  assert.match(html, /六十四首/);
  assert.match(html, /添加 2–32 个参赛项/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  assert.match(html, /<details class="roster-details">/);
  assert.match(html, /展开阵容/);
  assert.doesNotMatch(html, /<details class="roster-details" open/);
  assert.match(html, /锐评：从夯到拉/);
  assert.match(html, /把 10 首歌拖进你的评价区/);
  assert.equal([...html.matchAll(/class="rating-song"/g)].length, 10);
  assert.equal([...html.matchAll(/draggable="true"/g)].length, 10);
  assert.equal([...html.matchAll(/class="rating-zone /g)].length, 6);
  assert.equal([...html.matchAll(/aria-label="将 [^"]+ 移动到"/g)].length, 10);
  assert.match(html, /换一批 10 首/);
  assert.match(html, /aria-label="手机页面导航"/);
  assert.equal([...html.matchAll(/class="mobile-nav-button/g)].length, 6);
  assert.equal([...html.matchAll(/data-mobile-page="/g)].length, 6);
  assert.match(html, /赛区[^]*对决[^]*签表[^]*锐评[^]*统计[^]*创建/);
});

test("source includes local progress, reset, and accessible live feedback", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /重新开赛/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /entries\.length >= 32/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.song-card\.blue \.song-copy\s*\{[^}]*padding-left:\s*32px/s);
  assert.match(css, /\.song-card\.red \.song-copy\s*\{[^}]*padding-right:\s*32px/s);
  assert.match(css, /@media \(max-width:\s*760px\)[^]*\.mobile-page:not\(\.active\)\s*\{[^}]*display:\s*none/s);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await assert.rejects(access(new URL("../node_modules/react-loading-skeleton", root)));
});
