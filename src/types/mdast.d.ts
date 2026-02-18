import 'mdast';

declare module 'mdast' {
  interface RootContentMap {
    spacer: SpacerNode;
    bgm: BgmNode;
    imageWithCaption: ImageWithCaptionNode;
    dialogue: DialogueNode;
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
        src: string;
        'data-status'?: 'loading' | 'failed';
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

  interface DialogueNode extends Node {
    type: 'dialogue';
    data: {
      hName: 'dialogue';
      hProperties: {
        'data-speaker': string;
        'data-avatar'?: string;
      };
    };
  }
}
