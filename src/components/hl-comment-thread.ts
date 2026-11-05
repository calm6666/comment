import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Comment } from "../types/Comment";
import "./hl-comment";
import "./hl-comment-replies";

@customElement("hili-comment-thread")
export class HiliCommentThread extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    #reply-container {
      padding-left: 80px;
    }
    #divider {
      height: 1px;
      margin: 16px 0 16px 80px;
      background: var(--line-regular, #e3e5e7);
    }
  `;

  @property({ type: Object }) comment!: Comment;
  @property({ type: Boolean }) loggedIn = false;

  override render() {
    return html`
      <hili-comment
        .comment=${this.comment}
        .loggedIn=${this.loggedIn}
      ></hili-comment>
      <div id="replies">
        <hili-comment-replies
          .comment=${this.comment}
          .loggedIn=${this.loggedIn}
        ></hili-comment-replies>
      </div>
      <div id="reply-container"></div>
      <div id="divider"></div>
    `;
  }
}
