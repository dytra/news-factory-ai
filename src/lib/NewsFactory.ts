import OpenAIApi from 'openai';
import { ChatCompletionMessage } from 'openai/resources';

export default class NewsFactory {
    private openai: OpenAIApi;

    constructor(apiKey?: string) {
        // Create the Configuration and OpenAIApi instances
        this.openai = new OpenAIApi({ apiKey });
    }

    // Asynchronous function to generate text from the OpenAI API
    async generateText(prompt: string, model: string, max_tokens: number, temperature: number = 0.85): Promise<ChatCompletionMessage> {
        try {
            // Send a request to the OpenAI API to generate text
            
            const response = await this.openai.chat.completions.create({
                model,
                messages: [
                  {role:"system",content:`You are a news writer assistant. Your job is to rewrite a news to a json format. The json format is "title","slug" and "content". the "content" field should be html. Remove the original publisher information like CNBC. Remove any external links and notions. Make sure you return a json string that could be easily parsed javascript.Remove all of the script tags. For html attributes, You have to escape the doublequotes using the double backslashes`},
                  {"role": "user", "content": prompt}],
                n: 1,
                temperature,
            });

            // console.log(`request cost: ${response.data.usage.total_tokens} tokens`);

            return response.choices[0].message;
            // return response.choices[0].message;
        } catch (error) {
            throw error;
        }
    }
}
