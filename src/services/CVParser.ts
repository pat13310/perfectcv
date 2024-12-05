import { getDocument } from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import mammoth from 'mammoth';
import { fileTypeFromBlob } from 'file-type';
import { CVData } from '../context/CVContext';
import { initPdfWorker } from '../utils/pdfjs-worker';
import { logger } from '../utils/logger';
import { GPTService } from './GPTService';

// Initialize PDF.js worker
initPdfWorker();

export interface ParsingError extends Error {
  name: string;
  code: 'FILE_TYPE' | 'EXTRACTION' | 'PARSING';
  message: string;
  details?: any;
}

export interface ParsingProgress {
  stage: 'FILE_TYPE' | 'EXTRACTION' | 'ANALYSIS' | 'COMPLETE';
  progress: number;
}

export interface ParsingResult {
  data: Partial<CVData>;
  language: 'fr' | 'en';
  suggestions: Record<keyof CVData, string[]>;
}

export class CVParser {
  private static readonly SUPPORTED_MIME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Vérifie si le fichier est valide
   */
  private static validateFile(file: File): void {
    logger.info('[CVParser] Validation du fichier', { name: file.name, size: file.size });
    if (file.size > this.MAX_FILE_SIZE) {
      throw this.createError(
        'Le fichier est trop volumineux. Taille maximale : 10MB',
        'FILE_TYPE',
        { size: file.size }
      );
    }
    logger.info('[CVParser] Fichier valide');
  }

