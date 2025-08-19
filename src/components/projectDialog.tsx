import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { ProjectItemProps } from '@/features/project/ui/projectItemProps';
import { ExternalLink, X } from 'lucide-react'

export default function ProjectDialog({ item, setItem }: {
  item: ProjectItemProps | null;
  setItem: (v: ProjectItemProps | null) => void;
}) {
  return (
    <Dialog open={item !== null} onOpenChange={(open) => { if (!open) setItem(null); }}>
      <DialogContent showCloseButton={false} className='min-w-2xl gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>{`${item?.title} 프로젝트 설명`}</DialogTitle>
        <div className='text-3xl font-bold mt-2 mb-1'>{item?.title}</div>
        <div className='text-sm text-gray-500 mb-6'>{item?.summary}</div>
        <div className='mb-10 mr-10 break-keep'>{item?.description}</div>
        <div className='flex items-center'>
          {item?.githubUrl !== undefined && (
            <a 
              href={item.githubUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center px-6 py-3 rounded-sm cursor-pointer mr-4 text-white bg-blue-600 hover:bg-blue-500'>
                <ExternalLink className='w-4 h-4 stroke-3 mr-2'/>
                <div className='font-semibold'>Github</div>
            </a>
          )}
          {item?.siteUrl !== undefined && (
            <a 
              href={item.siteUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center px-6 py-3 rounded-sm border-1 border-gray-300 cursor-pointer hover:text-blue-500'>
                <ExternalLink className='w-4 h-4 stroke-3 mr-2'/>
                <div className='font-semibold'>View Site</div>
            </a>
          )}
          <div className='flex flex-1'/>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}