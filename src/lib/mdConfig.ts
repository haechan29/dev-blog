import type { Element } from 'hast';
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from 'mdast-util-directive';
import { defaultSchema, type Options } from 'rehype-sanitize';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;

export const schema: Options = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ['className', 'w-full', 'min-w-56 w-1/2'],
    ],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      'data-image-container',
      'data-original-caption',
      'data-bgm',
      'data-video-id',
      'data-start-time',
    ],
  },
};

export function remarkImg() {
  return (tree: Node) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;
      if (!isDirectiveNode(node) || node.name !== 'img') return;

      const { url, alt, size } = node.attributes || {};

      const originalCaption = node.children
        .filter(child => child.type === 'paragraph')
        .map(p =>
          p.children
            .map(child => {
              if (child.type === 'text') return child.value;
              if (child.type === 'break') return '\n';
              return '';
            })
            .join('')
        )
        .join('\n');

      const caption = node.children.map(child => {
        if (child.type === 'paragraph') {
          return {
            ...child,
            children: child.children.map(textNode => {
              if (textNode.type === 'text' && textNode.value) {
                return {
                  ...textNode,
                  value: textNode.value
                    .replace(/\\#/g, '__ESCAPED_HASH__')
                    .replace(/#/g, '')
                    .replace(/__ESCAPED_HASH__/g, '#'),
                };
              }
              return textNode;
            }),
          };
        }
        return child;
      });

      const imageContainer = {
        type: 'imageContainer',
        data: {
          hProperties: {
            'data-image-container': '',
            'data-original-caption': originalCaption,
          },
        },
        children: [
          {
            type: 'image',
            url: url || '',
            alt: alt || '',
            data: {
              hProperties: {
                className: size === 'large' ? ['w-full'] : ['min-w-56 w-1/2'],
              },
            },
          },
          ...caption,
        ],
      };

      parent.children[index] = imageContainer;
    });
  };
}

export function remarkBgm() {
  return (tree: Node) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;
      if (!isDirectiveNode(node) || node.name !== 'bgm') return;

      const { youtubeUrl, startTime } = node.attributes || {};
      if (!youtubeUrl) return;

      const { videoId, timeFromUrl } = parseYouTubeUrl(youtubeUrl);
      const finalStartTime =
        startTime != null ? parseTimeToSeconds(startTime) : timeFromUrl;

      if (!videoId) return;
      const newNode = {
        type: 'bgm',
        data: {
          hProperties: {
            'data-bgm': '',
            'data-video-id': videoId,
            'data-start-time': `${finalStartTime ?? 0}`,
          },
        },
      };
      parent.children[index] = newNode;
    });
  };
}

export function rehypeLink() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && node.properties?.href) {
        const href = node.properties.href as string;
        if (href.startsWith('http') || href.startsWith('//')) {
          node.properties.rel = 'noopener noreferrer';
          node.properties.target = '_blank';
        }
      }
    });
  };
}

export function rehypeBgm() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'div' && 'data-bgm' in node.properties) {
        const videoId = node.properties['data-video-id'] as string;
        const startTime = node.properties['data-start-time'] as string;
        const embedUrl = buildEmbedUrl(videoId, parseInt(startTime));
        if (embedUrl == null) return;

        node.tagName = 'iframe';
        node.properties = {
          src: embedUrl,
          width: '560',
          height: '315',
          frameBorder: '0',
          allowFullScreen: true,
        };
        node.children = [];
      }
    });
  };
}

function isDirectiveNode(node: Node): node is DirectiveNode {
  return (
    node.type === 'containerDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'textDirective'
  );
}

function parseYouTubeUrl(url: string) {
  try {
    const urlObj = new URL(url);
    let videoId = null;
    let timeFromUrl = null;

    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    }

    const t = urlObj.searchParams.get('t');
    if (t) {
      timeFromUrl = parseTimeToSeconds(t);
    }

    return { videoId, timeFromUrl };
  } catch {
    return { videoId: null, timeFromUrl: null };
  }
}

function parseTimeToSeconds(timeStr: string): number {
  let totalSeconds = 0;

  const hours = timeStr.match(/(\d+)h/);
  const minutes = timeStr.match(/(\d+)m/);
  const seconds = timeStr.match(/(\d+)s/);

  if (hours) totalSeconds += parseInt(hours[1]) * 3600;
  if (minutes) totalSeconds += parseInt(minutes[1]) * 60;
  if (seconds) totalSeconds += parseInt(seconds[1]);

  if (!hours && !minutes && !seconds) {
    totalSeconds = parseInt(timeStr) || 0;
  }

  return totalSeconds;
}

function buildEmbedUrl(videoId: string, startTime: number | null): string {
  let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
  if (startTime) embedUrl += `&start=${startTime}`;
  return embedUrl;
}
