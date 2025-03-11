import Anthropic from '@anthropic-ai/sdk';
import process from 'node:process';
import dotenv from 'dotenv';
dotenv.config();

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
