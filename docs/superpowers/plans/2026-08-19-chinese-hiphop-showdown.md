# 中国嘻哈歌曲巅峰对决 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个不发布、可在本地直接预览的中国嘻哈歌曲对决单页网站。

**Architecture:** 使用 Sites 官方单页 starter。页面组件持有歌曲、对阵与本地投票状态，样式集中在全局样式表；浏览器 localStorage 仅保存当前设备的本轮结果。

**Tech Stack:** React、TypeScript、vinext/Vite、CSS、Vitest（如 starter 已配置）

**Spec:** `docs/superpowers/specs/2026-08-19-chinese-hiphop-showdown-design.md`

## Global Constraints

- 仅交付本地预览，不发布。
- 所有票数明确标注为演示数据，不接入真实音源、账号或服务端数据库。
- 4 组、8 首示例歌曲；投票、进度、战绩、赛程与重置行为完整。
- 手机无横向溢出，支持键盘与减少动画偏好。

---

### Task 1: 初始化并完成核心对决体验

**Files:**
- Create/Modify: `app/page.tsx`
- Create/Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Test: `app/page.test.tsx`（仅当 starter 已提供测试环境）

**Interfaces:**
- Consumes: 浏览器 `localStorage`
- Produces: `Song` 类型、`Matchup` 类型和可交互的 `HomePage` 默认导出组件

- [ ] **Step 1: 初始化 Sites starter 并检查上述三个应用文件**

运行 Sites 插件提供的初始化脚本，保留其包管理器和构建结构。

- [ ] **Step 2: 写核心状态行为测试（测试环境存在时）**

```tsx
it('records a selected winner and advances to the next matchup', async () => {
  render(<HomePage />)
  await userEvent.click(screen.getAllByRole('button', { name: /选 ta 晋级/i })[0])
  expect(screen.getByText(/1 \/ 4 场已完成/)).toBeInTheDocument()
})
```

- [ ] **Step 3: 运行测试并确认初始失败**

运行 starter 的测试脚本；预期因对决页面尚不存在而失败。若 starter 未配置测试环境，则记录此项不适用并以构建与页面响应验证替代。

- [ ] **Step 4: 实现最小核心页面**

```ts
type Song = { id: string; title: string; artist: string; year: number; heat: number; accent: 'red' | 'blue' }
type Matchup = { id: string; left: Song; right: Song }
type VoteState = { current: number; winners: string[] }
```

页面提供 4 组静态对阵、左右投票按钮、当前进度、localStorage 恢复和“重新开赛”。选择后追加胜者并推进 `current`，完成后显示本轮完成状态。

- [ ] **Step 5: 完成首屏视觉切片并启动本地预览**

实现黑金舞台背景、红蓝卡片、中央 VS、赛事标题和首场对决；确认本地路由成功响应后在 Codex 打开一次预览。

- [ ] **Step 6: 运行核心行为检查**

确认选择后进度由 `0 / 4` 变为 `1 / 4`，刷新可恢复，重置可回到第 1 场。

### Task 2: 完善赛事信息、响应式样式与验证

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Remove: `app/_sites-preview/**`

**Interfaces:**
- Consumes: Task 1 的 `Song`、`Matchup` 与 `VoteState`
- Produces: 完整本轮战绩、八强赛程、演示热度榜及成品元数据

- [ ] **Step 1: 添加辅助区域**

加入本轮战绩、四场赛程和按 `heat` 降序展示的榜单；所有数字旁显示“演示数据”。

- [ ] **Step 2: 补齐视觉与无障碍**

加入响应式断点、清晰焦点环、按钮禁用态、触摸尺寸与 `prefers-reduced-motion` 分支；移动端将左右卡片纵向排列且不溢出。

- [ ] **Step 3: 更新站点元数据并移除 starter 占位内容**

```ts
export const metadata = {
  title: '中文说唱 · 巅峰对决',
  description: '用你的选择，决出今晚最炸的一首中国嘻哈。',
}
```

删除未使用的预览骨架与对应依赖，保持最小实现。

- [ ] **Step 4: 执行生产构建**

运行 `npm run build`；预期退出码为 0。若出现真实编译错误，仅修复与本次页面直接相关的问题并重跑。

- [ ] **Step 5: 最终本地交付**

保持开发预览运行，将同一 Codex 页面切到最终本地版本；不调用任何 Sites 发布接口。
