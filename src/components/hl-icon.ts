import { html, LitElement, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

const modules = import.meta.glob("../icons/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

@customElement("hili-icon")
export class HiliIcon extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: currentColor;
    }
    svg {
      display: block;
      width: var(--icon-size, 16px);
      height: var(--icon-size, 16px);
    }
  `;

  @property({ type: String }) name = "";
  @property({ type: Number }) size = 16;
  @state() private svg = "";

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("name")) {
      this.svg = modules[`../icons/${this.name}.svg`] ?? "";
    }
  }

  override render() {
    if (!this.svg) return nothing;
    return html`<span style=${`--icon-size:${this.size}px`}>${unsafeSVG(this.svg)}</span>`;
  }
}
