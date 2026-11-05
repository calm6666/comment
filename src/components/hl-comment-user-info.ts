import { html, LitElement, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Member } from "../types/Comment";

@customElement("hili-comment-user-info")
export class HiliCommentUserInfo extends LitElement {
  static override styles = css`
    :host {
      display: block;
      min-width: 0;
    }
    #info {
      display: flex;
      align-items: center;
      min-width: 0;
    }
    #user-name {
      margin-right: 5px;
      max-width: 200px;
      overflow: hidden;
      color: var(--text2, #61666d);
      font-size: 13px;
      line-height: 19px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #user-name a {
      color: inherit;
      text-decoration: none;
    }
    #user-name a:hover {
      color: var(--brand-blue, #00aeec);
    }
    #user-level {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
    }
    #user-level img {
      display: block;
      width: 30px;
      height: 30px;
    }
    #vip {
      display: inline-flex;
      align-items: center;
      margin-left: 5px;
    }
    #vip img {
      display: block;
      height: 18px;
      width: auto;
    }
    #vip label {
      display: inline-flex;
      align-items: center;
      height: 18px;
      padding: 0 4px;
      border-radius: 2px;
      font-size: 11px;
      line-height: 18px;
      white-space: nowrap;
    }
    #fan-medal {
      display: inline-flex;
      align-items: center;
      height: 16px;
      margin-left: 5px;
      border-radius: 2px;
      overflow: hidden;
      font-size: 11px;
      line-height: 16px;
      white-space: nowrap;
    }
    #fan-medal .name {
      padding: 0 4px;
      color: #fff;
      background: var(--medal-color, #fb7299);
    }
    #fan-medal .level {
      padding: 0 3px;
      color: var(--medal-color, #fb7299);
      background: #fff;
      border: 1px solid var(--medal-color, #fb7299);
    }
    #ov {
      margin-left: 5px;
      color: var(--text3, #9499a0);
      font-size: 11px;
      white-space: nowrap;
    }
  `;

  @property({ type: Object }) member!: Member;

  private get levelImage(): string {
    return `/levels/level_${this.member.level}.svg`;
  }

  override render() {
    const member = this.member;
    if (!member) return nothing;
    const medalColor = member.fanMedal
      ? `#${member.fanMedal.color.toString(16).padStart(6, "0")}`
      : "";
    return html`
      <div id="info">
        <slot></slot>
        <div id="user-name">
          <a
            href=${`/space/${member.userId}`}
            target="_blank"
            rel="noopener noreferrer"
            >${member.userName}</a
          >
        </div>
        ${member.level > 0
          ? html`<div id="user-level">
              <img width="30" height="30" src=${this.levelImage} alt="" />
            </div>`
          : nothing}
        ${member.isVip && (member.vipLabelUrl || member.vipText)
          ? html`<div id="vip">
              ${member.vipLabelUrl
                ? html`<img src=${member.vipLabelUrl} alt="" />`
                : html`<label style=${`background-color:${member.vipBgColor ?? "#fb7299"};color:${member.vipTextColor ?? "#fff"}`}><span>${member.vipText}</span></label>`}
            </div>`
          : nothing}
        ${member.fanMedal
          ? html`<div
              id="fan-medal"
              style=${medalColor ? `--medal-color:${medalColor}` : ""}
            >
              <span class="name">${member.fanMedal.name}</span
              ><span class="level">${member.fanMedal.level}</span>
            </div>`
          : nothing}
        ${member.officialVerify
          ? html`<div id="ov"><i id="ov-icon" class=${`ov-${member.officialType ?? 0}`}></i><span>${member.officialVerify}</span></div>`
          : nothing}
      </div>
    `;
  }
}
