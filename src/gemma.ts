import OpenAI from 'openai';
import dotenv from 'dotenv';
import process from 'node:process';
import os from 'node:os';

dotenv.config();

// Configuration for the Gemma model
const GEMMA_MODEL_ID: string = process.env.GEMMA_MODEL_ID || '';
const GEMMA_LOCAL_BASE_URL: string = process.env.GEMMA_LOCAL_BASE_URL || '';
const GEMMA_REMOTE_BASE_URL: string = process.env.GEMMA_REMOTE_BASE_URL || '';
const GEMMA_PORT: string = process.env.GEMMA_PORT || '1234';
const API_VERSION: string = process.env.API_VERSION || '';
// TODO: point the right ip address based on the platform
const URI =
  os.platform() === 'win32' ? GEMMA_LOCAL_BASE_URL : GEMMA_REMOTE_BASE_URL;
const BASE_URL = `${URI}${GEMMA_PORT}${API_VERSION}`;
console.log('BASE_URL', BASE_URL);
// Create OpenAI-compatible client for Gemma
export const gemma = new OpenAI({
  baseURL: BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY, // The server might not require an API key
  defaultHeaders: {
    'Content-Type': 'application/json',
  }
});

// Helper function for text completions
export async function generateText(
  prompt: string,
  model: string,
  options: GemmaGenerationOptions = {}
) {
  try {
    const response = await gemma.completions.create({
      model: model,
      prompt,
      max_tokens: options.maxTokens ?? 512,
      temperature: options.temperature ?? 0.7,
      top_p: options.topP ?? 1.0,
      stop: options.stopSequences,
    });
    console.dir(response);
    return {
      text: response.choices[0]?.text || '',
      usage: response.usage || null,
      model: GEMMA_MODEL_ID,
    };
  } catch (error) {
    console.error('Error calling Gemma API:', error);
    return {
      text: 'Error calling Gemma API:',
      usage: null,
      model: GEMMA_MODEL_ID,
    };
  }
}

// Helper function for chat completions
export async function generateChatCompletion(
  messages: GemmaChatMessage[],
  model: string,
  options: GemmaGenerationOptions = {}
) {
  try {
    const response = await gemma.chat.completions.create({
      model: model,
      messages,
      max_tokens: options.maxTokens ?? 512,
      temperature: options.temperature ?? 0.7,
      top_p: options.topP ?? 1.0,
      stop: options.stopSequences,
    });

    return {
      message: response.choices[0]?.message || {
        role: 'assistant',
        content: '',
      },
      usage: response.usage || null,
      model: GEMMA_MODEL_ID,
    };
  } catch (error) {
    console.error('Error calling Gemma chat API:', error);
    throw error;
  }
}

// Helper function for embedding
export async function generateEmbedding(
  prompt: string,
  model: string,
  options: GemmaGenerationOptions = {}
) {
  const response = await gemma.embeddings.create({
    model: model,
    input: prompt,
    dimensions: options.dimensions ?? 1536,
  });
  return response.data[0].embedding;
}

export interface GemmaGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  dimensions?: number;
  stopSequences?: string[];
}

export interface GemmaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GemmaEmbeddingOptions {
  dimensions?: number;
}
