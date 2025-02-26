import { deepSeek } from './deepseek.js';
import { openai } from './chatgpt.js';
import { googleGenerativeAI } from './gemini.js';
import { llm } from './llama.js';

export async function semanticSearch(query: { message: any; model: any }) {
  try {
    const { message, model } = query;
    console.log(`Running Deep Seek AI model ${model}`);
    const completion = await deepSeek.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a powerful search engine. Return concise, factual answers.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });
    const content = completion.choices[0].message.content;
    if (content) {
      console.log(completion.choices[0].message.content);
      return JSON.parse(content);
    } else {
      throw new Error('Completion content is null');
    }
  } catch (error: any) {
    throw error;
  }
}
export async function llamaSemanticSearch(query: { message: any; model: any }) {
  try {
    const { message, model } = query;

    console.log(`Running Llama Open AI model ${model}`);

    const completion = await llm.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a powerful search engine. Return concise, factual answers.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });
    return completion.choices[0].message.content;
  } catch (error: any) {
    console.error('Search error:', error.message);
    throw error;
  }
}

export async function geminiSemanticSearch(query: {
  query?: any;
  history?: any;
  message?: any;
  model?: any;
}) {
  try {
    const { history, message, model } = query;

    console.log(history);

    console.log(message);

    const gemini = googleGenerativeAI.getGenerativeModel(model);
    console.log(`Running Gemini model ${model}`);

    const result = await gemini.generateContent(message);
    console.log(result.response.text());
    return result.response.text();
  } catch (error: any) {
    console.error('Search error:', error.message);
    throw error;
  }
}
export async function openAISemanticSearch(query: {
  model: any;
  message: any;
}) {
  try {
    const { model, message } = query;
    console.log(`Running  Open AI model ${model}`);
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'You are a powerful search engine. Return concise, factual answers.',
            },
          ],
        },
        { role: 'user', content: message },
      ],
      response_format: {
        type: 'text',
      },
      store: true,
      temperature: 0.3,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
  } catch (error: any) {
    console.error('Search error:', error.cause.message + ':' + error.message);
    //   throw error;
    return error.message;
  }
}
