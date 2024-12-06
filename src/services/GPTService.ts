import { OpenAI } from 'openai';
import { CVData } from '../context/CVContext';
import prompts from '../prompts.json';

export class GPTService {
    private openai: OpenAI;

    constructor() {
        // Récupérer la clé API depuis l'environnement
        const apiKey = process.env.REACT_APP_API_KEY;

        if (!apiKey) {
            console.error('CRITICAL: No API key found!');
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
        const retryDelay = 5000; // 5 secondes

        while (retryCount <= maxRetries) {
            try {
                const formattedPrompt = userPrompt.replace(/\$\{text\}/g, text);
                const completion = await this.openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: formattedPrompt }
                    ],
                    temperature: 0.3
                });

                const response = completion.choices[0].message.content;
                console.log('Raw GPT Response:', response);
                
                if (!response || !response.trim().startsWith('{')) {
                    throw new Error(language === 'fr' ? 'La réponse n\'est pas un JSON valide' : 'Response is not valid JSON');
                }

                const parsedData = JSON.parse(response);
                
                // Format skills if they exist
                if (parsedData.skills) {
                    console.log('Raw skills before formatting:', parsedData.skills);
                    parsedData.skills = this.formatSkills(parsedData.skills);
                    console.log('Formatted skills:', parsedData.skills);
                }

                return parsedData;

            } catch (error: any) {
                console.error('GPT Error:', error);

                // Si c'est une erreur de limite de taux
                if (error?.message?.includes('rate limit exceeded')) {
                    if (retryCount === maxRetries) {
                        throw new Error(
                            language === 'fr' 
                                ? 'Limite d\'utilisation de l\'API atteinte. Veuillez réessayer dans quelques minutes.' 
                                : 'API rate limit reached. Please try again in a few minutes.'
                        );
                    }
                    
                    // Attendre avant de réessayer
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    retryCount++;
                    continue;
                }

                // Pour les autres erreurs
                throw new Error(
                    language === 'fr'
                        ? 'Une erreur est survenue lors de l\'analyse du CV: ' + error.message
                        : 'An error occurred while analyzing the CV: ' + error.message
                );
            }
        }

        throw new Error(
            language === 'fr'
                ? 'Nombre maximum de tentatives atteint'
                : 'Maximum retry attempts reached'
        );
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

    private formatSkills(skills: any): any[] {
        // If skills is already an array, format each skill
        if (Array.isArray(skills)) {
            return skills.map(skill => this.formatSkillItem(skill));
        }

        // If skills is an object with category arrays, flatten it
        if (skills && typeof skills === 'object') {
            const flatSkills: any[] = [];
            Object.entries(skills as Record<string, any[]>).forEach(([category, skillList]) => {
                if (Array.isArray(skillList)) {
                    skillList.forEach((skill: any) => {
                        flatSkills.push(this.formatSkillItem(skill, category));
                    });
                }
            });
            return flatSkills;
        }

        console.warn('Skills format not recognized:', skills);
        return [];
    }

    private formatSkillItem(skill: any, defaultCategory: string = 'technical'): any {
        if (typeof skill === 'string') {
            return {
                name: skill,
                category: defaultCategory,
                level: 'intermediate'
            };
        }

        // Normalize the category
        let category = (skill.category || defaultCategory).toLowerCase();
        if (category.includes('soft') || category.includes('comportement')) {
            category = 'soft';
        } else if (category.includes('tool') || category.includes('outil')) {
            category = 'tools';
        } else {
            category = 'technical';
        }

        return {
            name: skill.name || '',
            category: category,
            level: skill.level || 'intermediate'
        };
    }
}
