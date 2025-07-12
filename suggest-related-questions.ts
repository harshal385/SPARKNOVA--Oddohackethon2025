// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview AI-powered suggestion of related questions based on user input.
 *
 * - suggestRelatedQuestions - A function that suggests related questions.
 * - SuggestRelatedQuestionsInput - The input type for the suggestRelatedQuestions function.
 * - SuggestRelatedQuestionsOutput - The return type for the suggestRelatedQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedQuestionsInputSchema = z.object({
  questionTitle: z
    .string()
    .describe('The title of the question the user is asking.'),
  questionDescription: z
    .string()
    .describe('The description of the question the user is asking.'),
  existingQuestions: z
    .array(z.string())
    .describe('An array of existing questions in the knowledge base.'),
});
export type SuggestRelatedQuestionsInput = z.infer<
  typeof SuggestRelatedQuestionsInputSchema
>;

const SuggestRelatedQuestionsOutputSchema = z.object({
  relatedQuestions: z
    .array(z.string())
    .describe('An array of related questions from the knowledge base.'),
});
export type SuggestRelatedQuestionsOutput = z.infer<
  typeof SuggestRelatedQuestionsOutputSchema
>;

export async function suggestRelatedQuestions(
  input: SuggestRelatedQuestionsInput
): Promise<SuggestRelatedQuestionsOutput> {
  return suggestRelatedQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedQuestionsPrompt',
  input: {schema: SuggestRelatedQuestionsInputSchema},
  output: {schema: SuggestRelatedQuestionsOutputSchema},
  prompt: `You are a helpful assistant that suggests related questions from a knowledge base.

  Given a user's question title and description, and a list of existing questions, identify the questions that are most closely related to the user's question.

  Return an array of related questions.

  User's Question Title: {{{questionTitle}}}
  User's Question Description: {{{questionDescription}}}

  Existing Questions:
  {{#each existingQuestions}}- {{{this}}}\n{{/each}}
  `,
});

const suggestRelatedQuestionsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedQuestionsFlow',
    inputSchema: SuggestRelatedQuestionsInputSchema,
    outputSchema: SuggestRelatedQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
