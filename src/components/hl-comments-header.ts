import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { EmojiPackage } from "../types/Comment";
import "./hl-text-button";
import { DEFAULT_AVATAR } from "./hl-comment-box";

@customElement("hili-comments-header")
export class HiliCommentsHeader extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    #navbar {
      display: flex;
      align-items: center;
      height: 30px;
      margin-bottom: 14px;
    }
    #title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #title h2 {
      margin: 0;
      color: var(--text1, #18191c);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
    }
    #count {
      color: var(--text3, #9499a0);
      font-size: 13px;
    }
    #sort-actions {
      display: flex;
      align-items: center;
      margin-left: 30px;
    }
    #sort-actions hili-text-button {
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text3, #9499a0);
      font-size: 13px;
      cursor: pointer;
    }
    #sort-actions hili-text-button.active {
      color: var(--text1, #18191c);
    }
    #sort-actions hili-text-button:hover {
      color: var(--brand-blue, #00aeec);
    }
    .sort-div {
      width: 1px;
      height: 12px;
      margin: 0 10px;
      background: var(--line-regular, #e3e5e7);
    }
    #commentbox {
      transition: height 0.2s;
      height: auto;
    }
    #disabled-commentbox {
      display: flex;
      min-height: 50px;
    }
    #user-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 50px;
      flex: 0 0 80px;
    }
    #user-avatar img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    #edit {
      display: flex;
      align-items: center;
      flex: 1;
      height: 50px;
      padding: 0 12px;
      box-sizing: border-box;
      border: 1px solid var(--line-regular, #e3e5e7);
      border-radius: 6px;
      background: #f1f2f3;
      color: var(--text3, #9499a0);
      font-size: 13px;
    }
    #edit button {
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text-link, #008ac5);
      font: inherit;
      cursor: pointer;
    }
    #edit button:hover {
      color: var(--brand-blue, #00aeec);
    }
  `;

  @property({ type: Number }) count = 0;
  @property({ type: Boolean }) loggedIn = false;
  @property({ type: Object }) currentUser: {
    userName: string;
    avatarUrl: string;
  } | null = null;
  @property({ type: Array }) emojiPackages: EmojiPackage[] = [];
  @property({ type: Number }) sort = 2;

  private emit(name: string, detail?: unknown): void {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  override render() {
    return html`
      <div id="navbar">
        <div id="title">
          <h2>评论</h2>
          <div id="count">${this.count}</div>
        </div>
        <div id="sort-actions">
          <hili-text-button
            class=${this.sort === 2 ? "active" : ""}
            @click=${() => this.emit("sort-change", { sort: 2 })}
          >最热</hili-text-button>
          <div class="sort-div"></div>
          <hili-text-button
            class=${this.sort === 1 ? "active" : ""}
            @click=${() => this.emit("sort-change", { sort: 1 })}
          >最新</hili-text-button>
        </div>
      </div>
      <div id="commentbox">
        ${this.loggedIn
          ? html`<hili-comment-box
              .loggedIn=${true}
              .currentUser=${this.currentUser}
              .emojiPackages=${this.emojiPackages}
              @comment-submit=${(
                event: CustomEvent<{
                  message: string;
                  pictures: string[];
                  emotes: Record<string, unknown>;
                }>,
              ) => this.emit("comment-submit", event.detail)}
              @login-required=${() => this.emit("login-required")}
            ></hili-comment-box>`
          : html`<div id="disabled-commentbox">
              <div id="user-avatar">
                <img
                  src=${DEFAULT_AVATAR}
                  alt=""
                  referrerpolicy="no-referrer"
                />
              </div>
              <div id="edit">
                <span>请先</span
                ><button @click=${() => this.emit("login-click")}>登录</button
                ><span>后发表评论</span>
              </div>
            </div>`}
      </div>
    `;
  }
}
