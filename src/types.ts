export interface Prompt {
  id: string;
  category: string;
  role: string;
  type: string;
  content: string;
  contentEn?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

export type Language = 'ko' | 'en';