  /**
   * Détecte le type MIME du fichier
   */
  private static async getFileType(file: File): Promise<string> {
    try {
      logger.info('[CVParser] Détection du type de fichier', { name: file.name });
      const fileType = await fileTypeFromBlob(file);
      const mimeType = fileType?.mime || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : '');

      logger.info('[CVParser] Type de fichier détecté', { mimeType });

      if (!this.SUPPORTED_MIME_TYPES.includes(mimeType)) {
        throw this.createError(
          'Format de fichier non supporté. Formats acceptés : PDF, DOCX',
          'FILE_TYPE',
          { detectedType: mimeType }
        );
      }

      return mimeType;
    } catch (error) {
      if ((error as ParsingError).code === 'FILE_TYPE') throw error;
      throw this.createError(
        'Impossible de détecter le type de fichier',
        'FILE_TYPE',
        { originalError: error }
      );
    }
  }

  /**
   * Extrait le texte d'un fichier PDF
   */
  private static async extractTextFromPDF(file: File): Promise<string> {
    try {
      logger.info('[CVParser] Début de l\'extraction du texte PDF', { 
        fileName: file.name,
        fileSize: file.size 
      });

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      logger.info('[CVParser] PDF chargé avec succès', { pages: pdf.numPages });
      
      for (let i = 1; i <= pdf.numPages; i++) {
        logger.debug(`[CVParser] Traitement de la page PDF ${i}/${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        logger.debug('[CVParser] Contenu de la page récupéré', {
          itemCount: textContent.items.length,
          firstItem: textContent.items[0] && 'str' in textContent.items[0] 
            ? textContent.items[0].str 
            : 'No items'
        });

        // Simple text extraction for debugging
        const pageText = textContent.items
          .filter((item): item is TextItem => 'str' in item) // Type guard to ensure we only get TextItems
          .map(item => item.str)
          .join(' ');

        fullText += pageText + '\n';

        logger.debug('[CVParser] Page traitée', {
          pageNumber: i,
          textLength: pageText.length,
          preview: pageText.substring(0, 100)
        });
      }
      
      // Basic text cleaning
      fullText = fullText
        .replace(/\s+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      logger.info('[CVParser] Extraction du texte PDF terminée', { 
        textLength: fullText.length,
        previewStart: fullText.substring(0, 100)
      });
      
      return fullText;
    } catch (error) {
      logger.error('[CVParser] Erreur lors de l\'extraction du texte PDF', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fileName: file.name
      });
      throw this.createError(
        'Impossible d\'extraire le texte du PDF',
        'EXTRACTION',
        { originalError: error }
      );
    }
  }

  /**
   * Extrait le texte d'un fichier DOCX
   */
  private static async extractTextFromDOCX(file: File): Promise<string> {
    try {
      logger.info('[CVParser] Début de l\'extraction du texte DOCX', { name: file.name });
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      logger.info('[CVParser] Extraction du texte DOCX terminée', { 
        textLength: result.value.length,
        previewStart: result.value.substring(0, 100)
      });
      
      return result.value;
    } catch (error) {
      throw this.createError(
        'Impossible d\'extraire le texte du fichier DOCX',
        'EXTRACTION',
        { originalError: error }
      );
    }
  }

  /**
   * Détecte la langue du texte (français ou anglais)
   */
  private static detectLanguage(text: string): 'fr' | 'en' {
    logger.info('[CVParser] Détection de la langue du CV');
    const frenchKeywords = /expérience|formation|compétences|projet|études|diplôme|développeur|ingénieur/i;
    const englishKeywords = /experience|education|skills|project|degree|developer|engineer/i;

    const frenchMatches = (text.match(frenchKeywords) || []).length;
    const englishMatches = (text.match(englishKeywords) || []).length;

    const detectedLanguage = frenchMatches >= englishMatches ? 'fr' : 'en';
    logger.info('[CVParser] Langue détectée', { 
      detectedLanguage,
      frenchMatches,
      englishMatches
    });

    return detectedLanguage;
  }

  /**
   * Méthode statique pour analyser un CV avec GPT
   * @param text Le texte du CV à analyser
   * @param language La langue du CV
   * @returns Une analyse partielle des données du CV
   */
  static async analyzeCVWithGPT(text: string, language: 'fr' | 'en'): Promise<Partial<CVData>> {
    const gptService = new GPTService();
    return await gptService.analyzeCV(text, language);
  }

  /**
   * Parse le fichier pour extraire les données du CV
   */
  public static async parseCV(
    file: File,
    onProgress?: (progress: ParsingProgress) => void
  ): Promise<ParsingResult> {
    try {
      logger.info('[CVParser] Début du parsing du CV', { 
        fileName: file.name,
        fileSize: file.size 
      });

      // Validation du fichier
      this.validateFile(file);
      onProgress?.({ stage: 'FILE_TYPE', progress: 25 });

      // Détection du type de fichier
      const fileType = await this.getFileType(file);
      onProgress?.({ stage: 'EXTRACTION', progress: 50 });

      // Extraction du texte
      logger.info('[CVParser] Début de l\'extraction du texte', { mimeType: fileType });
      let extractedText = '';
      if (fileType === 'application/pdf') {
        extractedText = await this.extractTextFromPDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await this.extractTextFromDOCX(file);
      }

      onProgress?.({ stage: 'ANALYSIS', progress: 75 });

      // Détecte la langue du texte
      const detectedLanguage = this.detectLanguage(extractedText);

      // Use GPT to analyze the extracted text
      const gptAnalysis = await CVParser.analyzeCVWithGPT(extractedText, detectedLanguage);

      if (onProgress) {
        onProgress({ stage: 'ANALYSIS', progress: 90 });
      }

      // Génère des suggestions d'amélioration pour les sections du CV
      const suggestions = this.generateSuggestions(gptAnalysis, detectedLanguage);

      onProgress?.({ stage: 'COMPLETE', progress: 100 });

      logger.info('[CVParser] Parsing du CV terminé avec succès');
      return { data: gptAnalysis, language: detectedLanguage, suggestions };
    } catch (error) {
      if ((error as ParsingError).code) throw error;
      throw this.createError(
        'Une erreur est survenue lors de l\'analyse du CV',
        'PARSING',
        { originalError: error }
      );
    }
  }

  /**
   * Extraction des informations personnelles
   */
  private static extractPersonalInfo(text: string): CVData['personalInfo'] {
    try {
      logger.info('[CVParser] Extraction des informations personnelles');
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
      const phoneRegex = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
      const nameRegex = /([A-Z][a-zÀ-ÿ-]+)\s+([A-Z][a-zÀ-ÿ-]+)/;

      const emailMatch = text.match(emailRegex);
      const phoneMatch = text.match(phoneRegex);
      const nameMatch = text.match(nameRegex);

      const info = {
        firstName: nameMatch ? nameMatch[1] : '',
        lastName: nameMatch ? nameMatch[2] : '',
        email: emailMatch ? emailMatch[1] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        address: '',
        summary: ''
      };

      // Extraction du résumé
      try {
        const summaryRegex = /(?:résumé|profil|about|summary|profile).*?\n(.*?)(?=\n\s*(?:expérience|experience|formation|education|compétences|skills|$))/;
        const summaryMatch = text.match(summaryRegex);
        if (summaryMatch) {
          info.summary = summaryMatch[1].trim();
        }
      } catch (error) {
        logger.warn('[CVParser] Erreur lors de l\'extraction du résumé', { error });
      }

      // Extraction de l'adresse
      try {
        const addressRegex = /(?:adresse|address).*?:\s*(.*?)(?=\n|$)/i;
        const addressMatch = text.match(addressRegex);
        if (addressMatch) {
          info.address = addressMatch[1].trim();
        }
      } catch (error) {
        logger.warn('[CVParser] Erreur lors de l\'extraction de l\'adresse', { error });
      }

      logger.info('[CVParser] Informations personnelles extraites', {
        foundFields: Object.entries(info)
          .filter(([_, value]) => !!value)
          .map(([key]) => key)
      });

      return info;
    } catch (error) {
      logger.error('[CVParser] Erreur lors de l\'extraction des informations personnelles', { error });
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        summary: ''
      };
    }
  }

  /**
   * Extraction des expériences professionnelles
   */
  private static extractWorkExperience(text: string): CVData['workExperience'] {
    try {
      logger.info('[CVParser] Début de l\'extraction des expériences professionnelles');
      const experiences: CVData['workExperience'] = [];
      
      // Regex pour trouver la section expérience
      const experienceRegex = /(?:expériences?(?:\s+professionnelles?)?|(?:work\s+)?experiences?|parcours(?:\s+professionnel)?|career).*?\n(.*?)(?=\n\s*(?:formation|education|compétences|skills|projets|projects|certifications?|languages?|$))/;
      
      logger.info('[CVParser] Recherche de la section expérience avec regex');
      const match = text.match(experienceRegex);

      if (!match) {
        logger.warn('[CVParser] Aucune section d\'expérience trouvée dans le texte', { 
          textSample: text.slice(0, 200),
          regexPattern: experienceRegex.toString()
        });
        return [];
      }

      logger.info('[CVParser] Section d\'expérience trouvée, début de l\'analyse');
      const experienceText = match[1];
      const experienceBlocks = experienceText.split(/\n\s*\n/).filter(Boolean);
      
      logger.info('[CVParser] Section d\'expérience divisée en blocs', { 
        blocksCount: experienceBlocks.length,
        firstBlockPreview: experienceBlocks[0]?.substring(0, 100) 
      });

      experienceBlocks.forEach((block, index) => {
        try {
          logger.info(`[CVParser] Traitement du bloc d'expérience ${index + 1}/${experienceBlocks.length}`, { 
            blockLength: block.length,
            blockPreview: block.substring(0, 100) 
          });

          // Extraction des dates
          const dateRegex = /(?:depuis|from|de|à|to)?\s*(?:janvier|february|mars|april|mai|june|juin|july|juillet|august|août|september|septembre|october|octobre|november|novembre|december|décembre)?\s*\d{4}/gi;
          const dates = block.match(dateRegex) || [];
          logger.info('[CVParser] Dates extraites', { 
            dates,
            count: dates.length,
            isCurrentPosition: block.toLowerCase().includes('présent') || block.toLowerCase().includes('present') || block.toLowerCase().includes('en cours') || block.toLowerCase().includes('current')
          });
          
          // Extraction du titre/position
          const titleRegex = /^([^-–:|\n]{3,})/;
          const titleMatch = block.match(titleRegex);
          logger.info('[CVParser] Position extraite', { 
            position: titleMatch ? titleMatch[1].trim() : null,
            matchLength: titleMatch?.[1].length 
          });

          // Extraction de l'entreprise
          const companyRegex = /(?:chez|at|@|pour|for|à|in)\s+([^,\n]{2,})/i;
          const companyMatch = block.match(companyRegex);
          logger.info('[CVParser] Entreprise extraite', { 
            company: companyMatch ? companyMatch[1].trim() : null,
            matchIndex: companyMatch?.index
          });

          if (titleMatch) {
            const experience = {
              position: titleMatch[1].trim(),
              company: companyMatch ? companyMatch[1].trim() : '',
              startDate: dates[0] || '',
              endDate: dates[1] || '',
              current: block.toLowerCase().includes('présent') || 
                      block.toLowerCase().includes('present') || 
                      block.toLowerCase().includes('en cours') || 
                      block.toLowerCase().includes('current'),
              description: block
                .replace(titleRegex, '')
                .replace(companyRegex, '')
                .replace(dateRegex, '')
                .trim()
            };

            logger.info('[CVParser] Expérience extraite', { 
              experience,
              descriptionLength: experience.description.length 
            });
            experiences.push(experience);
          } else {
            logger.warn('[CVParser] Aucune position valide trouvée dans le bloc d\'expérience', { 
              blockIndex: index,
              blockContent: block,
              possiblePosition: block.split('\n')[0]
            });
          }
        } catch (error) {
          logger.warn(`[CVParser] Erreur lors du traitement du bloc d'expérience ${index + 1}`, { 
            error,
            block 
          });
        }
      });
      return experiences;
    } catch (error) {
      logger.error('[CVParser] Erreur lors de l\'extraction des expériences professionnelles', { error });
      return [];
    }
  }

  /**
   * Extraction de l'éducation
   */
  private static extractEducation(text: string): CVData['education'] {
    try {
      logger.info('[CVParser] Début de l\'extraction de l\'éducation');
      const education: CVData['education'] = [];
      
      const educationRegex = /(?:formation|education|études|studies).*?\n(.*?)(?=\n\s*(?:expérience|experience|compétences|skills|projets|projects|$))/;
      const match = text.match(educationRegex);

      if (match) {
        const educationText = match[1];
        const educationBlocks = educationText.split(/\n\s*\n/).filter(Boolean);

        educationBlocks.forEach((block, index) => {
          try {
            // Extraction des dates
            const dateRegex = /(?:depuis|from|de|à|to)?\s*(?:janvier|february|mars|april|mai|june|juin|july|juillet|august|août|september|septembre|october|octobre|november|novembre|december|décembre)?\s*\d{4}/gi;
            const dates = block.match(dateRegex) || [];

            // Extraction du diplôme et de l'école
            const degreeRegex = /^([^-–:|\n]+)/;
            const degreeMatch = block.match(degreeRegex);
            const schoolRegex = /(?:à|at|@)\s+([^,\n]+)/i;
            const schoolMatch = block.match(schoolRegex);

            if (degreeMatch) {
              const degreeParts = degreeMatch[1].split(/\s+en\s+|\s+in\s+/i);
              education.push({
                school: schoolMatch ? schoolMatch[1].trim() : '',
                degree: degreeParts[0].trim(),
                field: degreeParts[1] || '',
                startDate: dates[0] || '',
                endDate: dates[1] || '',
                current: block.toLowerCase().includes('présent') || block.toLowerCase().includes('present'),
                description: block
                  .replace(degreeRegex, '')
                  .replace(schoolRegex, '')
                  .replace(dateRegex, '')
                  .trim()
              });
            }
          } catch (error) {
            logger.warn(`[CVParser] Erreur lors du traitement du bloc d'éducation ${index + 1}`, { 
              error,
              block 
            });
          }
        });
      }

      logger.info('[CVParser] Éducation extraite', { 
        educationEntriesFound: education.length 
      });

      return education;
    } catch (error) {
      logger.error('[CVParser] Erreur lors de l\'extraction de l\'éducation', { error });
      return [];
    }
  }

  /**
   * Extraction des compétences
   */
  private static extractSkills(text: string): CVData['skills'] {
    try {
      logger.info('[CVParser] Début de l\'extraction des compétences');
      const skills: CVData['skills'] = [];
      const skillsRegex = /(?:compétences?|skills?).*?\n(.*?)(?=\n\s*(?:expérience|experience|formation|education|projets|projects|$))/;
      const match = text.match(skillsRegex);

      if (match) {
        const skillsText = match[1];
        const skillLines = skillsText.split(/[,\n•]/).filter(Boolean);

        // Catégories de compétences
        const categories = {
          programming: /(?:java|python|javascript|typescript|c\+\+|php|ruby|swift|kotlin|go|rust)\b/i,
          framework: /(?:react|angular|vue|spring|django|laravel|express|flutter|symfony)\b/i,
          database: /(?:sql|mysql|postgresql|mongodb|oracle|redis|elasticsearch)\b/i,
          tools: /(?:git|docker|kubernetes|jenkins|aws|azure|gcp|linux|unix)\b/i,
          soft: /(?:leadership|communication|team|management|agile|scrum|problem.solving)\b/i
        };

        skillLines.forEach((skill, index) => {
          try {
            const trimmedSkill = skill.trim();
            if (trimmedSkill) {
              let category = 'Autre';
              for (const [cat, regex] of Object.entries(categories)) {
                if (regex.test(trimmedSkill)) {
                  category = cat;
                  break;
                }
              }

              skills.push({
                name: trimmedSkill,
                level: 'Intermédiaire',
                category
              });
            }
          } catch (error) {
            logger.warn(`[CVParser] Erreur lors du traitement de la compétence ${index + 1}`, { 
              error,
              skill 
            });
          }
        });
      }

      logger.info('[CVParser] Compétences extraites', { 
        skillsFound: skills.length,
        categories: skills.reduce((acc, skill) => {
          acc[skill.category] = (acc[skill.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });

      return skills;
    } catch (error) {
      logger.error('[CVParser] Erreur lors de l\'extraction des compétences', { error });
      return [];
    }
  }

  /**
   * Extraction des projets
   */
  private static extractProjects(text: string): CVData['projects'] {
    try {
      logger.info('[CVParser] Début de l\'extraction des projets');
      const projects: CVData['projects'] = [];
      
      // Regex pour trouver la section projets
      const projectsRegex = /(?:projets?|projects?).*?\n(.*?)(?=\n\s*(?:expérience|experience|formation|education|compétences|skills|$))/;
      const match = text.match(projectsRegex);

      if (!match) {
        logger.warn('[CVParser] Aucune section de projets trouvée');
        return [];
      }

      const projectText = match[1];
      const projectBlocks = projectText.split(/\n\s*\n/).filter(Boolean);

      logger.info('[CVParser] Blocs de projets trouvés', { 
        nombreDeBlocs: projectBlocks.length 
      });

      projectBlocks.forEach((block, index) => {
        try {
          logger.info(`[CVParser] Analyse du bloc de projet ${index + 1}/${projectBlocks.length}`);
          
          // Extraction du titre
          const titleRegex = /^([^-–:|\n]{3,})/;
          const titleMatch = block.match(titleRegex);
          
          // Extraction des technologies
          const techRegex = /(?:technologies?|stack|outils?|tools?)\s*[:-]\s*([^.\n]+)/i;
          const techMatch = block.match(techRegex);

          if (titleMatch) {
            const project = {
              name: titleMatch[1].trim(),
              description: block.replace(titleRegex, '')
                             .replace(techRegex, '')
                             .trim(),
              technologies: techMatch 
                ? techMatch[1].split(/[,;]/).map(tech => tech.trim()).filter(Boolean)
                : [],
              startDate: '', 
              endDate: '',
            };

            logger.info('[CVParser] Projet extrait', { 
              nom: project.name,
              nombreTechnologies: project.technologies.length,
              longueurDescription: project.description.length 
            });

            projects.push(project);
          } else {
            logger.warn('[CVParser] Bloc de projet sans titre valide', { 
              indexBloc: index,
              contenuBloc: block.substring(0, 100) 
            });
          }
        } catch (error) {
          logger.warn(`[CVParser] Erreur lors du traitement du bloc de projet ${index + 1}`, { 
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            block: block.substring(0, 100)
          });
        }
      });

      logger.info('[CVParser] Extraction des projets terminée', { 
        nombreProjets: projects.length,
        projetsAvecTechnologies: projects.filter(p => p.technologies.length > 0).length
      });

      return projects;
    } catch (error) {
      logger.error('[CVParser] Erreur lors de l\'extraction des projets', { 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      });
      return [];
    }
  }

  /**
   * Creates a standardized parsing error
   * @param message Error message
   * @param code Error code
   * @param details Additional error details
   * @returns ParsingError
   */
  private static createError(
    message: string, 
    code: ParsingError['code'], 
    details?: any
  ): ParsingError {
    return {
      name: 'ParsingError',
      message,
      code,
      details
    };
  }

  /**
   * Génère des suggestions d'amélioration pour les sections du CV
   */
  private static generateSuggestions(data: Partial<CVData>, language: 'fr' | 'en'): Record<keyof CVData, string[]> {
    const suggestions: Record<keyof CVData, string[]> = {
      personalInfo: [],
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      languages: [],
      certifications: [],
      references: [],
      customSections: [],
      selectedTemplate: []
    };

    const messages = {
      fr: {
        summary: "Ajoutez un résumé professionnel détaillé d'au moins 100 caractères.",
        experience: {
          missing: "Ajoutez vos expériences professionnelles.",
          detail: "Détaillez vos réalisations et responsabilités pour chaque expérience."
        },
        education: "Ajoutez votre parcours académique.",
        skills: "Ajoutez au moins 5 compétences principales.",
        projects: "Ajoutez des projets significatifs pour illustrer vos compétences."
      },
      en: {
        summary: "Add a detailed professional summary of at least 100 characters.",
        experience: {
          missing: "Add your professional experiences.",
          detail: "Detail your achievements and responsibilities for each experience."
        },
        education: "Add your academic background.",
        skills: "Add at least 5 main skills.",
        projects: "Add significant projects to showcase your skills."
      }
    };

    const msg = messages[language];

    if (!data.personalInfo?.summary || data.personalInfo.summary.length < 100) {
      suggestions.personalInfo.push(msg.summary);
    }

    if (!data.workExperience || data.workExperience.length === 0) {
      suggestions.workExperience.push(msg.experience.missing);
    } else if (data.workExperience.some(exp => !exp.description || exp.description.length < 50)) {
      suggestions.workExperience.push(msg.experience.detail);
    }

    if (!data.education || data.education.length === 0) {
      suggestions.education.push(msg.education);
    }

    if (!data.skills || data.skills.length < 5) {
      suggestions.skills.push(msg.skills);
    }

    if (!data.projects || data.projects.length === 0) {
      suggestions.projects.push(msg.projects);
    }

    return suggestions;
  }
}
