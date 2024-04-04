export interface UserProps {
  id: number,
  firstName: string,
  lastName: string,
  profilePicture?: string,
  coverPicture?: string,
  gender: string,
  email: string,
  bio?: string,
  addressFrom?: string,
  createdAt: string,
  updatedAt?: string,
  disabledAt?: string,
  friends: FriendProps[],
  friendRequestSent: FriendProps[],
  friendRequest: FriendProps,
  areFriends?: boolean,
  sharedPosts: Share[]
}

export interface PostProps {
  id: number,
  featureImage?: string,
  description: string,
  shares: ShareProps[]
  author: UserProps,
  likes: LikeProps[],
  comments: CommentProps[],
  notifications: NotificationProps[],
  content?: PostProps,
  contentId?: number,
  share?: ShareProps,
  type: string,
  createdAt: string,
  updatedAt?: string
}

interface CountProps {
  likes: number,
  comments: number
}

export interface LikeProps {
  id: number,
  userId: number,
  post: PostProps,
  postId: number,
  user: UserProps,
  createdAt: string,
  updatedAt?: string
}

export interface CommentProps {
  postId: number,
  comment: string,
  author: UserProps,
  post: PostProps,
  replies: CommentProps[],
  createdAt: string,
  updatedAt?: string
}

export interface FriendProps {
  id: number,
  user: UserProps,
  userId: number,
  friend: UserProps,
  friendId: number,
  status: string,
  createdAt: string,
  updatedAt?: string
}

export enum Notification {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  FRIENDREQUEST = "FRIENDREQUEST"
}

export interface NotificationProps {
  id: number,
  recipient: UserProps,
  recipientId: number,
  sender: UserProps,
  senderId: number,
  type: Notification,
  post: PostProps,
  postId: number,
  createdAt: string,
  updatedAt?: string
}

export interface ShareProps {
  id: number,
  sharer: UserProps,
  sharerId: number,
  post: PostProps,
  originalPost: PostProps,
  originalPostId: number,
  postId: number,
  createdAt: string,
  updatedAt?: string
}

export interface SavedProps {
  id: number,
  savedBy: UserProps,
  userId: number,
  content: PostProps,
  contentId: number,
  createdAt: string,
  updatedAt?: string
}