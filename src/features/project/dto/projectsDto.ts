export type ProjectDto = {
  title: string;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  platform: string;
  tools: string[];
  summary: string;
  description: string;
  screenshots: string[];
  thumbnail: string;
  githubUrl?: string;
  siteUrl?: string;
}