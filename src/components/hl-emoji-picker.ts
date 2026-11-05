import { html, LitElement, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { EmojiPackage, Emote } from "../types/Comment";

const PAGE_COUNT = 5;

@customElement("hili-emoji-picker")
export class HiliEmojiPicker extends LitElement {
  static override styles = css`
    :host {
      display: block;
      --emoji-picker-tab-count: 5;
      --emoji-picker-tab-width: 58px;
      --emoji-picker-nav-width: 73px;
      --emoji-picker-body-height: 196px;
    }
    #picker {
      width: calc(
        var(--emoji-picker-tab-width) * var(--emoji-picker-tab-count) +
          var(--emoji-picker-nav-width)
      );
      overflow: hidden;
      border: 1px solid var(--line-regular, #e3e5e7);
      border-radius: 8px;
      background: #fff;
      color: var(--text2, #61666d);
      font-size: 12px;
      box-sizing: border-box;
    }
    #header {
      padding: 13px 15px 6px;
      box-sizing: border-box;
    }
    #body {
      height: var(--emoji-picker-body-height);
    }
    #content {
      height: 100%;
      padding: 0 11px;
      overflow: auto;
      box-sizing: border-box;
    }
    #content::-webkit-scrollbar {
      width: 4px;
      background: transparent;
    }
    #content::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: var(--line-regular, #e3e5e7);
    }
    #content .emoji {
      display: inline-block;
      border-radius: 4px;
      cursor: pointer;
    }
    #content .emoji:hover {
      background: #f1f2f3;
    }
    #content .emoji.img {
      padding: 4px;
      box-sizing: content-box;
    }
    #content .emoji.img img {
      display: block;
      width: 24px;
      height: 24px;
    }
    #content .emoji.text {
      padding: 5px 8px;
      line-height: 22px;
    }
    #content .emoji.text img {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 4px;
      vertical-align: middle;
    }
    #footer {
      display: flex;
      height: 36px;
      background: #f6f7f8;
      box-sizing: border-box;
    }
    #tabs {
      width: calc(100% - var(--emoji-picker-nav-width));
      height: 100%;
      overflow: hidden;
    }
    #tabs-track {
      display: flex;
      flex-wrap: nowrap;
      height: 100%;
      transition: transform 0.3s ease-in-out;
    }
    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--emoji-picker-tab-width);
      height: 100%;
      flex-shrink: 0;
      cursor: pointer;
    }
    .tab:hover {
      background: #eef0f2;
    }
    .tab.active {
      background: #fff;
    }
    .tab img {
      width: 22px;
      height: 22px;
      display: block;
    }
    #nav {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      width: var(--emoji-picker-nav-width);
      height: 100%;
    }
    #nav button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text2, #61666d);
      cursor: pointer;
    }
    #nav button.disabled {
      color: var(--text4, #c9ccd0);
      cursor: default;
    }
    #nav svg {
      width: 16px;
      height: 16px;
    }
    #emoji-hover {
      position: fixed;
      z-index: 9999;
      width: 124px;
      padding-bottom: 8px;
      border-radius: 6px;
      background: #fff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      text-align: center;
      pointer-events: none;
    }
    #emoji-hover .name {
      height: 28px;
      overflow: hidden;
      color: var(--text2, #61666d);
      font-size: 12px;
      line-height: 28px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #emoji-hover img {
      display: block;
      width: 84px;
      height: 84px;
      margin: 0 auto;
      object-fit: contain;
    }
  `;

  @property({ type: Array }) packages: EmojiPackage[] = [];
  @state() private currentIndex = 0;
  @state() private hovered: Emote | null = null;
  @state() private hoverX = 0;
  @state() private hoverY = 0;

  private showHover(event: MouseEvent, emote: Emote): void {
    this.hovered = emote;
    this.hoverX = event.clientX;
    this.hoverY = event.clientY;
  }

  private get currentPage(): number {
    return Math.floor(this.currentIndex / PAGE_COUNT);
  }

  private get isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  private get isLastPage(): boolean {
    const total = Math.ceil(this.packages.length / PAGE_COUNT);
    return this.currentPage === total - 1;
  }

  private get currentPackage(): EmojiPackage | null {
    return this.packages[this.currentIndex] ?? null;
  }

  private setTab(index: number): void {
    if (index < 0 || index >= this.packages.length) return;
    this.currentIndex = index;
  }

  private select(emote: Emote): void {
    this.dispatchEvent(
      new CustomEvent("emoji-select", {
        detail: emote,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private renderEmote(emote: Emote) {
    if (emote.type === 4) {
      return html`<div class="emoji text" @click=${() => this.select(emote)} @mouseenter=${(event: MouseEvent) => this.showHover(event, emote)} @mouseleave=${() => (this.hovered = null)}>
        ${emote.text}
      </div>`;
    }
    return html`<div class="emoji img" @click=${() => this.select(emote)} @mouseenter=${(event: MouseEvent) => this.showHover(event, emote)} @mouseleave=${() => (this.hovered = null)}>
      <img
        src=${emote.webpUrl || emote.gifUrl || emote.url}
        alt=${emote.text}
        title=${emote.text}
      />
    </div>`;
  }

  override render() {
    if (!this.currentPackage) return nothing;
    return html`<div id="picker">
      <div id="header">${this.currentPackage.text}</div>
      <div id="body">
        <div id="content">
          ${this.currentPackage.emotes.map((emote) => this.renderEmote(emote))}
        </div>
      </div>
      <div id="footer">
        <div id="tabs">
          <div
            id="tabs-track"
            style=${`transform:translateX(${-58 * this.currentPage}px)`}
          >
            ${this.packages.map(
              (item, index) =>
                html`<div
                  class=${this.currentIndex === index ? "tab active" : "tab"}
                  @click=${() => this.setTab(index)}
                >
                  <img
                    src=${item.iconUrl}
                    alt=${item.text}
                    title=${item.text}
                  />
                </div>`,
            )}
          </div>
        </div>
        <div id="nav">
          <button
            class=${this.isFirstPage ? "disabled" : ""}
            title="上一页"
            @click=${() =>
              !this.isFirstPage &&
              this.setTab((this.currentPage - 1) * PAGE_COUNT + PAGE_COUNT - 1)}
          >
            <svg viewBox="0 0 16 16">
              <path
                d="M10 3 5 8l5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            class=${this.isLastPage ? "disabled" : ""}
            title="下一页"
            @click=${() =>
              !this.isLastPage &&
              this.setTab((this.currentPage + 1) * PAGE_COUNT)}
          >
            <svg viewBox="0 0 16 16">
              <path
                d="m6 3 5 5-5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    ${this.hovered
      ? html`<div id="emoji-hover" style=${`left:${Math.min(this.hoverX + 12, window.innerWidth - 136)}px;top:${Math.max(8, this.hoverY - 132)}px`}>
          <div class="name">${this.hovered.text}</div>
          <img src=${this.hovered.webpUrl || this.hovered.gifUrl || this.hovered.url} alt=${this.hovered.text} />
        </div>`
      : nothing}`;
  }
}
