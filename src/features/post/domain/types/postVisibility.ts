const VISIBILITY_VALUES = ['public', 'unlisted', 'private'] as const;

export type PostVisibility = (typeof VISIBILITY_VALUES)[number];

export function isPostVisibility(str: string): str is PostVisibility {
  return VISIBILITY_VALUES.includes(str as PostVisibility);
}

export function toPostVisibility(str: string): PostVisibility {
  if (!isPostVisibility(str)) {
    throw new Error(`형식이 올바르지 않습니다: ${str}`);
  }
  return str as PostVisibility;
}
