import { OpenAI } from 'openai';
import { CVData } from '../context/CVContext';
import prompts from '../prompts.json';

export class GPTService {
    private openai: OpenAI;

    constructor() {

        // Find the first non-empty API key
        const apiKey = process.env.REACT_APP_API_KEY

        if (!apiKey) {
            console.error('CRITICAL: No API key found!');
            console.error('Full environment:', process.env);
            throw new Error("API key is missing. Please set REACT_APP_API_KEY in your .env file.");
        }

        console.log('API Key found:', apiKey ? 'Yes' : 'No');
        console.log('API Key length:', apiKey?.length);


        this.openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });
    }

    async analyzeCV(text: string, language: 'fr' | 'en'): Promise<Partial<CVData>> {
        const { systemPrompt, userPrompt } = prompts[language];

        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount <= maxRetries) {
            try {
                const completion = await this.openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt.replace('${text}', text) }
                    ],
                    temperature: 0.3
                });

                const response = completion.choices[0].message.content;
                console.log('Raw GPT Response:', response);
                if (!response || !response.trim().startsWith('{')) {
                    throw new Error(language === 'fr' ? 'La réponse n\'est pas un JSON valide' : 'Response is not valid JSON');
                }

                try {
                    const parsedData = JSON.parse(response.trim());
                    return this.formatGPTResponse(parsedData);
                } catch (parseError) {
                    console.error('JSON Parsing Error:', parseError);
                    throw new Error(language === 'fr'
                        ? `Erreur de parsing JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`
                        : `JSON parsing error: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
                }
            } catch (error: any) {
                console.error('GPT API Error:', error.message);
                if (error?.message?.includes('rate limit')) {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        const waitTime = Math.min(
                            parseInt(error?.message?.match(/try again in (\d+)/)?.[1] || '60', 10),
                            300 // Cap at 5 minutes
                        );
                        console.log(`Rate limit hit. Waiting ${waitTime} seconds before retry ${retryCount}/${maxRetries}`);
                        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
                        continue;
                    }
                }
                throw new Error(language === 'fr'
                    ? `Erreur lors de l'analyse du CV: ${error.message}`
                    : `Error analyzing CV: ${error.message}`);
            }
        }

        // Add a default return to satisfy TypeScript's requirement
        return {
            personalInfo: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                summary: ''
            },
            workExperience: [{
                position: '',
                company: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }],
            education: [{
                school: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }],
            skills: [{
                name: '',
                level: '',
                category: ''
            }],
            projects: [{
                name: '',
                description: '',
                technologies: [],
                startDate: '',
                endDate: '',
                link: ''
            }]
               
        };
    }

    async generateSuggestions(cvData: Partial<CVData>, language: 'fr' | 'en'): Promise<Record<keyof CVData, string[]> | undefined> {
        const systemPrompt = language === 'fr' ?
            "Tu es un expert en optimisation de CV. Fournis des suggestions constructives pour améliorer chaque section." :
            "You are a CV optimization expert. Provide constructive suggestions to improve each section.";

        const userPrompt = `Analyze this CV data and provide improvement suggestions for each section:
        ${JSON.stringify(cvData, null, 2)}`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            const response = completion.choices[0].message.content;
            if (!response) {
                console.warn('No response from GPT');
                return undefined;
            }

            return JSON.parse(response);
        } catch (error) {
            console.error('Error generating suggestions:', error);
            return undefined;
        }
    }

    private formatGPTResponse(gptResponse: any): Partial<CVData> {
        console.log('GPT Response:', gptResponse);
        return {
            personalInfo: gptResponse.personalInfo || [],
            workExperience: Array.isArray(gptResponse.workExperience) ? gptResponse.workExperience : [],
            education: gptResponse.education || [],
            skills: gptResponse.skills || [],
            projects: gptResponse.projects || []
        };
    }
}
