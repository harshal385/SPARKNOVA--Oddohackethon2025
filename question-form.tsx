"use client";

import { useState, useEffect, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Tag, HelpCircle, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { suggestTagsAndQuestions } from '@/ai/flows/suggest-tags-and-questions';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(15, "Title must be at least 15 characters.").max(150),
  description: z.string().min(30, "Description must be at least 30 characters."),
  tags: z.array(z.string()).min(1, "Please add at least one tag.").max(5, "You can add up to 5 tags."),
});

export function QuestionForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [isAiLoading, startAiTransition] = useTransition();
  const [aiSuggestions, setAiSuggestions] = useState<{ suggestedTags: string[]; suggestedQuestions: string[] } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  const title = form.watch('title');
  const description = form.watch('description');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (title.length > 10 && description.length > 20) {
        startAiTransition(async () => {
          try {
            const suggestions = await suggestTagsAndQuestions({ title, description });
            setAiSuggestions(suggestions);
          } catch (error) {
            console.error("AI suggestion failed:", error);
            toast({ variant: 'destructive', title: 'AI Suggestion Error', description: 'Could not fetch AI suggestions.' });
          }
        });
      }
    }, 500); // Debounce AI call

    return () => clearTimeout(handler);
  }, [title, description, toast]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !form.getValues('tags').includes(newTag)) {
        const currentTags = form.getValues('tags');
        if (currentTags.length < 5) {
          form.setValue('tags', [...currentTags, newTag]);
        }
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue('tags', form.getValues('tags').filter(tag => tag !== tagToRemove));
  };
  
  const addSuggestedTag = (tag: string) => {
    if (!form.getValues('tags').includes(tag) && form.getValues('tags').length < 5) {
        form.setValue('tags', [...form.getValues('tags'), tag]);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(values);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Question Posted!",
        description: "Your question has been successfully posted to the community.",
      });
      router.push('/');
    }, 1500);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader><CardTitle>Title</CardTitle></CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Be specific and imagine you’re asking a question to another person.</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. How do I center a div in CSS?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Description</CardTitle></CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Include all the information someone would need to answer your question.</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your problem in detail..." {...field} rows={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel>Add up to 5 tags to describe what your question is about.</FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
                            {form.watch('tags').map(tag => (
                              <Badge key={tag} variant="secondary" className="text-sm">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <Input 
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="e.g. (react, typescript, css)"
                            disabled={form.getValues('tags').length >= 5}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Post Your Question"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle>AI Suggestions</CardTitle>
            {isAiLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2"><Tag className="h-4 w-4" /> Suggested Tags</h4>
              {aiSuggestions?.suggestedTags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.suggestedTags.map(tag => (
                    <Button key={tag} size="sm" variant="outline" onClick={() => addSuggestedTag(tag)}>{tag}</Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Type your question to see tag suggestions.</p>
              )}
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-semibold flex items-center gap-2 mb-2"><HelpCircle className="h-4 w-4" /> Related Questions</h4>
              {aiSuggestions?.suggestedQuestions?.length ? (
                 <ul className="space-y-2">
                    {aiSuggestions.suggestedQuestions.map((q, i) => (
                      <li key={i} className="text-sm">
                        <Link href="#" className="text-primary hover:underline">{q}</Link>
                      </li>
                    ))}
                 </ul>
              ) : (
                 <p className="text-sm text-muted-foreground">No similar questions found yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
