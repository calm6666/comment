import { html, LitElement, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Comment } from "../types/Comment";
import "./hl-comment-menu";
import "./hl-icon"

@customElement("hili-comment-actions")
export class HiliCommentActions extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 3px;
      color: var(--text3, #9499a0);
      font-size: 13px;
      line-height: 24px;
    }
    :host > :not(:first-child) {
      margin-left: 20px;
    }
    button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 24px;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    button:hover,
    button.active {
      color: var(--brand-blue, #00aeec);
    }
    #up-like {
      color: var(--brand-blue, #00aeec);
      white-space: nowrap;
    }
    #more {
      position: relative;
      width: 24px;
      height: 24px;
      margin-left: auto;
      margin-right: 20px;
    }
    #more > button {
      width: 24px;
      height: 24px;
      justify-content: center;
      opacity: 0;
    }
    :host(:hover) #more > button,
    #more > button:focus-visible {
      opacity: 1;
    }
    @media (hover: none) {
      #more > button {
        opacity: 1;
      }
    }
  `;

  @property({ type: Object }) comment!: Comment;
  @property({ type: Boolean }) loggedIn = false;
  @state() private menuOpen = false;

  private requireLogin(): boolean {
    if (this.loggedIn) return true;
    this.dispatchEvent(new CustomEvent("login-required", { bubbles: true, composed: true }));
    return false;
  }

  private like(): void {
    if (!this.requireLogin()) return;
    this.dispatchEvent(
      new CustomEvent("comment-like", {
        detail: { commentId: this.comment.commentId, liked: !this.comment.liked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private dislike(): void {
    if (!this.requireLogin()) return;
    this.dispatchEvent(
      new CustomEvent("comment-dislike", {
        detail: { commentId: this.comment.commentId, disliked: !this.comment.disliked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private reply(): void {
    if (!this.requireLogin()) return;
    this.dispatchEvent(
      new CustomEvent("comment-reply", { detail: { comment: this.comment }, bubbles: true, composed: true }),
    );
  }

  private report(reason: string): void {
    this.menuOpen = false;
    this.dispatchEvent(
      new CustomEvent("comment-report", {
        detail: { commentId: this.comment.commentId, reason },
        bubbles: true,
        composed: true,
      }),
    );
  }


  override render() {
    return html`
      <div id="pubdate">${this.comment.timeText ?? ""}</div>
      <div id="like">
        <button class=${this.comment.liked ? "active" : ""} @click=${() => this.like()}>
          <hili-icon .name=${this.comment.liked ? "hand_thumbsup_fill" : "hand_thumbsup_line"} .size=${16}></hili-icon>
          <span>${this.comment.likeCount || ""}</span>
        </button>
      </div>
      ${this.comment.upLiked ? html`<div id="up-like">UP主觉得很赞</div>` : nothing}
      <div id="dislike">
        <button class=${this.comment.disliked ? "active" : ""} title="点踩" @click=${() => this.dislike()}>
          <hili-icon .name=${this.comment.disliked ? "hand_thumbsdown_fill" : "hand_thumbsdown_line"} .size=${16}></hili-icon>
        </button>
      </div>
      <div id="reply"><button @click=${() => this.reply()}>回复</button></div>
      <div id="more">
        <button title="更多" @click=${() => (this.menuOpen = !this.menuOpen)}>
          <hili-icon name="more_vertical_fill" .size=${16}></hili-icon>
        </button>
        ${this.menuOpen
          ? html`<hili-comment-menu
              .loggedIn=${this.loggedIn}
              @report=${() => this.report("other")}
            ></hili-comment-menu>`
          : nothing}
      </div>
    `;
  }
}
