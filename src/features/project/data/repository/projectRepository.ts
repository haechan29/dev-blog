import { ProjectDto } from '@/features/project/data/dto/projectDto';

export async function fetchProjects() {
  const response = await fetch('/data/projects.json');
  if (!response.ok) throw Error(`fetchProjects 실패: HTTP ${response.status}`);
  return await response.json() as ProjectDto[];
}