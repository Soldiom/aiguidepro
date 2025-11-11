export interface CourseSuggestion {
  id: string;
  title: string;
  description: string;
  level?: "تأسيسي" | "مبتدئ" | "مبتدئ إلى متوسط" | "متوسط" | "متوسط إلى متقدم" | "متقدم" | "استراتيجي";
  votes: number;
  createdAt: number;
  status?: 'suggested' | 'generated';
}
