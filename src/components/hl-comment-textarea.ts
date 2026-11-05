import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("hili-comment-rich-textarea")
export class HiliCommentTextarea extends LitElement {
  static override styles = css`
    :host { display: flex; width: 100%; }
    #input {
      width: 100%;
      min-height: 32px;
      max-height: 100px;
      line-height: 32px;
      font-size: 14px;
      font-family: inherit;
      color: var(--text1, #18191c);
      background: transparent;
      box-sizing: border-box;
    }
    .brt-root { position: relative; width: 100%; }
    .brt-placeholder {
      position: absolute;
      left: 8px;
      top: 0;
      color: var(--text3, #9499a0);
      font-size: 14px;
      line-height: 32px;
      pointer-events: none;
    }
    .brt-editor {
      outline: none;
      border: none;
      box-sizing: border-box;
      padding: 0 8px;
      font-size: 14px;
      line-height: 22px;
      min-height: 22px;
      max-height: 100px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
  `;

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @state() private hasContent = false;

  private get editor(): HTMLDivElement | null {
    return this.renderRoot.querySelector(".brt-editor");
  }

  override firstUpdated(): void {
    this.syncEditor();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("value")) this.syncEditor();
  }

  private syncEditor(): void {
    const editor = this.editor;
    if (!editor) return;
    if (editor.innerText !== this.value) {
      editor.innerText = this.value;
    }
    this.hasContent = this.value.length > 0;
  }

  private onInput(): void {
    this.value = this.editor?.innerText ?? "";
    this.hasContent = this.value.length > 0;
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onFocus(): void {
    this.dispatchEvent(new CustomEvent("focus", { bubbles: true, composed: true }));
  }

  override focus(): void {
    this.editor?.focus();
  }

  insertText(text: string): void {
    const editor = this.editor;
    if (!editor) return;
    editor.focus();
    document.execCommand("insertText", false, text);
    this.onInput();
  }

  override render() {
    return html`
      <div id="input">
        <div class="brt-root">
          ${!this.hasContent
            ? html`<div class="brt-placeholder">${this.placeholder}</div>`
            : ""}
          <div
            class="brt-editor"
            contenteditable="true"
            @input=${() => this.onInput()}
            @focus=${() => this.onFocus()}
          ></div>
        </div>
      </div>
    `;
  }
}
