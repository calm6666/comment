import { html, LitElement, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Comment, Emote, Picture } from "../types/Comment";
import { MOCK_COMMENT_COUNT, MOCK_REPLIES } from "../mock/comments";
import { MOCK_EMOJI_PACKAGES } from "../mock/emojis";
import "./hl-comments-header";
import "./hl-comment-thread";
import "./hl-icon";
import { DEFAULT_AVATAR } from "./hl-comment-box";

const PAGE_SIZE = 10;

@customElement("hili-comments")
export class HiliComments extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      max-width: 900px;
      margin: 0 auto;
      color: var(--text1, #18191c);
      font-family: var(
        --hili-font-family,
        "PingFang SC",
        "Microsoft YaHei",
        sans-serif
      );
      -webkit-font-smoothing: antialiased;
    }
    #contents {
      position: relative;
    }
    #header {
      display: block;
    }
    #new {
      display: block;
    }
    #feed {
      min-height: 80px;
    }
    #state {
      padding: 32px 0;
      color: var(--text3, #9499a0);
      font-size: 14px;
      text-align: center;
    }
    #trigger {
      height: 1px;
    }
    #limit-mask {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;
      color: var(--text2, #61666d);
      font-size: 14px;
    }
    #limit-mask-wall {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent, #fff 42%);
      pointer-events: none;
    }
    #limit-mask-tip {
      position: relative;
      z-index: 1;
      cursor: pointer;
    }
    #reply-commentbox {
      display: none;
    }
    #reply-commentbox.open {
      display: block;
    }

    .bottombar {
      width: 100%;
      margin-top: 20px;
      font-size: 13px;
      color: var(--text3);
      text-align: center;
      user-select: none;
    }
    #end .bottombar {
      padding-bottom: 100px;
    }
    .hili-comments-bottom-fixed-wrapper {
      position: fixed;
      z-index: 9500;
      bottom: 0;
      display: none;
      padding: 8px 12px;
      box-sizing: border-box;
      border-top: 1px solid var(--line-regular, #e3e5e7);
      background: #fff;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
    }
    #toast {
      position: fixed;
      z-index: 10000;
      left: 50%;
      bottom: 80px;
      transform: translateX(-50%);
      padding: 8px 16px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.72);
      color: #fff;
      font-size: 13px;
    }
    #preview {
      position: fixed;
      z-index: 9999;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.82);
    }
    #preview .preview-img {
      display: block;
      max-width: 90vw;
      max-height: 84vh;
      object-fit: contain;
      user-select: none;
    }
    #preview-close,
    #preview-prev,
    #preview-next {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      background: transparent;
      color: #fff;
      cursor: pointer;
    }
    #preview-close {
      top: 20px;
      right: 24px;
      width: 40px;
      height: 40px;
    }
    #preview-close svg {
      width: 22px;
      height: 22px;
    }
    #preview-close:hover,
    #preview-prev:hover,
    #preview-next:hover {
      color: #ff6699;
    }
    #preview-prev {
      left: 24px;
      top: 50%;
      width: 48px;
      height: 48px;
      transform: translateY(-50%);
    }
    #preview-next {
      right: 24px;
      top: 50%;
      width: 48px;
      height: 48px;
      transform: translateY(-50%);
    }
    #preview-prev:disabled,
    #preview-next:disabled {
      opacity: 0.25;
      cursor: default;
    }
    @media (max-width: 640px) {
      :host {
        padding: 0 12px;
        box-sizing: border-box;
      }
      #preview-prev {
        left: 8px;
      }
      #preview-next {
        right: 8px;
      }
    }
  `;

  @property({ type: Boolean, attribute: "logged-in" }) loggedIn = false;
  @property({ type: Object }) currentUser: {
    userName: string;
    avatarUrl: string;
  } | null = null;

  @state() private replies: Comment[] = [];
  @state() private count = 0;
  @state() private page = 1;
  @state() private sort = 2;
  @state() private loading = false;
  @state() private replyTarget: { comment: Comment } | null = null;
  @state() private preview: { pictures: Picture[]; index: number } | null =
    null;
  @state() private toast = "";
  private keyHandler: ((event: KeyboardEvent) => void) | null = null;
  private triggerObserver: IntersectionObserver | null = null;
  private boxObserver: IntersectionObserver | null = null;
  private observedBox: HTMLElement | null = null;
  private observedHeader: HTMLElement | null = null;
  private observedTrigger: HTMLElement | null = null;

  private get hasMore(): boolean {
    return this.replies.length < this.count;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.loggedIn = localStorage.getItem("comment-demo-login") === "1";
    this.currentUser = this.loggedIn
      ? {
          userName: "演示用户",
          avatarUrl: DEFAULT_AVATAR,
        }
      : null;
    void this.load();
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeKeyHandler();
    this.triggerObserver?.disconnect();
    this.boxObserver?.disconnect();
    window.removeEventListener("scroll", this.onScroll);
  }

  override firstUpdated(): void {
    this.observeTrigger();
    this.observeBox();
  }

  override updated(): void {
    window.setTimeout(() => {
      this.observeTrigger();
      this.observeBox();
    }, 0);
  }

  private observeTrigger(): void {
    const trigger = this.renderRoot.querySelector(
      "#trigger",
    ) as HTMLElement | null;
    if (trigger === this.observedTrigger) return;
    this.triggerObserver?.disconnect();
    this.observedTrigger = trigger;
    if (!trigger) return;
    this.triggerObserver = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void this.loadMore();
    });
    this.triggerObserver.observe(trigger);
  }

  private observeBox(): void {
    const header = this.renderRoot.querySelector("hili-comments-header");
    const box = (header?.shadowRoot?.querySelector("hili-comment-box") ??
      this.renderRoot.querySelector(
        ".hili-comments-bottom-fixed-wrapper hili-comment-box",
      )) as HTMLElement | null;
    if (box === this.observedBox && box) return;
    this.boxObserver?.disconnect();
    this.observedBox = box;
    this.observedHeader = header as HTMLElement;
    if (!box) return;
    this.boxObserver = new IntersectionObserver(() => this.onScroll());
    this.boxObserver.observe(box);
  }

  private onScroll = (): void => {
    const box = this.observedBox;
    const header = this.observedHeader;
    if (!box || !header) return;
    const wrapper = this.renderRoot.querySelector(
      ".hili-comments-bottom-fixed-wrapper",
    ) as HTMLElement | null;
    const host = header.shadowRoot?.querySelector(
      "#commentbox",
    ) as HTMLElement | null;
    if (!wrapper || !host) return;
    const rect = header.getBoundingClientRect();
    const shouldFloat = this.loggedIn && !this.replyTarget && rect.bottom < 0;
    if (shouldFloat) {
      wrapper.style.display = "block";
      wrapper.style.width = `${rect.width}px`;
      wrapper.style.left = `${rect.left}px`;
      if (box.parentElement !== wrapper) wrapper.appendChild(box);
    } else {
      wrapper.style.display = "none";
      if (box.parentElement === wrapper) host.appendChild(box);
    }
  };

  private async load(): Promise<void> {
    this.loading = true;
    this.page = 1;
    await new Promise((resolve) => window.setTimeout(resolve, 120));
    const all = this.sorted();
    this.replies = all.slice(0, PAGE_SIZE);
    this.count = MOCK_COMMENT_COUNT;
    this.loading = false;
  }

  private sorted(): Comment[] {
    const all = structuredClone(MOCK_REPLIES);
    if (this.sort === 1) all.sort((a, b) => b.createdAt - a.createdAt);
    return all;
  }

  private async loadMore(): Promise<void> {
    if (this.loading || this.replies.length >= this.count) return;
    this.loading = true;
    this.page += 1;
    await new Promise((resolve) => window.setTimeout(resolve, 120));
    const all = this.sorted();
    const start = (this.page - 1) * PAGE_SIZE;
    this.replies = [...this.replies, ...all.slice(start, start + PAGE_SIZE)];
    this.loading = false;
  }

  private setSort(sort: number): void {
    if (this.sort === sort) return;
    this.sort = sort;
    void this.load();
  }

  private toggleLogin(): void {
    this.loggedIn = !this.loggedIn;
    localStorage.setItem("comment-demo-login", this.loggedIn ? "1" : "0");
    this.currentUser = this.loggedIn
      ? {
          userName: "演示用户",
          avatarUrl: DEFAULT_AVATAR,
        }
      : null;
  }

  private publish(detail: {
    message: string;
    pictures: string[];
    emotes: Record<string, Emote>;
  }): void {
    if (
      !this.currentUser ||
      (!detail.message.trim() && detail.pictures.length === 0)
    )
      return;
    const comment: Comment = {
      commentId: Date.now(),
      userId: this.currentUser.userName,
      likeCount: 0,
      createdAt: Date.now() / 1000,
      member: {
        userId: this.currentUser.userName,
        userName: this.currentUser.userName,
        avatarUrl: this.currentUser.avatarUrl,
        level: 6,
        isVip: false,
      },
      content: {
        message: detail.message,
        pictures: detail.pictures.map((src) => ({
          src,
          width: 300,
          height: 200,
        })),
        emotes: detail.emotes,
      },
      timeText: "刚刚发布",
    };
    if (this.replyTarget) {
      const target = this.replyTarget.comment;
      this.replies = this.replies.map((item) =>
        item.commentId === target.commentId
          ? {
              ...item,
              replies: [...(item.replies ?? []), comment],
              replyCount: (item.replyCount ?? 0) + 1,
            }
          : item,
      );
      this.restoreReplyBox();
      this.replyTarget = null;
    } else {
      this.replies = [comment, ...this.replies];
      this.count += 1;
    }
  }

  private replyTo(comment: Comment): void {
    if (this.replyTarget?.comment.commentId === comment.commentId) {
      this.restoreReplyBox();
      this.replyTarget = null;
      return;
    }
    this.replyTarget = { comment };
    requestAnimationFrame(() => {
      const threads = Array.from(
        this.renderRoot.querySelectorAll("hili-comment-thread"),
      );
      const thread = threads.find((item) => {
        const main = (item as unknown as { comment: Comment }).comment;
        return (
          main?.commentId === comment.commentId ||
          main?.replies?.some((reply) => reply.commentId === comment.commentId)
        );
      });
      const replies = thread?.shadowRoot?.querySelector("hili-comment-replies");
      const container = (replies?.shadowRoot?.querySelector(
        "#reply-container",
      ) ??
        thread?.shadowRoot?.querySelector(
          "#reply-container",
        )) as HTMLElement | null;
      const home = this.renderRoot.querySelector(
        "#reply-commentbox",
      ) as HTMLElement | null;
      const box = home?.querySelector("hili-comment-box") as HTMLElement | null;
      if (!container || !box) return;
      container.appendChild(box);
      container.scrollIntoView({ behavior: "smooth", block: "center" });
      const textarea = box.shadowRoot?.querySelector(
        "hili-comment-rich-textarea",
      ) as (HTMLElement & { focus(): void }) | null;
      textarea?.focus();
    });
  }

  private restoreReplyBox(): void {
    const home = this.renderRoot.querySelector(
      "#reply-commentbox",
    ) as HTMLElement | null;
    if (!home) return;
    let box = home.querySelector("hili-comment-box") as HTMLElement | null;
    if (!box) {
      for (const thread of Array.from(
        this.renderRoot.querySelectorAll("hili-comment-thread"),
      )) {
        box = (thread.shadowRoot
          ?.querySelector("hili-comment-replies")
          ?.shadowRoot?.querySelector("#reply-container hili-comment-box") ??
          thread.shadowRoot?.querySelector(
            "#reply-container hili-comment-box",
          )) as HTMLElement | null;
        if (box) break;
      }
    }
    if (box) home.appendChild(box);
  }

  private likeComment(detail: { commentId: number; liked: boolean }): void {
    const update = (comment: Comment): Comment => {
      if (comment.commentId === detail.commentId) {
        const wasLiked = Boolean(comment.liked);
        const delta = detail.liked === wasLiked ? 0 : detail.liked ? 1 : -1;
        return {
          ...comment,
          liked: detail.liked,
          disliked: detail.liked ? false : comment.disliked,
          likeCount: Math.max(0, comment.likeCount + delta),
        };
      }
      return comment.replies?.length
        ? { ...comment, replies: comment.replies.map(update) }
        : comment;
    };
    this.replies = this.replies.map(update);
  }

  private dislikeComment(detail: {
    commentId: number;
    disliked: boolean;
  }): void {
    const update = (comment: Comment): Comment => {
      if (comment.commentId === detail.commentId) {
        if (detail.disliked && comment.liked) {
          return {
            ...comment,
            disliked: true,
            liked: false,
            likeCount: Math.max(0, comment.likeCount - 1),
          };
        }
        return { ...comment, disliked: detail.disliked };
      }
      return comment.replies?.length
        ? { ...comment, replies: comment.replies.map(update) }
        : comment;
    };
    this.replies = this.replies.map(update);
  }

  private openPreview(detail: { pictures: Picture[]; index: number }): void {
    this.preview = { pictures: detail.pictures, index: detail.index };
    this.removeKeyHandler();
    this.keyHandler = (event: KeyboardEvent): void => {
      if (!this.preview) return;
      if (event.key === "Escape") this.closePreview();
      if (event.key === "ArrowLeft") this.stepPreview(-1);
      if (event.key === "ArrowRight") this.stepPreview(1);
    };
    window.addEventListener("keydown", this.keyHandler);
  }

  private closePreview(): void {
    this.removeKeyHandler();
    this.preview = null;
  }

  private removeKeyHandler(): void {
    if (!this.keyHandler) return;
    window.removeEventListener("keydown", this.keyHandler);
    this.keyHandler = null;
  }

  private stepPreview(delta: number): void {
    if (!this.preview) return;
    this.preview = {
      ...this.preview,
      index: Math.min(
        this.preview.pictures.length - 1,
        Math.max(0, this.preview.index + delta),
      ),
    };
  }

  private reportComment(detail: { commentId: number; reason: string }): void {
    this.dispatchEvent(
      new CustomEvent("comment-report", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
    this.toast = "举报已提交";
    window.setTimeout(() => (this.toast = ""), 1800);
  }

  private deleteComment(detail: { comment: Comment }): void {
    const nested = (comment: Comment): Comment =>
      comment.replies?.length
        ? {
            ...comment,
            replies: comment.replies.filter(
              (item) => item.commentId !== detail.comment.commentId,
            ),
          }
        : comment;
    this.replies = this.replies
      .filter((comment) => comment.commentId !== detail.comment.commentId)
      .map(nested);
    this.count = Math.max(0, this.count - 1);
    this.toast = "评论已删除";
    window.setTimeout(() => (this.toast = ""), 1600);
  }

  override render() {
    return html`
      <div id="header">
        <hili-comments-header
          .count=${this.count}
          .loggedIn=${this.loggedIn}
          .currentUser=${this.currentUser}
          .emojiPackages=${MOCK_EMOJI_PACKAGES}
          .sort=${this.sort}
          @sort-change=${(event: CustomEvent<{ sort: number }>) =>
            this.setSort(event.detail.sort)}
          @login-click=${() => this.toggleLogin()}
          @login-required=${() => this.toggleLogin()}
          @comment-submit=${(
            event: CustomEvent<{
              message: string;
              pictures: string[];
              emotes: Record<string, Emote>;
            }>,
          ) => this.publish(event.detail)}
        ></hili-comments-header>
      </div>
      <div id="contents">
        <div id="new"></div>
        <div id="feed">
          ${this.replies.map(
            (comment) =>
              html`<hili-comment-thread
                .comment=${comment}
                .loggedIn=${this.loggedIn}
                @comment-like=${(
                  event: CustomEvent<{ commentId: number; liked: boolean }>,
                ) => this.likeComment(event.detail)}
                @comment-dislike=${(
                  event: CustomEvent<{ commentId: number; disliked: boolean }>,
                ) => this.dislikeComment(event.detail)}
                @comment-reply=${(event: CustomEvent<{ comment: Comment }>) =>
                  this.replyTo(event.detail.comment)}
                @comment-report=${(
                  event: CustomEvent<{ commentId: number; reason: string }>,
                ) => this.reportComment(event.detail)}
                @comment-delete=${(event: CustomEvent<{ comment: Comment }>) =>
                  this.deleteComment(event.detail)}
                @open-preview=${(
                  event: CustomEvent<{ pictures: Picture[]; index: number }>,
                ) => this.openPreview(event.detail)}
                @login-required=${() => this.toggleLogin()}
              ></hili-comment-thread>`,
          )}
          ${this.loading
            ? html`<div id="state">加载中...</div>`
            : this.replies.length === 0
              ? html`<div id="state">还没有评论，快来抢沙发吧～</div>`
              : nothing}
          ${this.loggedIn && this.hasMore
            ? html`<div id="trigger"></div>`
            : nothing}
        </div>
        ${!this.loggedIn
          ? html`<div id="limit-mask">
              <div id="limit-mask-wall"></div>
              <div id="limit-mask-tip" @click=${() => this.toggleLogin()}>
                登录后查看 ${this.count} 条评论
              </div>
            </div>`
          : nothing}
        <div id="reply-commentbox" class=${this.replyTarget ? "open" : ""}>
          <hili-comment-box
            .loggedIn=${this.loggedIn}
            .currentUser=${this.currentUser}
            .replyTarget=${this.replyTarget}
            .emojiPackages=${MOCK_EMOJI_PACKAGES}
            @comment-submit=${(
              event: CustomEvent<{
                message: string;
                pictures: string[];
                emotes: Record<string, Emote>;
              }>,
            ) => this.publish(event.detail)}
            @comment-cancel=${() => {
              this.restoreReplyBox();
              this.replyTarget = null;
            }}
            @login-required=${() => this.toggleLogin()}
          ></hili-comment-box>
        </div>
      </div>
      ${!this.hasMore || !this.loggedIn
        ? html`<div id="end"><div class="bottombar">没有更多评论</div></div>`
        : nothing}
      <div class="hili-comments-bottom-fixed-wrapper"></div>
      ${this.toast ? html`<div id="toast">${this.toast}</div>` : nothing}
      ${this.preview
        ? html`<div
            id="preview"
            @click=${(event: Event) =>
              event.target === event.currentTarget && this.closePreview()}
          >
            <img
              class="preview-img"
              src=${this.preview.pictures[this.preview.index]?.src ?? ""}
              alt=""
            />
            <button
              id="preview-close"
              title="关闭"
              @click=${() => this.closePreview()}
            >
              <hili-icon name="xmark_close_line" .size=${22}></hili-icon>
            </button>
            <button
              id="preview-prev"
              title="上一张"
              ?disabled=${this.preview.index === 0}
              @click=${() => this.stepPreview(-1)}
            >
              <hili-icon name="arrow_back_left_line" .size=${28}></hili-icon>
            </button>
            <button
              id="preview-next"
              title="下一张"
              ?disabled=${this.preview.index ===
              this.preview.pictures.length - 1}
              @click=${() => this.stepPreview(1)}
            >
              <hili-icon
                name="arrow_forward_right_line"
                .size=${28}
              ></hili-icon>
            </button>
          </div>`
        : nothing}
    `;
  }
}
