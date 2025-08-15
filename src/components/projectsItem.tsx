"use client";

import { Project } from '@/features/project/domain/project';
import { ProjectDto } from '@/features/project/dto/projectsDto';
import { toDomain } from '@/features/project/mapper/projectMapper';
import { ProjectItemProps } from '@/features/project/ui/projectItemProps';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

const PLATFORMS = ['Android', 'React', 'Flutter'];

export default function ProjectsItem() {
  const [selectedPlatform, setSelectedPlatform] = useState('Android');
  const [projects, setProjects] = useState<Project[] | null>(null);
  const projectItemProps = useMemo<ProjectItemProps[] | null>(() => {
    return projects === null ? null : projects.map(project => project.toProps());
  }, [projects]);

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
    }
    fetchProjects();
  }, []);

  return (
    <div className='flex flex-col'>
      <div className='flex mb-10'>
        {PLATFORMS.map(((platform, i) => {
          return (
            <div key={platform} className='flex text-xl font-bold'>
              <button 
                onClick={() => setSelectedPlatform(platform)}
                className={clsx(
                  'hover:text-blue-500',
                  i === 0 ? 'pr-2' : 'px-2',
                  platform === selectedPlatform ? 'text-blue-500' : 'text-gray-300'
                )}
              >
                {platform}
              </button>
              {i !== PLATFORMS.length - 1 && (
                <div className='text-gray-300'>/</div>
              )}
            </div>
          );
        }))}
      </div>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-2'>
        {projectItemProps !== null && projectItemProps.map(project => {
          return (
            <button
              key={project.title}
              className='relative aspect-square min-w-[200px] rounded-xl overflow-hidden hover:shadow-md focus:outline-none'
            >
              <img
                src={project.thumbnail}
                alt={`${project.title} project thumbnail`}
                className='absolute inset-0 w-full h-full object-scale-down'
              />
              <div className={clsx(
                'absolute h-20 inset-x-0 bottom-0 flex flex-col justify-end items-start', 
                'bg-gradient-to-t from-black/70 to-transparent bg-blackpointer-events-none px-4 py-3'
              )}>
                <div className='text-white font-bold'>{project.title}</div>
                <div className='text-sm text-white'>{`${project.platform} / ${project.language}`}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}