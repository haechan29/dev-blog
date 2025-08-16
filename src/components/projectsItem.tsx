"use client";

import { Project } from '@/features/project/domain/project';
import { ProjectDto } from '@/features/project/dto/projectsDto';
import { toDomain } from '@/features/project/mapper/projectMapper';
import { ProjectItemProps } from '@/features/project/ui/projectItemProps';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const PLATFORM_FILTERS: string[] = ['전체', 'Android', 'Web', 'Flutter'];

export default function ProjectsItem() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  
  const platformCounts = useMemo<Map<string, number> | null>(() => {
    if (projects === null) return null;
    const count = new Map<string, number>();
    count.set('전체', projects.length);
    projects.map(p => p.platform).forEach(platform => count.set(platform, (count.get(platform) ?? 0) + 1));
    return count;
  }, [projects]);

  const filteredProjects = useMemo<Project[] | null>(() => {
    if (selectedFilter === '전체') return projects;
    return projects?.filter(p => p.platform === selectedFilter) ?? null;
  }, [projects, selectedFilter]);
  
  const projectItemProps = useMemo<ProjectItemProps[] | null>(() => {
    return filteredProjects?.map(project => project.toProps()) ?? null;
  }, [filteredProjects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/data/projects.json');
        if (!response.ok) throw Error(`HTTP ${response.status}`);
        const dtos = await response.json() as ProjectDto[];
        setProjects(dtos.map(dto => toDomain(dto)))
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className='flex flex-col'>
      <div className='flex mb-10'>
        {PLATFORM_FILTERS.map(((platform, i) => {
          return (
            <div key={platform} className='flex text-xl font-bold'>
              <button 
                onClick={() => setSelectedFilter(platform)}
                className={clsx(
                  'flex items-end hover:text-blue-500',
                  platform === selectedFilter ? 'text-blue-500' : 'text-gray-300'
                )}
              >
                <div className={clsx('pr-1', i !== 0 ? 'pl-2' : '')}>{platform}</div>
                <div className='text-base pr-2'>{platformCounts?.get(platform) ?? 0}</div>
              </button>
              {i !== PLATFORM_FILTERS.length - 1 && (
                <div className='text-gray-300'>/</div>
              )}
            </div>
          );
        }))}
      </div>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
        <AnimatePresence mode='popLayout' initial={false}>
          {projectItemProps !== null && projectItemProps.map(project => {
            return (
              <motion.button
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='relative aspect-square min-w-[200px] bg-gray-50 overflow-hidden group'
              >
                <div className='absolute inset-0 p-4'>
                  <img
                    src={project.thumbnail}
                    alt={`${project.title} project thumbnail`}
                    className='w-full h-full object-contain object-center'
                  />
                </div>
                <div className='absolute inset-0 pointer-events-none flex flex-col items-start
                  bg-black/60 text-white p-4 group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out
                '>
                  <div className='text-lg font-bold'>{project.title}</div>
                  <div className='flex text-sm'>
                    <div className='mr-1'>{project.platform}</div>
                    <div>{`(${project.tools.join(', ')})`}</div>
                  </div>
                  <div className='flex flex-1 w-full justify-end items-end'>
                    <div className='flex items-center'>
                      <div className='text-sm mr-1'>자세히 보기</div>
                      <ArrowRight className='w-4 h-4' />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}