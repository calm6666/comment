import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("hili-checkbox")
export class HiliCheckbox extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: baseline;
      cursor: pointer;
      --checkbox-size: 16px;
      --checkbox-color: var(--brand-blue, #00aeec);
    }
    #input {
      position: relative;
      display: inline-block;
      width: var(--checkbox-size);
      height: var(--checkbox-size);
      align-self: center;
      border-radius: 2px;
    }
    #input input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }
    #inner {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid var(--text4, #c9ccd0);
      border-radius: 2px;
      background: var(--bg1, #fff);
      transition: all 0.3s ease-in-out;
    }
    #input[checked] #inner {
      border-color: var(--checkbox-color);
      background-color: var(--checkbox-color);
    }
    #input[checked] #inner::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 25%;
      width: 4px;
      height: 8px;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg) translate(-50%, -50%);
    }
    #label {
      margin-left: 8px;
      color: var(--text2, #61666d);
      font-size: 14px;
      line-height: 16px;
    }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: String }) label = "";
  @property({ type: String }) value = "";

  private change(): void {
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value, checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <span id="input" ?checked=${this.checked} @click=${() => this.change()}>
        <input type="checkbox" .checked=${this.checked} />
        <span id="inner"></span>
      </span>
      <span id="label">${this.label}</span>
    `;
  }
}
