import type { Comment, Picture } from '../types/Comment';

const svg = (width: number, height: number, color: string, label: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/><circle cx="${width * 0.2}" cy="${height * 0.3}" r="${height * 0.16}" fill="rgba(255,255,255,.18)"/><circle cx="${width * 0.82}" cy="${height * 0.7}" r="${height * 0.24}" fill="rgba(255,255,255,.12)"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Arial" font-size="${Math.round(height * 0.1)}" font-weight="600">${label}</text></svg>`,
  )}`;

const avatar = (color: string, label: string): string => svg(96, 96, color, label);
const picture = (label: string, color: string): Picture => ({ src: svg(800, 450, color, label), width: 800, height: 450 });

const member = (
  userId: string,
  userName: string,
  color: string,
  level: number,
  isVip = false,
  fanMedal?: { name: string; level: number; color: number },
  officialVerify?: string,
): Comment['member'] => ({
  userId,
  userName,
  avatarUrl: avatar(color, userName.slice(0, 1)),
  level,
  isVip,
  vipText: isVip ? "大会员" : undefined,
  vipBgColor: isVip ? "#fb7299" : undefined,
  vipTextColor: isVip ? "#ffffff" : undefined,
  fanMedal: fanMedal ?? null,
  officialVerify,
  officialType: officialVerify ? 0 : undefined,
});

const user1 = member('10001', '绪笔梦生花', '#7b8cff', 6, true, { name: '拾光', level: 12, color: 0xfb7299 });
const user2 = member('10002', '鬼谷紫薯派', '#58c7a9', 4, false, { name: '旅行者', level: 5, color: 0x66c2ff });
const user3 = member('10003', '小王书记的观察员', '#f4a261', 5);
const user4 = member('10004', '冬天的第一杯奶茶', '#e76f8a', 4, true);
const user5 = member('10005', '风经过的街道', '#8d9eff', 5, false, { name: '夜航星', level: 8, color: 0x9b8cff }, '个人认证');

const reply = (commentId: number, user: Comment['member'], message: string, timeText: string, likeCount = 0): Comment => ({
  commentId,
  userId: user.userId,
  likeCount,
  createdAt: Date.now() / 1000 - 3600,
  member: user,
  content: { message },
  timeText,
});

export const MOCK_COMMENT_COUNT = 12;

export const MOCK_REPLIES: Comment[] = [
  {
    commentId: 1001,
    userId: user1.userId,
    likeCount: 39,
    createdAt: Date.now() / 1000 - 172800,
    member: user1,
    isTop: true,
    upLiked: true,
    timeText: '2天前发布',
    content: {
      message:
        '手机-PC壁纸/音频文件：\nhttps://example.com/collection/9321086c2467\n00:00 带我去找夜生活\n04:59 樱花草\n09:43 Everywhere We Go\n14:03 5:20AM\n16:44 去年夏天\n20:49 夏天的风\n24:50 红色高跟鞋\n28:16 雨爱\n32:37 冬眠·2023\n35:49 戒不掉\n38:55 寂寞烟火\n43:08 罗生门\n47:11 下坠Falling\n50:57 心如止水\n54:02 越来越不懂\n58:12 最后一页\n\n这一版把夏天、夜风和耳机里的声音都收在一起了[打call]',
      emotes: {
        '[打call]': { type: 1, text: '[打call]', url: svg(40, 40, '#ffb533', '打'), size: 2 },
      },
    },
    replies: [
      reply(10011, user2, '这个歌单太适合夜晚走路了', '1天前发布', 3),
      reply(10012, user3, '已经收藏，感谢整理[星星眼]', '22小时前发布', 1),
      reply(10013, user4, '最后一页真的听了很多遍', '20小时前发布'),
      reply(10014, user5, '建议补一首《雨爱》的现场版', '18小时前发布'),
    ],
    replyCount: 4,
  },
  {
    commentId: 1002,
    userId: user2.userId,
    likeCount: 8,
    createdAt: Date.now() / 1000 - 86400,
    member: user2,
    timeText: '1天前发布',
    content: {
      message: '截了一张很喜欢的分镜，颜色特别舒服。',
      pictures: [picture('夏天的风', '#6d8fd8')],
    },
    replies: [reply(10021, user1, '这张适合当壁纸', '20小时前发布', 2)],
    replyCount: 1,
  },
  {
    commentId: 1003,
    userId: user3.userId,
    likeCount: 3,
    createdAt: Date.now() / 1000 - 72000,
    member: user3,
    timeText: '20小时前发布',
    content: {
      message:
        '同龄人还在写字楼里精巧地空虚，他已在烂泥里为故乡通了自来水。流量本是虚妄的孔雀翎，他却用来缝补老人的风湿与寂寞。',
    },
  },
  {
    commentId: 1004,
    userId: user4.userId,
    likeCount: 19,
    createdAt: Date.now() / 1000 - 43200,
    member: user4,
    timeText: '12小时前发布',
    content: {
      message: '截了两张图，一张是傍晚，一张是夜里。\n都很喜欢[星星眼]',
      pictures: [picture('傍晚', '#ea9a62'), picture('夜里', '#334f8f')],
      emotes: {
        '[星星眼]': { type: 1, text: '[星星眼]', url: svg(40, 40, '#ff86a6', '★'), size: 2 },
      },
    },
  },
  {
    commentId: 1005,
    userId: user5.userId,
    likeCount: 6,
    createdAt: Date.now() / 1000 - 36000,
    member: user5,
    timeText: '10小时前发布',
    content: { message: '这个镜头真的很有电影感，调色也很克制。' },
  },
  {
    commentId: 1006,
    userId: user1.userId,
    likeCount: 2,
    createdAt: Date.now() / 1000 - 18000,
    member: user1,
    timeText: '5小时前发布',
    content: {
      message: '很喜欢这一句：原来泥土深处，才长得出不流浪的灵魂。[笑]',
      emotes: {
        '[笑]': { type: 1, text: '[笑]', url: svg(40, 40, '#ffd84d', '笑'), size: 2 },
      },
    },
  },
  {
    commentId: 1007,
    userId: user2.userId,
    likeCount: 1,
    createdAt: Date.now() / 1000 - 10800,
    member: user2,
    timeText: '3小时前发布',
    content: { message: '@小王书记的观察员 你之前说的那期视频也是这个取景地吗？', members: ['小王书记的观察员'] },
  },
  {
    commentId: 1008,
    userId: user3.userId,
    likeCount: 0,
    createdAt: Date.now() / 1000 - 3600,
    member: user3,
    timeText: '1小时前发布',
    content: { message: '来晚了，先留个脚印，等会儿再认真看一遍。' },
  },
  {
    commentId: 1009,
    userId: user4.userId,
    likeCount: 7,
    createdAt: Date.now() / 1000 - 9000,
    member: user4,
    timeText: '4小时前发布',
    content: { message: '这种安静的力量比热闹更打动人。' },
  },
  {
    commentId: 1010,
    userId: user5.userId,
    likeCount: 4,
    createdAt: Date.now() / 1000 - 14400,
    member: user5,
    timeText: '4小时前发布',
    content: { message: '镜头里的风声和呼吸声都保留了，很真实。' },
  },
  {
    commentId: 1011,
    userId: user1.userId,
    likeCount: 5,
    createdAt: Date.now() / 1000 - 25200,
    member: user1,
    timeText: '7小时前发布',
    content: { message: '希望以后还能看到这样的记录。' },
  },
  {
    commentId: 1012,
    userId: user2.userId,
    likeCount: 2,
    createdAt: Date.now() / 1000 - 28800,
    member: user2,
    timeText: '8小时前发布',
    content: { message: '先收藏，晚上戴耳机再看一遍。' },
  },
];


const demoReplySeed = Array.from({ length: 10 }, (_, index) =>
  reply(20001 + index, user2, `分页测试回复 ${index + 1}`, `${index + 1}小时前发布`, index),
);
const rootComment = MOCK_REPLIES[0];
if (rootComment) {
  rootComment.replies = [...(rootComment.replies ?? []), ...demoReplySeed];
  rootComment.replyCount = rootComment.replies.length;
}
