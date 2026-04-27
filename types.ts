export type ExerciseType = 'SELECT' | 'SCRAMBLE' | 'FILL' | 'MATCH' | 'IMAGE_SELECT' | 'SORT' | 'FIND_ALL';

export interface SortItem {
  id: string;
  text: string;
  categoryId: string;
  translation?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  prompt: string;
  target: string;
  targets?: string[];
  choices?: string[];
  image?: string;
  audioText?: string;
  scrambledWords?: string[];
  translation?: string;
  explanation?: string;
  categories?: { id: string; name: string }[];
  sortItems?: SortItem[];
}

export interface Level {
  id: number;
  title: string;
  description: string;
  explanationIntro?: string;
  exercises: Exercise[];
}

export interface WordPair {
  id: string;
  hy: string;
  es: string;
}
