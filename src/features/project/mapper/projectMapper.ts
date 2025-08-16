import { Platform, Project, YearMonth } from '../domain/project';
import { ProjectDto } from '../dto/projectsDto';

export function toDomain(dto: ProjectDto): Project {
  return new Project(
    dto.title,
    {
      start: new YearMonth(dto.startYear, dto.startMonth),
      end: new YearMonth(dto.endYear, dto.endMonth)
    },
    dto.platform as Platform,
    dto.tools,
    dto.description,
    dto.screenshots,
    dto.thumbnail
  )
}