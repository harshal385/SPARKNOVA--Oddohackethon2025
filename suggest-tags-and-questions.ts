'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags and similar questions
 * based on a given question title and description.
 *
 * - suggestTagsAndQuestions - A function that orchestrates the tag and question suggestion process.
 * - SuggestTagsAndQuestionsInput - The input type for the suggestTagsAndQuestions function.
 * - SuggestTagsAndQuestionsOutput - The return type for the suggestTagsAndQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsAndQuestionsInputSchema = z.object({
  title: z.string().describe('The title of the question.'),
  description: z.string().describe('The description of the question.'),
});
export type SuggestTagsAndQuestionsInput = z.infer<
  typeof SuggestTagsAndQuestionsInputSchema
>;

const SuggestTagsAndQuestionsOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .describe('An array of suggested tags for the question.'),
  suggestedQuestions: z
    .array(z.string())
    .describe('An array of similar questions from the knowledge base.'),
});
export type SuggestTagsAndQuestionsOutput = z.infer<
  typeof SuggestTagsAndQuestionsOutputSchema
>;

export async function suggestTagsAndQuestions(
  input: SuggestTagsAndQuestionsInput
): Promise<SuggestTagsAndQuestionsOutput> {
  return suggestTagsAndQuestionsFlow(input);
}

const suggestTagsAndQuestionsPrompt = ai.definePrompt({
  name: 'suggestTagsAndQuestionsPrompt',
  input: {schema: SuggestTagsAndQuestionsInputSchema},
  output: {schema: SuggestTagsAndQuestionsOutputSchema},
  prompt: `Given the following question title and description, suggest relevant tags and similar questions from the knowledge base.

Title: {{{title}}}
Description: {{{description}}}

Suggest at least 3 relevant tags.
Suggest at least 3 similar questions.

Ensure that the output is a valid JSON object that matches the schema.`,
});

const suggestTagsAndQuestionsFlow = ai.defineFlow(
  {
    name: 'suggestTagsAndQuestionsFlow',
    inputSchema: SuggestTagsAndQuestionsInputSchema,
    outputSchema: SuggestTagsAndQuestionsOutputSchema,
  },
  async input => {
    const {output} = await suggestTagsAndQuestionsPrompt(input);
    return output!;
  }
);
