import { html, LitElement, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("hili-comment-pictures-upload")
export class HiliCommentPicturesUpload extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    #pictures {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
      max-width: 364px;
    }
    .picture {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 6px;
      overflow: hidden;
      background: #f1f2f3;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .remove {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 18px;
      height: 18px;
      border: 0;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      line-height: 18px;
      cursor: pointer;
    }
    input {
      display: none;
    }
  `;

  @property({ type: Array }) pictures: string[] = [];
  @property({ type: Number }) max = 9;
  @property({ type: Boolean }) disabled = false;

  private open(): void {
    if (this.disabled) return;
    this.renderRoot.querySelector<HTMLInputElement>("input")?.click();
  }

  private async onFiles(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files).slice(
      0,
      this.max - this.pictures.length,
    );
    const images = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(file);
          }),
      ),
    );
    this.emit([...this.pictures, ...images]);
    input.value = "";
  }

  private emit(pictures: string[]): void {
    this.pictures = pictures;
    this.dispatchEvent(
      new CustomEvent("pictures-change", {
        detail: { pictures },
        bubbles: true,
        composed: true
      }),
    );
  }

  openFileDialog(): void {
    this.open();
  }

  override render() {
    return html`
      <input
        type="file"
        accept="image/*"
        multiple
        @change=${(event: Event) => void this.onFiles(event)}
      />
      ${this.pictures.length
        ? html`<div id="pictures">
            ${this.pictures.map(
              (src, index) =>
                html`<div class="picture">
                  <img src=${src} alt="" />
                  <button
                    class="remove"
                    @click=${() =>
                      this.emit(this.pictures.filter((_, i) => i !== index))}
                  >
                    x
                  </button>
                </div>`,
            )}
          </div>`
        : nothing}
    `;
  }
}
