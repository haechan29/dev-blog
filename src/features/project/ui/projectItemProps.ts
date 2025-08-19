import { Platform } from '../domain/project';

export type ProjectItemProps = {
  title: string;
  period: string;
  platform: Platform;
  tools: string[];
  summary: string;
  description: string;
  screenshots: string[];
  thumbnail: string;
  githubUrl?: string;
  siteUrl?: string;
}