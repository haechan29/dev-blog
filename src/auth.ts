import { db } from '@/db/index';
import * as UserUsecase from '@/features/user/data/usecases/userUsecase';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import { Adapter, AdapterUser } from 'next-auth/adapters';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: createMergeAnonymousAdapter(),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.nickname = user.nickname;
      session.user.createdAt = user.createdAt;
      session.user.updatedAt = user.updatedAt;
      session.user.deletedAt = user.deletedAt;
      session.user.registeredAt = user.registeredAt;
      session.user.profileImageUrl = user.profileImageUrl;
      session.user.bio = user.bio;
      session.user.subscriberCount = user.subscriberCount;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
});

export function createMergeAnonymousAdapter(): Adapter {
  const base = DrizzleAdapter(db);
  return {
    ...base,
    async createUser(user: AdapterUser) {
      return UserUsecase.mergeAnonymousUser(user, u =>
        Promise.resolve(base.createUser!(u))
      );
    },
  };
}
