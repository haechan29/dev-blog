import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    nickname?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    registeredAt?: string | null;
    profileImageUrl?: string | null;
    bio?: string | null;
    subscriberCount?: number;
  }

  interface Session {
    user: {
      id: string;
      nickname?: string | null;
      createdAt?: string;
      updatedAt?: string | null;
      deletedAt?: string | null;
      registeredAt?: string | null;
      profileImageUrl?: string | null;
      bio?: string | null;
      subscriberCount?: number;
    } & DefaultSession['user'];
  }
}
