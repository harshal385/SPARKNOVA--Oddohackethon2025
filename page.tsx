import { QuestionList } from '@/components/questions/question-list';
import { type Question } from '@/lib/types';

const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to properly use React hooks for data fetching?',
    author: { name: 'Alice', avatarUrl: 'https://placehold.co/40x40.png' },
    tags: ['react', 'hooks', 'data-fetching'],
    votes: 125,
    answersCount: 5,
    views: 2300,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isAccepted: true,
  },
  {
    id: '2',
    title: 'What is the best way to handle authentication with JWT in a Next.js app?',
    author: { name: 'Bob', avatarUrl: 'https://placehold.co/40x40.png' },
    tags: ['nextjs', 'authentication', 'jwt'],
    votes: 98,
    answersCount: 3,
    views: 1800,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isAccepted: false,
  },
  {
    id: '3',
    title: 'How to style components in Tailwind CSS for maximum reusability?',
    author: { name: 'Charlie', avatarUrl: 'https://placehold.co/40x40.png' },
    tags: ['tailwindcss', 'css', 'design-system'],
    votes: 210,
    answersCount: 8,
    views: 4500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isAccepted: true,
  },
];

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Questions</h1>
      <QuestionList questions={mockQuestions} />
    </div>
  );
}
