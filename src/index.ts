/**
 * @hili/comment 评论组件注册入口
 *
 * Lit Web Components（hili-comments / hili-comment-thread / hili-comment-box 等），
 * 导入本模块即完成全部自定义元素注册。
 *
 * 注意：Lit 的 customElement 装饰器在模块导入时会立即调用 customElements.define，
 * 该 API 仅存在于浏览器环境，因此本模块禁止在 SSR 服务端导入；
 * 业务侧应在 onMount 等仅客户端回调中通过动态 import 触发注册。
 */
import './components/hl-comments';
