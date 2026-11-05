# @hili/comment

Lit 3 评论 Web Component 库：一个入口注册全部自定义元素，供各端（SSR 宿主、Solid/Vue 应用、无界子应用）以同一套 DOM 标签接入评论区。

## 自定义元素（21 个，标签前缀统一为 `hili-`）

| 分组 | 元素 |
| --- | --- |
| 容器 | `hili-comments`（评论区根）、`hili-comments-header`、`hili-comments-notice` |
| 评论项 | `hili-comment`、`hili-comment-thread`、`hili-comment-reply`、`hili-comment-replies`、`hili-comment-actions`、`hili-comment-menu` |
| 输入 | `hili-comment-box`、`hili-comment-rich-textarea`、`hili-comment-rich-text`、`hili-comment-pictures`、`hili-comment-pictures-upload`、`hili-emoji-picker` |
| 用户与基础 | `hili-avatar`、`hili-comment-user-info`、`hili-comment-user-sailing-card`、`hili-icon`、`hili-text-button`、`hili-checkbox` |

## 使用方式

```ts
// 仅客户端导入：Lit 的 customElements.define 在模块导入时立即执行，SSR 环境没有该 API。
// 在 onMount / useEffect 等客户端回调里动态 import，导入即完成全部元素注册。
onMount(async () => {
  await import('@hili/comment');
});
```

- 导入 `@hili/comment` 即注册全部元素，无需逐个引入。
- 类型定义在 `src/types`（`Comment`、`Member`、`EmojiPackage`、`Emote`、`Picture` 等）。
- `src/mock` 提供默认演示数据，`hili-comments` 内部引用，便于脱离后端独立联调。

## 构建

```sh
pnpm --filter @hili/comment build
```

tsup 输出 `dist/index.js`（ESM，lit 一并打入）与 `dist/index.d.ts`。本包是纯副作用注册模块，入口不导出符号，`index.d.ts` 为空导出属正常现象。

## 接入与版本控制

- 接入模式：workspace **dist 引入**（打包后引入），`files` 只携带 `dist`。
- 当前消费方：`apps/web`（bangumi-play、video-play）。
- 构建顺序：应用构建前先构建本包。
- 版本控制：独立 git 仓库，挂载于根仓库 `packages/comment`（gitlink 记录指针，远程仓库就绪后转为正式 submodule）。
