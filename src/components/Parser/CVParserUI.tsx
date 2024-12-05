import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CVParser } from '../../services/CVParser';
import { useLanguage } from '../../context/LanguageContext';
import { CVData } from '../../context/CVContext';

interface ParsingStatus {
  stage: 'idle' | 'detecting' | 'extracting' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error?: string;
}

interface CVParserUIProps {
  onParseComplete: (data: { data: Partial<CVData>; language: 'fr' | 'en'; suggestions: Record<keyof CVData, string[]> }) => void;
  onError: (error: string) => void;
}

const CVParserUI: React.FC<CVParserUIProps> = ({ onParseComplete, onError }) => {
  const [status, setStatus] = useState<ParsingStatus>({ stage: 'idle', progress: 0 });
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleFileUpload = async (file: File) => {
    try {
      setStatus({ stage: 'detecting', progress: 25 });
      
      const result = await CVParser.parseCV(file, (progress) => {
        setStatus({
          stage: progress.stage.toLowerCase() as ParsingStatus['stage'],
          progress: progress.progress
        });
      });

      // Ensure all CVData keys have suggestions
      const completeSuggestions: Record<keyof CVData, string[]> = {
        personalInfo: result.suggestions.personalInfo || [],
        workExperience: result.suggestions.workExperience || [],
        education: result.suggestions.education || [],
        skills: result.suggestions.skills || [],
        projects: result.suggestions.projects || [],
        languages: result.suggestions.languages || [],
        certifications: result.suggestions.certifications || [],
        references: result.suggestions.references || [],
        customSections: result.suggestions.customSections || [],
        selectedTemplate: result.suggestions.selectedTemplate || []
      };

      onParseComplete({
        ...result,
        suggestions: completeSuggestions
      });
      navigate('/parse-result', { state: { data: result.data } });
      
    } catch (error: any) {
      setStatus({
        stage: 'error',
        progress: 0,
        error: error.message || 'Une erreur est survenue lors de l\'analyse du CV'
      });
      onError(error.message || 'Une erreur est survenue lors de l\'analyse du CV');
    }
  };

  const getStatusText = () => {
    switch (status.stage) {
      case 'detecting':
        return 'Détection du type de fichier...';
      case 'extracting':
        return 'Extraction du texte...';
      case 'analyzing':
        return 'Analyse du contenu...';
      case 'complete':
        return 'Analyse terminée !';
      case 'error':
        return `Erreur: ${status.error}`;
      default:
        return 'Prêt à analyser';
    }
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* Barre de progression animée */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${status.progress}%` }}
            />
          </div>

          {/* Zone de dépôt de fichier */}
          <div className={`
            relative border-2 border-dashed rounded-xl p-8 text-center
            transition-all duration-300
            ${status.stage === 'idle' ? 'border-gray-300 hover:border-purple-500' : 'border-purple-500'}
            ${status.stage === 'error' ? 'border-red-500' : ''}
          `}>
            <input
              type="file"
              id="cv-file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              disabled={status.stage !== 'idle' && status.stage !== 'error'}
            />

            {status.stage === 'idle' && (
              <label
                htmlFor="cv-file"
                className="block cursor-pointer group"
              >
                <div className="text-purple-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Déposez votre CV ici
                </p>
                <p className="text-sm text-gray-500">
                  ou cliquez pour sélectionner un fichier
                </p>
              </label>
            )}

            {status.stage !== 'idle' && (
              <div className="py-4">
                <div className="mb-4">
                  {status.stage === 'error' ? (
                    <svg
                      className="w-16 h-16 mx-auto text-red-500 animate-bounce"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : status.stage === 'complete' ? (
                    <svg
                      className="w-16 h-16 mx-auto text-green-500 animate-bounce"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto" />
                  )}
                </div>
                <p className={`text-lg font-medium ${
                  status.stage === 'error' ? 'text-red-600' :
                  status.stage === 'complete' ? 'text-green-600' :
                  'text-purple-600'
                }`}>
                  {getStatusText()}
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2">Formats supportés : PDF, DOC, DOCX</p>
            <p>Taille maximale : 10 MB</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CVParserUI;
