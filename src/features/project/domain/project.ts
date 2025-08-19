import { ProjectItemProps } from '../ui/projectItemProps';

export class YearMonth {
  constructor(
    public readonly year: number,
    public readonly month: number,
  ) {}
  
  equals(other: unknown): boolean {
    return other instanceof YearMonth
      && this.year === other.year
      && this.month === other.month;
  }

  toString(): string {
    return `${this.year}.${this.month.toString().padStart(2, '0')}`;
  }
};

type ProjectPeriod = {
  start: YearMonth;
  end: YearMonth;
};

export type Platform = 'Android' | 'Web' | 'Flutter';

export class Project {
  constructor(
    public readonly title: string,
    public readonly period: ProjectPeriod,
    public readonly platform: Platform,
    public readonly tools: string[],
    public readonly summary: string,
    public readonly description: string,
    public readonly screenshots: string[],
    public readonly thumbnail: string,
    public readonly githubUrl?: string,
    public readonly siteUrl?: string
  ) {}

  toProps(): ProjectItemProps {
    return {
      title: this.title,
      period: this.formattedPeriod(),
      platform: this.platform,
      tools: this.tools,
      summary: this.summary,
      description: this.description,
      screenshots: this.screenshots,
      thumbnail: this.thumbnail,
      githubUrl: this.githubUrl,
      siteUrl: this.siteUrl
    }
  }

  formattedPeriod(): string {
    const start = this.period.start;
    const end = this.period.end;
    if (start.equals(end)) {
      return start.toString();
    } else {
      return `${start.toString()} - ${end.toString()}`;
    }
  }
}