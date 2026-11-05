import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './hl-icon'

@customElement('hili-comments-notice')
export class HiliCommentNotice extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    #bar {
      display: flex;
      align-items: center;
      position: relative;
      height: 40px;
      padding: 0 10px;
      font-size: 12px;
      color: var(--Ye5_u);
      cursor: pointer;
    }

    #bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 2px;
      background-color: var(--Ye5_u);
      opacity: 0.2;
      pointer-events: none;
    }

    #title {
      position: relative;
      z-index: 1;
      margin-right: auto;
      flex: 1;
      padding: 0 5px;
      vertical-align: top;
      word-wrap: break-word;
      word-break: break-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #close {
      position: relative;
      z-index: 1;
      display: flex;
    }
  `;

  @property({ type: Object }) comment!: Comment;

  override render() {
    return html`
      <div id="bar" style="display:flex;">
        <div id="bg"></div>
        <hili-icon name="speaker_notice_fill" size="14"></hili-icon>
        <div id="title">秦牧解锁新皮肤，女主男装初登场！</div>
        <div id="close">
          <hili-icon name="xmark_close_line" size="16"></hili-icon>
        </div>
      </div>
    `;
  }
}