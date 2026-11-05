import { html, LitElement, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { EmojiPackage, Emote } from "../types/Comment";
import "./hl-icon";
import "./hl-avatar";
import "./hl-comment-textarea";
import "./hl-checkbox";
import "./hl-comment-pictures-upload";
import "./hl-emoji-picker";

export const DEFAULT_AVATAR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="#d9dde3"/><circle cx="48" cy="36" r="17" fill="#fff"/><path d="M18 88c3-19 16-27 30-27s27 8 30 27" fill="#fff"/></svg>',
)}`;

interface ReplyTarget {
  comment: { member: { userName: string } };
}

@customElement("hili-comment-box")
export class HiliCommentBox extends LitElement {
  static override styles = css`
    :host {
      display: flex;
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
    #comment-area {
      position: relative;
      width: calc(100% - 80px);
    }
    #reply-tip {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      color: var(--text3, #9499a0);
      font-size: 12px;
    }
    #reply-tip button {
      margin-left: 8px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text-link, #008ac5);
      font: inherit;
      cursor: pointer;
    }
    #body {
      width: 100%;
    }
    #editor {
      width: 100%;
      padding: 8px 0;
      border: 1px solid var(--line-regular, #e3e5e7);
      box-sizing: border-box;
      border-radius: 6px;
      background: #f1f2f3;
      transition: 0.2s;
      cursor: text;
    }
    #editor:hover,
    #editor.active {
      background: #fff;
      border-color: #c9ccd0;
    }
    #input {
      width: 100%;
      min-height: 22px;
      max-height: 168px;
      overflow-y: auto;
      padding: 0 12px;
      box-sizing: border-box;
      outline: none;
      color: var(--text1, #18191c);
      font-size: 14px;
      line-height: 22px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    #input:empty::before {
      color: var(--text3, #9499a0);
      content: attr(data-placeholder);
      pointer-events: none;
    }
    #pictures {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 8px 12px 0;
    }
    #pictures .picture {
      position: relative;
      width: 64px;
      height: 64px;
    }
    #pictures img {
      display: block;
      width: 64px;
      height: 64px;
      border-radius: 4px;
      object-fit: cover;
    }
    #pictures .remove {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 16px;
      height: 16px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      cursor: pointer;
    }
    #footer {
      display: flex;
      align-items: center;
      width: 100%;
      height: 32px;
      margin-top: 10px;
    }
    #footer.hidden {
      display: none;
    }
    .tool-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 26px;
      margin-right: 6px;
      flex: 0 0 32px;
      border: 1px solid var(--line-regular, #e3e5e7);
      border-radius: 4px;
      background: #fff;
      color: var(--text2, #61666d);
      cursor: pointer;
    }
    .tool-btn:hover {
      color: var(--brand-blue, #00aeec);
    }
    .tool-btn svg {
      display: block;
      width: 16px;
      height: 16px;
    }
    #optional {
      display: flex;
      min-width: 0;
      flex: 1;
      align-items: center;
      gap: 4px;
      margin-left: 10px;
      overflow: hidden;
      color: var(--text3, #9499a0);
      font-size: 12px;
      white-space: nowrap;
    }
    #optional input {
      width: 14px;
      height: 14px;
      margin: 0;
      flex: 0 0 14px;
    }
    #pub {
      height: 32px;
      width: 70px;
      flex: 0 0 70px;
      margin-left: auto;
    }
    #pub button {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 4px;
      background: rgba(0, 174, 236, 0.5);
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    }
    #pub button.active {
      background: var(--brand-blue, #00aeec);
    }
    #pub button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    hili-emoji-picker {
      position: absolute;
      z-index: 20;
      left: 0;
      top: 50px;
    }
    hili-emoji-picker.up {
      top: auto;
      bottom: 50px;
    }
  `;

  @property({ type: Boolean }) loggedIn = false;
  @property({ type: Object }) currentUser: {
    userName: string;
    avatarUrl: string;
  } | null = null;
  @property({ type: Object }) replyTarget: ReplyTarget | null = null;
  @property({ type: Array }) emojiPackages: EmojiPackage[] = [];
  @state() private active = false;
  @state() private canPublish = false;
  @state() private emojiOpen = false;
  @state() private emojiUp = false;
  @state() private pictures: string[] = [];
  @state() private emotes: Record<string, Emote> = {};

  private handleOutside = (event: PointerEvent): void => {
    if (event.composedPath().includes(this)) return;
    if (this.replyTarget) return;
    this.emojiOpen = false;
    if (!this.message.trim() && this.pictures.length === 0) this.active = false;
  };

  private handleKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.emojiOpen) this.emojiOpen = false;
  };

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.handleOutside);
    document.addEventListener("keydown", this.handleKey);
    window.addEventListener("scroll", this.updateEmojiDirection, true);
    window.addEventListener("resize", this.updateEmojiDirection);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.handleOutside);
    document.removeEventListener("keydown", this.handleKey);
    window.removeEventListener("scroll", this.updateEmojiDirection, true);
    window.removeEventListener("resize", this.updateEmojiDirection);
  }

  private get textarea(): HTMLElement & { value: string; focus(): void; insertText(text: string): void } | null {
    return this.shadowRoot?.querySelector("hili-comment-rich-textarea") as (HTMLElement & { value: string; focus(): void; insertText(text: string): void }) | null;
  }

  private get placeholder(): string {
    if (this.replyTarget) return `回复 @${this.replyTarget.comment.member.userName}：`;
    return this.loggedIn ? "下面我简单喵两句" : "请先登录后发表评论";
  }

  private get message(): string {
    return this.textarea?.value ?? "";
  }

  private sync(): void {
    this.canPublish =
      this.message.trim().length > 0 || this.pictures.length > 0;
  }

  private updateEmojiDirection = (): void => {
    if (!this.emojiOpen) return;
    const rect = this.getBoundingClientRect();
    const up = window.innerHeight - rect.bottom < 300;
    if (up !== this.emojiUp) this.emojiUp = up;
  };

  private toggleEmoji(): void {
    const rect = this.getBoundingClientRect();
    this.emojiUp = window.innerHeight - rect.bottom < 300;
    this.emojiOpen = !this.emojiOpen;
    this.focusEditor();
  }

  private focusEditor(): void {
    this.active = true;
    this.textarea?.focus();
    this.sync();
  }

  private insertText(text: string): void {
    this.textarea?.insertText(text);
    this.sync();
  }

  private insertEmoji(event: CustomEvent<Emote>): void {
    const emote = event.detail;
    this.emotes = { ...this.emotes, [emote.text]: emote };
    this.insertText(emote.text);
  }

  private submit(): void {
    if (!this.loggedIn) {
      this.dispatchEvent(
        new CustomEvent("login-required", { bubbles: true, composed: true }),
      );
      return;
    }
    const message = this.message.trim();
    if (!message && this.pictures.length === 0) return;
    this.dispatchEvent(
      new CustomEvent("comment-submit", {
        detail: {
          message,
          pictures: [...this.pictures],
          emotes: { ...this.emotes },
        },
        bubbles: true,
        composed: true,
      }),
    );
    const textarea = this.textarea;
    if (textarea) textarea.value = "";
    this.pictures = [];
    this.emotes = {};
    this.canPublish = false;
    this.active = false;
    this.emojiOpen = false;
  }


  override render() {
    return html`
      <div id="user-avatar">
        <hili-avatar .src=${this.currentUser?.avatarUrl ?? DEFAULT_AVATAR} .size=${48}></hili-avatar>
      </div>
      <div id="comment-area">
        ${this.emojiOpen
          ? html`<hili-emoji-picker
              class=${this.emojiUp ? "up" : "down"}
              .packages=${this.emojiPackages}
              @emoji-select=${(event: CustomEvent<Emote>) =>
                this.insertEmoji(event)}
            ></hili-emoji-picker>`
          : nothing}
        <div id="body">
          <div
            id="editor"
            class=${this.active ? "active" : ""}
            @click=${() => this.focusEditor()}
            @keydown=${(event: KeyboardEvent) =>
              event.key === "Escape" && (this.emojiOpen = false)}
          >
            <hili-comment-rich-textarea
              .value=${this.message}
              .placeholder=${this.placeholder}
              @focus=${() => this.focusEditor()}
              @input=${() => this.sync()}
            ></hili-comment-rich-textarea>
            <hili-comment-pictures-upload
              .pictures=${this.pictures}
              @pictures-change=${(event: CustomEvent<{ pictures: string[] }>) => { this.pictures = event.detail.pictures; this.sync(); }}
            ></hili-comment-pictures-upload>
          </div>
        </div>
        <div
          id="footer"
          class=${this.active || this.canPublish ? "" : "hidden"}
        >
          <button
            class="tool-btn"
            title="表情"
            @click=${() => this.toggleEmoji()}
          >
            <hili-icon name="emoji_circle_line" .size=${16}></hili-icon>
          </button>
          <button
            class="tool-btn"
            title="@好友"
            @click=${() => this.insertText("@")}
          >
            <hili-icon name="at_line" .size=${16}></hili-icon>
          </button>
          ${!this.replyTarget
            ? html`<button class="tool-btn" title="图片" @click=${() => this.shadowRoot?.querySelector<HTMLElement & { openFileDialog(): void }>("hili-comment-pictures-upload")?.openFileDialog()}><hili-icon name="image_line" .size=${16}></hili-icon></button>`
            : nothing}

          ${!this.replyTarget
            ? html`<div id="optional"><hili-checkbox label="同时转发到我的动态" value="sync"></hili-checkbox></div>`
            : nothing}
          <div id="pub">
            <button
              class=${this.canPublish ? "active" : ""}
              ?disabled=${!this.canPublish}
              @click=${() => this.submit()}
            >
              发布
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
