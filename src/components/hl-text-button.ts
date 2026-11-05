import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("hili-text-button")
export class HiliTextButton extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      height: var(--_container-height);
      outline: none;
      font-family: var(--_label-text-font);
      font-size: var(--_label-text-size);
      line-height: var(--_label-text-line-height);
      font-weight: var(--_label-text-weight);
      -webkit-tap-highlight-color: transparent;
      vertical-align: middle;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border: none;
      outline: none;
      user-select: none;
      appearance: none;
      background: rgba(0, 0, 0, 0);
      text-decoration: none;
      inline-size: 100%;
      position: relative;
      z-index: 0;
      height: 100%;
      font: inherit;
      color: var(--_label-text-color);
      padding-inline-start: var(--_leading-space);
      padding-inline-end: var(--_trailing-space);
      cursor: pointer;
    }

    .button:not([disabled]):hover {
      color: var(--_label-text-color-hover, var(--brand_blue));
    }

    .button::before {
      background-color: var(--_container-color);
      border-radius: inherit;
      content: "";
      inset: 0px;
      position: absolute;
    }
  `;

  @property({ type: Object }) comment!: Comment;

  override render() {
    return html`
      <button class="button">
        <slot name="icon"></slot>
        <span class="button__label">
          <slot></slot>
        </span>
      </button>
    `;
  }
}
