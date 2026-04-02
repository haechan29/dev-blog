export type NotificationListItemUi =
  | {
      kind: 'comment';
      id: string;
      primary: string;
      secondary: string | null;
      href: string | null;
    }
  | {
      kind: 'post_view_milestone';
      id: string;
      primary: string;
      secondary: string | null;
      href: string | null;
    }
  | {
      kind: 'post_like_milestone';
      id: string;
      primary: string;
      secondary: string | null;
      href: string | null;
    }
  | {
      kind: 'comment_like_milestone';
      id: string;
      primary: string;
      secondary: string | null;
      href: string | null;
    }
  | {
      kind: 'subscriber_milestone';
      id: string;
      primary: string;
      secondary: string | null;
      href: string | null;
    };
