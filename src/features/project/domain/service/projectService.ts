import * as ProjectRepository from '@/features/project/data/repository/projectRepository';
import { toDomain } from '@/features/project/domain/mapper/projectMapper';

export async function fetchProjects() {
  const projectDtos = await ProjectRepository.fetchProjects();
  return projectDtos.map(dto => toDomain(dto));
}
