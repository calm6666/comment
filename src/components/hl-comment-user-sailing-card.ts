import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("hili-comment-user-sailing-card")
export class HiliCommentUserSailingCard extends LitElement {
  static override styles = css`
    #card {
      width: 288px;
      height: 48px;
      position: relative;
      overflow: hidden;
      user-select: none;
    }

    ._cardBg_1aw9v_13 {
      display: inline-block;
      position: relative;
      user-select: none;
      height: 48px;
      max-width: 288px;
      overflow: hidden;
    }

    #card div {
      height: 100%;
      max-width: 100%;
    }

    ._hfsImg_aob6i_6 {
      display: block;
    }

    ._fanText_1aw9v_21 {
      height: 100%;
      font-size: 13px;
      line-height: 16px;
      transform: scale(0.7);
      transform-origin: center center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    ._cardBg_1aw9v_13 ._fanTextPosition_1aw9v_21 {
      position: absolute;
      right: 0;
      top: 0;
    }

    ._fanText_1aw9v_21 > span {
      font-family: fans-num, sans-serif !important;
    }
  `;

  @property({ type: Object }) comment!: Comment;

  override render() {
    return html`
      <div id="card">
        <div class="_cardBg_1aw9v_13">
          <img
            src="https://io.v.hblog.top/hfs/garb/open/87919eb4dca47a5ce35c49a6f336c49d9083ddae.png@96h.webp"
            class="_hfsImg_aob6i_6 undefined"
            style="width: auto; height: 48px; object-fit: cover;"
          />
          <div
            class="_fanText_1aw9v_21 _fanTextPosition_1aw9v_21"
            style="background-image: linear-gradient(135deg, rgb(184, 199, 208) 0%, rgb(162, 167, 176) 100%); -webkit-text-fill-color: transparent; background-clip: text;"
          >
            <span>CD.</span>
            <span>001858</span>
          </div>
        </div>
      </div>
    `;
  }
}
