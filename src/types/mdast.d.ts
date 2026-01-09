import 'mdast';

declare module 'mdast' {
  interface RootContentMap {
    spacer: SpacerNode;
    bgm: BgmNode;
  }

  interface SpacerNode extends Node {
    type: 'spacer';
    data?: {
      hName?: string;
      hProperties?: {
        'data-lines'?: string;
      };
    };
  }

  interface BgmNode extends Node {
    type: 'bgm';
    data?: {
      hName?: string;
      hProperties?: {
        'data-youtube-url'?: string;
        'data-start-time'?: string;
      };
    };
  }
}
