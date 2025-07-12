import { QuestionListItem } from './question-list-item';
import { type Question } from '@/lib/types';

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionListItem key={question.id} question={question} />
      ))}
    </div>
  );
}
