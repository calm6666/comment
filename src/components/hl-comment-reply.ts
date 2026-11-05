import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Comment } from "../types/Comment";
import "./hl-comment-user-info";
import "./hl-comment-rich-text";
import "./hl-comment-actions";

@customElement("hili-comment-reply")
export class HiliCommentReply extends LitElement {
  static override styles = css`
    :host { display: block; }
    #body { display: block; }
    #main { display: block; }
    #user-avatar {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 6px;
      vertical-align: middle;
    }
    #user-avatar img {
      display: block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }
    #footer { margin-top: 2px; }
  `;

  @property({ type: Object }) comment!: Comment;
  @property({ type: Boolean }) loggedIn = false;

  override render() {
    const member = this.comment.member;
    return html`
      <div id="body">
        <div id="main">
          <hili-comment-user-info .member=${member}>
            <a
              id="user-avatar"
              href=${`/space/${member.userId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                width="24"
                height="24"
                src=${member.avatarUrl}
                alt=${member.userName}
                referrerpolicy="no-referrer"
              />
            </a>
          </hili-comment-user-info>
          <hili-comment-rich-text .comment=${this.comment}></hili-comment-rich-text>
        </div>
        <div id="footer">
          <hili-comment-actions
            .comment=${this.comment}
            .loggedIn=${this.loggedIn}
          ></hili-comment-actions>
        </div>
      </div>
    `;
  }
}
