import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("hili-avatar")
export class HiliAvatar extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      width: var(--avatar-size, 48px);
      height: var(--avatar-size, 48px);
      flex-shrink: 0;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  `;

  @property({ type: String }) src = "";
  @property({ type: Number }) size = 48;

  override render() {
    return html`<img
      src=${this.src}
      width=${this.size}
      height=${this.size}
      alt=""
      referrerpolicy="no-referrer"
      style=${`--avatar-size:${this.size}px`}
    />`;
  }
}
