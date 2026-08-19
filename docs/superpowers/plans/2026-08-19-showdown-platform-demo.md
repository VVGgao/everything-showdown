# 万物对决平台 Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有单赛区页面升级为包含中国嘻哈、K-POP、游戏与本地自定义赛事的平台 Demo。

**Architecture:** 官方赛事由配置数据驱动，共用 8 强单败淘汰状态机和展示组件。各赛区使用独立 localStorage 键；冠军统计使用明确标注的模拟数据，自定义赛事仅保存在本机。

**Tech Stack:** React 19、TypeScript、vinext/Vite、CSS、Node test

**Spec:** `docs/superpowers/specs/2026-08-19-showdown-platform-demo-design.md`

## Global Constraints

- 仅做本地 Demo，不发布。
- 三个官方赛区共享 8 强、半决赛、决赛共 7 场的赛制。
- 模拟统计必须明确标注，不冒充真实用户数据。
- 自定义赛事不上传、不进入官方统计。
- 保持移动端适配、键盘可用和 VS 不遮挡内容。

---

### Task 1: 共享赛事数据与淘汰赛引擎

**Files:**
- Create: `app/competition-data.ts`
- Create: `app/tournament.ts`
- Modify: `app/page.tsx`
- Test: `tests/tournament.test.mjs`

**Interfaces:**
- Produces: `Competition`、`Entry`、`competitions`、`getCurrentMatch(entryIds, winners)`
- Consumes: 无

- [ ] **Step 1: 写失败测试**

```js
test("eight entries produce a champion after seven winners", () => {
  const ids = ["a","b","c","d","e","f","g","h"];
  const winners = ["a","c","e","g","a","e","e"];
  assert.deepEqual(getCurrentMatch(ids, winners), { finished: true, championId: "e" });
});
```

- [ ] **Step 2: 运行测试并确认模块不存在导致失败**

运行 `node --test tests/tournament.test.mjs`，预期失败于缺少赛事引擎。

- [ ] **Step 3: 实现最小状态机**

```ts
export function getCurrentMatch(entryIds: string[], winners: string[]) {
  if (winners.length < 4) return { round: "八强赛", pair: [entryIds[winners.length * 2], entryIds[winners.length * 2 + 1]] };
  if (winners.length < 6) return { round: "半决赛", pair: [winners[(winners.length - 4) * 2], winners[(winners.length - 4) * 2 + 1]] };
  if (winners.length < 7) return { round: "总决赛", pair: [winners[4], winners[5]] };
  return { finished: true, championId: winners[6] };
}
```

- [ ] **Step 4: 添加三个官方赛区配置并接入页面**

每个 `Competition` 提供 `id`、`name`、`type`、`theme`、8 个 `entries` 和 `demoChampionCounts`。页面按当前赛区调用统一状态机并使用 `showdown-<competitionId>-v1` 保存进度。

- [ ] **Step 5: 运行状态机测试**

预期所有淘汰赛测试通过。

### Task 2: 平台大厅、赛区切换与冠军统计

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: Task 1 的 `competitions` 与 `getCurrentMatch`
- Produces: 赛事大厅、赛区导航、冠军展示和模拟统计榜

- [ ] **Step 1: 更新渲染测试并确认失败**

断言页面包含“万物皆可对决”“中国嘻哈”“K-POP”“游戏对比”“模拟冠军统计”和“创建我的对决”。

- [ ] **Step 2: 实现赛事大厅与赛区切换**

首屏展示平台主张和三张赛事卡；点击卡片更新当前 `competitionId` 并滚动到统一对决区。赛事进度、文案、颜色和参赛内容随配置变化。

- [ ] **Step 3: 完成冠军与统计界面**

完成 7 场后显示冠军、该项模拟冠军次数和重新开赛。统计表按 `demoChampionCounts` 排序并标注“Demo 模拟数据”。

- [ ] **Step 4: 更新响应式与元数据**

桌面三列大厅卡片，移动端单列；对决卡片保持 32px 桌面安全区和移动端清零。站点标题改为“万物对决 · Showdown Arena”。

- [ ] **Step 5: 运行页面测试**

运行 `npm test`，预期构建成功且页面断言通过。

### Task 3: 本地自定义对决创建器

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: Task 1 的统一赛事形状
- Produces: 本地赛事名称、参赛项输入、生成与清空操作

- [ ] **Step 1: 添加失败的界面契约测试**

断言源码包含 `custom-title`、`custom-entry`、`生成本地对决` 和独立的 `showdown-custom-v1` 存储键。

- [ ] **Step 2: 实现本地创建器**

提供赛事名称、逐项添加和参赛项列表；至少 2 项时生成本地对决。奇数项允许最后一项轮空进入下一轮；Demo 首版最多 8 项。

- [ ] **Step 3: 接入统一对决展示并排除官方统计**

自定义赛事使用本地配置和进度，统计区域显示“自定义赛事不参与官方统计”。

- [ ] **Step 4: 执行最终验证**

运行 `npm test` 和本地 HTTP 检查；预期 0 个失败且首页返回 200。不调用发布接口。
