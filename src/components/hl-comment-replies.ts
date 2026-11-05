import { html, LitElement, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Comment } from "../types/Comment";
import "./hl-comment-reply";
import "./hl-text-button";

const PAGE_SIZE = 10;

@customElement("hili-comment-replies")
export class HiliCommentReplies extends LitElement {
  static override styles = css`
    :host { display: block; }
    #expander { margin-top: 8px; padding-left: 80px; }
    #reply-container { padding-left: 80px; }
    #expander-contents { display: block; }
    #expander-footer { margin-top: 4px; }
    #view-more { display: flex; align-items: center; color: var(--text3, #9499a0); font-size: 13px; }
    #view-more hili-text-button,
    #pagination-body hili-text-button,
    #pagination-foot hili-text-button { --_label-text-color: inherit; }
    #view-more hili-text-button { --_label-text-color: var(--text-link, #008ac5); }
    #pagination { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; color: var(--text3, #9499a0); font-size: 13px; }
    #pagination-head { margin-right: 4px; }
    #pagination-body { display: flex; align-items: center; gap: 8px; }
    #pagination-body hili-text-button.active { --_label-text-color: var(--brand-blue, #00aeec); }
    #pagination-foot { margin-left: 8px; }
  `;

  @property({ type: Object }) comment!: Comment;
  @property({ type: Boolean }) loggedIn = false;
  @state() private expanded = false;
  @state() private currentPage = 1;

  private get list(): Comment[] {
    return this.comment.replies ?? [];
  }

  private get totalPage(): number {
    return Math.ceil(this.list.length / PAGE_SIZE);
  }

  private get needsPagination(): boolean {
    return this.list.length > PAGE_SIZE;
  }

  private get pageItems(): Comment[] {
    if (!this.expanded) return this.list.slice(0, 1);
    const start = (this.currentPage - 1) * PAGE_SIZE;
    return this.list.slice(start, start + PAGE_SIZE);
  }

  private changePage(page: number): void {
    if (page < 1 || page > this.totalPage) return;
    this.currentPage = page;
  }

  override render() {
    if (this.list.length === 0) return nothing;
    return html`
      <div id="expander">
        <div id="expander-contents">
          ${this.pageItems.map(
            (reply) => html`<hili-comment-reply .comment=${reply} .loggedIn=${this.loggedIn}></hili-comment-reply>`,
          )}
          <div id="expander-footer">
            ${!this.expanded
              ? html`<div id="view-more">
                  <span>共${this.list.length}条回复，</span>
                  <hili-text-button @click=${() => (this.expanded = true)}>点击查看</hili-text-button>
                </div>`
              : this.needsPagination
                ? html`<div id="pagination">
                    <div id="pagination-head">共${this.totalPage}页</div>
                    <div id="pagination-body">
                      ${Array.from({ length: this.totalPage }, (_, index) => index + 1).map(
                        (page) => html`<hili-text-button data-idx=${page - 1} class=${page === this.currentPage ? "active" : ""} @click=${() => this.changePage(page)}>${page}</hili-text-button>`,
                      )}
                      ${this.currentPage < this.totalPage
                        ? html`<hili-text-button @click=${() => this.changePage(this.currentPage + 1)}>下一页</hili-text-button>`
                        : nothing}
                    </div>
                    <div id="pagination-foot"><hili-text-button @click=${() => { this.expanded = false; this.currentPage = 1; }}>收起</hili-text-button></div>
                  </div>`
                : nothing}
          </div>
        </div>
      </div>
      <div id="reply-container"></div>
    `;
  }
}
