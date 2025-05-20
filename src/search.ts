import { deepSeek } from './deepseek.ts';
import { openai, openAiImageToText } from './chatgpt.ts';
import { googleGenerativeAI, geminiImageToText } from './gemini.ts';
import { llm, llamaImageToText } from './llama.ts';
import { anthropic } from './claude.ts';

export async function semanticSearch(query: {
  message: string;
  model: string;
}) {
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
  } catch (error: unknown) {
    throw error;
  }
}
export async function llamaSemanticSearch(query: {
  message: string;
  model: string;
}) {
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
  message?: string;
  model?: string;
}) {
  try {
    const { message, model } = query;

    console.log(model);

    const gemini = googleGenerativeAI.getGenerativeModel({
      model: model || 'gemini-2.5-flash',
    });
    console.log(`Running Gemini model ${model}`);

    const result = await gemini.generateContent(
      message || 'What is the meaning of life?'
    );
    console.log(result.response.text());
    return result.response.text();
  } catch (error: any) {
    console.error('Search error:', error.message);
    throw error;
  }
}
export async function openAISemanticSearch(query: {
  model: string;
  message: string;
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
export async function claudeSemanticSearch(query: {
  model: string;
  message: string;
}) {
  try {
    const { model, message } = query;
    console.log(`Running  Claude model ${model}`);
    const msg = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }],
    });
    console.log(msg);
    return msg;
  } catch (error: any) {
    console.error('Search error:', error.cause.message + ':' + error.message);
    //   throw error;
    return error.message;
  }
}

export async function openAImageVision(
  model: string,
  message: string,
  url: string,
  fileExt: string
) {
  try {
    const response = await openAiImageToText(model, message, url, fileExt);
    return response.message.content;
  } catch (error: any) {
    console.error('Search error:', error.message);
    //   throw error;
    return error.message;
  }
}
export async function llamaImageVision(
  model: string,
  message: string,
  url: string
) {
  try {
    const response = await llamaImageToText(model, message, url);
    return response;
  } catch (error: any) {
    console.error('Search error:', error.message);
    //   throw error;
    return error.message;
  }
}
export async function geminiImageVision(
  model: string,
  message: string,
  typeOfAI: string,
  url: string,
  fileExt: string = 'image/jpg'
) {
  try {
    console.log(`Running  ${typeOfAI}  with model ${model}`);
    const response = await geminiImageToText(
      (model = 'gemini-2.5-flash'),
      message,
      url,
      fileExt
    );
    return response;
  } catch (error: any) {
    console.error('Search error:', error.message);
    //   throw error;
    return error.message;
  }
}
