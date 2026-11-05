import { html, LitElement, css, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Comment } from "../types/Comment";

const TOKEN = /(\[[^\]]+\])|(https?:\/\/[^\s<]+)|(@[^\s@]+)/g;

@customElement("hili-comment-rich-text")
export class HiliCommentRichText extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    #contents {
      display: block;
      color: var(--text1, #18191c);
      font-size: 15px;
      line-height: 21px;
      white-space: pre-line;
      word-break: break-word;
      overflow-wrap: anywhere;
    }
    a {
      color: var(--text-link, #008ac5);
      text-decoration: none;
    }
    a:hover {
      color: var(--brand-blue, #00aeec);
    }
    img {
      display: inline-block;
      width: 1.2em;
      height: 1.2em;
      margin: 0 1px;
      vertical-align: sub;
      object-fit: contain;
    }
    .at {
      color: var(--text-link, #008ac5);
    }
  `;

  @property({ type: Object }) comment!: Comment;

  private link(url: string): TemplateResult {
    const clean = url.replace(/[),.;!?，。；！？]+$/, "");
    return html`<a href=${clean} target="_blank" rel="noopener noreferrer"
      >${clean}</a
    >`;
  }

  override render() {
    const content = this.comment.content;
    const message = content.message ?? "";
    const emotes = content.emotes ?? {};
    const members = new Set(content.members ?? []);
    const nodes: Array<TemplateResult | string> = [];
    let last = 0;
    let match: RegExpExecArray | null;
    TOKEN.lastIndex = 0;
    while ((match = TOKEN.exec(message))) {
      if (match.index > last) nodes.push(message.slice(last, match.index));
      const [raw, emoteText, url, at] = match;
      if (emoteText) {
        const emote = emotes[emoteText];
        nodes.push(
          emote
            ? html`<img
                src=${emote.url}
                alt=${emoteText}
                title=${emoteText}
                referrerpolicy="no-referrer"
              />`
            : raw,
        );
      } else if (url) {
        nodes.push(this.link(url));
      } else if (at) {
        nodes.push(
          html`<span class=${members.has(at.slice(1)) ? "at" : ""}
            >${at}</span
          >`,
        );
      }
      last = match.index + raw.length;
    }
    if (last < message.length) nodes.push(message.slice(last));
    return html`<p id="contents">${nodes.length ? nodes : nothing}</p>`;
  }
}
