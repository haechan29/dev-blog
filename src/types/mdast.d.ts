import 'mdast';

declare module 'mdast' {
  interface RootContentMap {
    spacer: SpacerNode;
    bgm: BgmNode;
  }

  interface SpacerNode extends Node {
    type: 'spacer';
    data?: {
      hProperties?: {
        'data-tag-name'?: string;
        'data-lines'?: string;
      };
    };
  }

  interface BgmNode extends Node {
    type: 'bgm';
    data?: {
      hProperties?: {
        'data-tag-name'?: string;
        'data-youtube-url'?: string;
        'data-start-time'?: string;
      };
    };
  }
}
