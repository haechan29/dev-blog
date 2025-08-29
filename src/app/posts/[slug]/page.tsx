import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import TableOfContentsItem from '@/components/tableOfContentsItem';
import ToggleButtonItem from '@/components/toggleButtonItem';
import { ReactNode } from 'react';
import { Post } from '@/features/post/domain/model/post';
import { fetchPostBySlug } from '@/features/post/domain/service/postService';
import CommentFormItem from '@/components/commentFormItem';
import { MessageCircle, X } from 'lucide-react';
import CommentItem from '@/components/commentItem';

const ExternalLink = ({children, ...props}: { children: ReactNode; }) => {
  return <a rel='noopener noreferrer' target='_blank' { ...props }>{children}</a>
};

interface Comment {
    id: number;
    postId: string;
    authorName: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // 가짜 데이터
  const mockComments: Comment[] = [
    {
      id: 1,
      postId: 'sample-post',
      authorName: '김개발',
      content: '정말 유용한 글이네요! 특히 타입스크립트 부분이 도움이 많이 되었습니다. 실무에서 바로 적용해보겠어요. 정말 유용한 글이네요! 특히 타입스크립트 부분이 도움이 많이 되었습니다. 실무에서 바로 적용해보겠어요. 정말 유용한 글이네요! 특히 타입스크립트 부분이 도움이 많이 되었습니다. 실무에서 바로 적용해보겠어요.',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      postId: 'sample-post',
      authorName: '프론트엔더',
      content: 'Next.js 15 정보 감사합니다! 마침 프로젝트에서 업그레이드를 고민하고 있었는데 많은 도움이 되었어요.',
      createdAt: '2024-01-15T14:20:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    },
    {
      id: 3,
      postId: 'sample-post',
      authorName: '신입개발자',
      content: '초보자도 이해하기 쉽게 설명해주셔서 감사합니다. 계속 좋은 글 부탁드려요!',
      createdAt: '2024-01-15T16:45:00Z',
      updatedAt: '2024-01-15T16:45:00Z'
    }
  ];

export default async function PostPage({ params }: { params: Promise<{ slug: string; }> }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  const postProps = (post as Post).toProps();

  return (
    <div className='py-14'>
      <section className='mb-10'>
        <div className='text-4xl font-bold mb-6'>{postProps.title}</div>
        <div className='text-sm text-gray-500 mb-6'>{postProps.date}</div>
        <div className='flex flex-wrap gap-x-2'>
          {postProps.tags?.map(tag => 
            <div key={tag} className='text-xs px-2 py-1 border border-gray-300 rounded-full'>{tag}</div>
          )}
        </div>
      </section>
      <div className='w-full h-[1px] bg-gray-200 mb-10'/>
      
      {postProps.headings.length > 0 && (
        <section className='mb-10 xl:mb-0'>
          <div className='block xl:hidden text-2xl font-bold text-gray-900 mt-4 mb-2 leading-tight'>목차</div>
          <TableOfContentsItem headings={postProps.headings}/>
        </section>
      )}

      <section className='prose mb-10'>
        <MDXRemote
          source={postProps.content}
          components={{
            ToggleButtonItem,
            a: ExternalLink
          }}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode],
                rehypeSlug
              ]
            }
          }}
        />
      </section>
      
      <div className='w-full h-[1px] bg-gray-200 mb-8'/>
      <section>
        <div className="text-xl font-bold text-gray-900 mb-8">
          댓글 {mockComments.length}개
        </div>
        <CommentFormItem postId={slug} />
        <div className="space-y-6">
          {mockComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg">아직 댓글이 없습니다.</p>
              <p className="text-gray-400">첫 번째 댓글을 작성해보세요!</p>
            </div>
          ) : (
            mockComments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}