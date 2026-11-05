import { html, LitElement, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Comment } from "../types/Comment";
import "./hl-avatar";
import "./hl-comment-user-info";
import "./hl-comment-rich-text";
import "./hl-comment-pictures";
import "./hl-comment-actions";

@customElement("hili-comment")
export class HiliComment extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    #body {
      position: relative;
      min-width: 0;
      padding: 22px 0 0 80px;
    }
    #user-avatar {
      position: absolute;
      left: 20px;
      top: 22px;
      display: block;
      width: 48px;
      height: 48px;
    }
    #user-avatar img {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    #main {
      min-width: 0;
    }
    #header {
      display: flex;
      align-items: center;
      min-width: 0;
    }
    #top-tag {
      display: inline-flex;
      align-items: center;
      height: 18px;
      margin-right: 6px;
      padding: 0 4px;
      border-radius: 2px;
      background: #ff6699;
      color: #fff;
      font-size: 11px;
      flex-shrink: 0;
    }
    #content {
      display: block;
      overflow: hidden;
      margin-top: 6px;
    }
    #content.collapsed {
      max-height: 126px;
    }
    #expand {
      color: var(--brand-blue, #00aeec);
      cursor: pointer;
      font-size: var(--bili-comments-font-size-content, 13px);
      line-height: var(--bili-comments-line-height-content, 24px);
    }
    #pictures {
      display: block;
    }
    #tags {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 6px;
    }
    .tag {
      padding: 4px 6px;
      border-radius: 2px;
      color: #757575;
      background: #f4f4f4;
      font-size: 12px;
      line-height: 1;
    }
    #footer {
      margin-top: 2px;
    }
  `;

  @property({ type: Object }) comment!: Comment;
  @property({ type: Boolean }) loggedIn = false;
  @state() private expanded = false;

  private get isLong(): boolean {
    const message = this.comment.content.message ?? "";
    return message.length > 200 || message.split("\n").length > 6;
  }

  override render() {
    const member = this.comment.member;
    return html`
      <div id="body">
        <a
          id="user-avatar"
          href=${`/space/${member.userId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <hili-avatar .src=${member.avatarUrl} .size=${48}></hili-avatar>
        </a>
        <div id="main">
          <div id="header">
            ${this.comment.isTop
              ? html`<span id="top-tag">置顶</span>`
              : nothing}
            <hili-comment-user-info .member=${member}></hili-comment-user-info>
          </div>
          <div
            id="content"
            class=${this.isLong && !this.expanded ? "collapsed" : ""}
          >
            <hili-comment-rich-text
              .comment=${this.comment}
            ></hili-comment-rich-text>
            ${this.comment.content.pictures?.length
              ? html`<div id="pictures"><div id="pic"><hili-comment-pictures .pictures=${this.comment.content.pictures}></hili-comment-pictures></div></div>`
              : nothing}
          </div>
          ${this.isLong
            ? html`<span id="expand" @click=${() => (this.expanded = !this.expanded)}>${this.expanded ? "收起" : "展开"}</span>`
            : nothing}
          <div id="footer">
            <hili-comment-actions
              .comment=${this.comment}
              .loggedIn=${this.loggedIn}
            ></hili-comment-actions>
          </div>
          ${this.comment.cardLabel
            ? html`<div id="tags">
                <span class="tag">${this.comment.cardLabel}</span>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }
}
