import 'mdast';

declare module 'mdast' {
  interface RootContentMap {
    spacer: SpacerNode;
    bgm: BgmNode;
    imageWithCaption: ImageWithCaptionNode;
  }

  interface SpacerNode extends Node {
    type: 'spacer';
    data: {
      hName: 'spacer';
    };
  }

  interface BgmNode extends Node {
    type: 'bgm';
    data: {
      hName: 'bgm';
      hProperties: {
        'data-youtube-url': string;
        'data-start-time': string;
      };
    };
  }

  interface ImageWithCaptionNode extends Parent {
    type: 'imageWithCaption';
    data: {
      hName: 'imageWithCaption';
      hProperties: {
        src: string;
        alt: string;
        'data-size': 'medium' | 'large';
        'data-status': 'failed' | 'success' | 'loading';
      };
    };
  }
}
