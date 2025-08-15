"use client";

import clsx from 'clsx';
import { useState } from 'react';

export default function ProjectsItem() {
  type YearMonth = {
    year: number;
    month: number;
  };
  type ProjectPeriod = {
    start: YearMonth;
    end: YearMonth;
  };
  type Platform = 'Android' | 'React' | 'Flutter';
  type Language = 'Kotlin' | 'TypeScript';
  type ProjectItemProps = {
    title: string;
    period: ProjectPeriod;
    platform: Platform;
    language: Language;
    description: string;
    screenshots: string[];
    thumbnail: string;
  }

  const [platforms, setPlatforms] = useState(['Android', 'React', 'Flutter']);
  const [selectedPlatform, setSelectedPlatform] = useState('Android');
  const [projects, setProjects] = useState<ProjectItemProps[]>([
    {
      title: '숏과외',
      period: {
        start: {
          year: 2023,
          month: 6
        },
        end: {
          year: 2023,
          month: 11
        }
      },
      platform: 'Android',
      language: 'Kotlin',
      description: '숏과외에요',
      screenshots: [
        '/images/programmer-looking.png',
        '/images/programmer-looking.png'
      ],
      thumbnail: '/images/short_tutoring_home.png'
    }
  ]);

  return (
    <div className='flex flex-col'>
      <div className='flex mb-10'>
        {platforms.map(((platform, i) => {
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
              {i !== platforms.length - 1 && (
                <div className='text-gray-300'>/</div>
              )}
            </div>
          );
        }))}
      </div>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-2'>
        {projects.map(project => {
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