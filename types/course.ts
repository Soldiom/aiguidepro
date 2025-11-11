export interface Week {
  title: string;
  description: string;
  topics: string[];
}

export interface CourseDetail {
  type: 'list' | 'text';
  title?: string;
  items: string[];
}

export interface Course {
  id: number;
  headline: string;
  title: string;
  level: string;
  description: string;
  weeks: Week[];
  details: CourseDetail[];
  consultantUrl?: string;
  source?: 'static' | 'generated';
}
