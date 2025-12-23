
import { Moment } from './types';
import { Heart, Smile, Zap, Frown, CheckCircle2 } from 'lucide-react';

export const COLORS = {
  primary: '#E65C4F', // Warm accent (Terra Cotta)
  background: '#FDFCF9', // Cream
  card: '#FFFFFF',
  textMain: '#2D2D2D',
  textMuted: '#8E8E8E',
  sage: '#9EB384',
  mutedGold: '#C5A059',
  softBlue: '#7FB3D5'
};

export const REACTION_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  love: { icon: Heart, color: '#E65C4F', label: 'Love' },
  smile: { icon: Smile, color: '#9EB384', label: 'Smile' },
  wow: { icon: Zap, color: '#C5A059', label: 'Wow' },
  sad: { icon: Frown, color: '#7FB3D5', label: 'Sad' },
  check: { icon: CheckCircle2, color: '#8E8E8E', label: 'Seen' }
};

export const MOCK_USER = {
  id: 'u1',
  name: 'Alex Rivera',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  coverPhoto: 'https://picsum.photos/seed/mountain/1200/800',
  bio: 'Capturing the quiet moments between the noise.',
  stats: {
    moments: 124,
    friends: 48,
    lastActive: '12m ago'
  }
};

export const MOCK_MOMENTS: Moment[] = [
  {
    id: 'm1',
    userId: 'u1',
    userName: 'Alex Rivera',
    userAvatar: 'https://picsum.photos/seed/alex/200/200',
    type: 'photo',
    content: 'The golden hour in the valley today was something else.',
    mediaUrl: 'https://picsum.photos/seed/valley/800/1000',
    location: 'Ojai, CA',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    reactions: [
      { type: 'love', label: 'Love', count: 3, userIds: ['u2', 'u3', 'u4'] },
      { type: 'smile', label: 'Smile', count: 1, userIds: ['u5'] }
    ],
    comments: []
  },
  {
    id: 'm2',
    userId: 'u2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://picsum.photos/seed/sarah/200/200',
    type: 'music',
    content: 'Listening to "Claire de Lune" by Debussy.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    reactions: [
      { type: 'wow', label: 'Wow', count: 2, userIds: ['u1', 'u6'] }
    ],
    comments: []
  },
  {
    id: 'm3',
    userId: 'u3',
    userName: 'Marcus Thorne',
    userAvatar: 'https://picsum.photos/seed/marcus/200/200',
    type: 'sleep',
    content: 'Turning in. Goodnight, world.',
    timestamp: new Date(Date.now() - 1000 * 60 * 360),
    reactions: [
      { type: 'check', label: 'Seen', count: 5, userIds: ['u1', 'u2', 'u4', 'u5', 'u7'] }
    ],
    comments: []
  }
];
