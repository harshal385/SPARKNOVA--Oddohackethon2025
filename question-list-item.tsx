import Link from 'next/link';
import { type Question } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface QuestionListItemProps {
  question: Question;
}

export function QuestionListItem({ question }: QuestionListItemProps) {
  return (
    <Card className="hover:bg-secondary/50 transition-colors duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center justify-center gap-1 text-center w-20 flex-shrink-0">
            <div className="flex items-center gap-1 font-bold text-lg">
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
              <span>{question.votes}</span>
            </div>
            <span className="text-xs text-muted-foreground">votes</span>
            <div className={`flex items-center gap-1 font-semibold text-sm rounded-md p-1 ${question.isAccepted ? 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400' : 'text-muted-foreground'}`}>
              <MessageSquare className="h-4 w-4" />
              <span>{question.answersCount}</span>
            </div>
             <span className="text-xs text-muted-foreground">answers</span>
          </div>

          <div className="flex-1">
            <Link href={`/questions/${question.id}`} className="block text-xl font-semibold text-primary hover:underline">
              {question.title}
            </Link>
            <div className="mt-2 flex items-center flex-wrap gap-2">
              {question.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.author.avatarUrl} alt={question.author.name} data-ai-hint="user avatar" />
                <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{question.author.name}</span>
              <span>asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
