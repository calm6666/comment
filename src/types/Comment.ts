export interface Picture {
  src: string;
  width: number;
  height: number;
}

export interface Emote {
  id?: number;
  type: number;
  text: string;
  url: string;
  gifUrl?: string;
  webpUrl?: string;
  size: number;
}

export interface FanMedal {
  name: string;
  level: number;
  color: number;
}

export interface Member {
  userId: string;
  userName: string;
  avatarUrl: string;
  level: number;
  isVip: boolean;
  vipLabelUrl?: string;
  vipText?: string;
  vipBgColor?: string;
  vipTextColor?: string;
  fanMedal?: FanMedal | null;
  officialVerify?: string;
  officialType?: number;
}

export interface CommentContent {
  message: string;
  pictures?: Picture[];
  emotes?: Record<string, Emote>;
  members?: string[];
}

export interface Comment {
  commentId: number;
  userId: string;
  likeCount: number;
  createdAt: number;
  member: Member;
  content: CommentContent;
  replies?: Comment[];
  replyCount?: number;
  liked?: boolean;
  disliked?: boolean;
  isTop?: boolean;
  upLiked?: boolean;
  timeText?: string;
  cardLabel?: string;
}

export interface EmojiPackage {
  packageId: number;
  text: string;
  iconUrl: string;
  emotes: Emote[];
}
