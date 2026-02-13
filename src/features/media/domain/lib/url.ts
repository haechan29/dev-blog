import {
  AVATAR_IMAGE_VARIANTS,
  POST_IMAGE_VARIANTS,
} from '@/features/media/constants/image-variants';

export type PostImageVariant = (typeof POST_IMAGE_VARIANTS)[number];
export type AvatarImageVariant = (typeof AVATAR_IMAGE_VARIANTS)[number];
export type MediaVariant = PostImageVariant | AvatarImageVariant;

export function buildImageUrl(baseUrl: string, variant: MediaVariant) {
  return `${baseUrl}-${variant}.webp`;
}
