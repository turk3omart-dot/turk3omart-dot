
export type MomentType = 'thought' | 'photo' | 'music' | 'location' | 'sleep' | 'wake' | 'video' | 'attachment';

export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  bio: string;
  email?: string;
  phone?: string;
  dob?: string; // ISO format
  stats: {
    moments: number;
    friends: number;
    lastActive: string;
  };
}

export interface Reaction {
  type: string; // 'love', 'smile', 'wow', 'sad', 'check'
  label: string;
  count: number;
  userIds: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: Date;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    id: string;
  };
  lastMessage: string;
  timestamp: Date;
  unread?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'reaction' | 'comment' | 'friend_request' | 'birthday';
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
  targetId?: string; // e.g., momentId
}

export interface Moment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: MomentType;
  content: string;
  mediaUrl?: string;
  location?: string;
  timestamp: Date;
  reactions: Reaction[];
  comments?: Comment[];
}

export type AppScreen = 'onboarding' | 'registration' | 'timeline' | 'profile' | 'friends' | 'messages' | 'chat' | 'edit-profile' | 'notifications' | 'settings' | 'circle';
