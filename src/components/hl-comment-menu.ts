import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("hili-comment-menu")
export class HiliCommentMenu extends LitElement {
  static override styles = css`
    :host {
      position: absolute;
      z-index: 30;
      top: 26px;
      right: -8px;
      display: block;
      min-width: 120px;
      padding: 6px 0;
      border: 1px solid var(--line-regular, #e3e5e7);
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    #options {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      padding: 7px 14px;
      color: var(--text2, #61666d);
      font-size: 13px;
      white-space: nowrap;
      cursor: pointer;
    }
    li:hover {
      background: #f1f2f3;
      color: var(--brand-blue, #00aeec);
    }
  `;

  @property({ type: Boolean }) loggedIn = false;

  private emit(name: string): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  private copy(): void {
    const text = location.href;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
    this.emit("copied");
  }

  override render() {
    return html`<ul id="options">
      <li @click=${() => this.copy()}>复制评论链接</li>
      <li @click=${() => this.emit("blacklist")}>加入黑名单</li>
      <li @click=${() => this.emit("report")}>举报</li>
    </ul>`;
  }
}
