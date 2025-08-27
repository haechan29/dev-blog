import { Platform, Project, YearMonth } from '@/features/project/domain/model/project';
import { ProjectDto } from '@/features/project/data/dto/projectDto';

export function toDomain(dto: ProjectDto): Project {
  return new Project(
    dto.title,
    {
      start: new YearMonth(dto.startYear, dto.startMonth),
      end: new YearMonth(dto.endYear, dto.endMonth)
    },
    dto.platform as Platform,
    dto.tools,
    dto.summary,
    dto.description,
    dto.screenshots,
    dto.thumbnail,
    dto.githubUrl,
    dto.siteUrl
  )
}