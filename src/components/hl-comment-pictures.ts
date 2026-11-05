import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Picture } from "../types/Comment";

@customElement("hili-comment-pictures")
export class HiliCommentPictures extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    #content {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      max-width: 364px;
      margin-top: 8px;
    }
    button {
      display: block;
      flex: 0 0 auto;
      padding: 0;
      overflow: hidden;
      border: 0;
      border-radius: 6px;
      background: #f1f2f3;
      cursor: zoom-in;
    }
    button.single {
      width: 240px;
      height: 135px;
    }
    button:not(.single) {
      width: 180px;
      height: 101px;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    @media (max-width: 520px) {
      button.single {
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
      }
      button:not(.single) {
        width: calc(50% - 3px);
        height: auto;
        aspect-ratio: 16 / 9;
      }
    }
  `;

  @property({ type: Array }) pictures: Picture[] = [];

  private open(index: number): void {
    this.dispatchEvent(
      new CustomEvent("open-preview", {
        detail: { pictures: this.pictures, index },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`<div id="content">
      ${this.pictures.map(
        (picture, index) =>
          html`<button
            class=${this.pictures.length === 1 ? "single" : ""}
            @click=${() => this.open(index)}
            aria-label="查看评论图片"
          >
            <img
              src=${picture.src}
              alt="评论图片"
              loading="lazy"
              referrerpolicy="no-referrer"
            />
          </button>`,
      )}
    </div>`;
  }
}
