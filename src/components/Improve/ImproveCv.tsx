import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCV } from '../../context/CVContext';
import { CVData } from '../../context/CVContext';
import { CVParser } from '../../services/CVParser';

interface AnalysisResult {
  section: keyof CVData;
  status: 'empty' | 'partial' | 'complete';
  message: string;
}

const ImproveCv: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cvData, updatePersonalInfo, addWorkExperience, addEducation, addSkill, addProject } = useCV();
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const file = location.state?.file as File;
    if (!file) {
      navigate('/');
      return;
    }

    const analyzeCV = async () => {
      try {
        setProgress(20);
        const parsedData = await CVParser.parseCV(file);
        setProgress(60);

        // Mettre à jour le contexte avec les données analysées
        if (parsedData.data.personalInfo) {
          const personalInfo: CVData['personalInfo'] = {
            firstName: parsedData.data.personalInfo.firstName || '',
            lastName: parsedData.data.personalInfo.lastName || '',
            email: parsedData.data.personalInfo.email || '',
            phone: parsedData.data.personalInfo.phone || '',
            address: parsedData.data.personalInfo.address || '',
            summary: parsedData.data.personalInfo.summary || ''
          };
          updatePersonalInfo(personalInfo);
        }

        parsedData.data.workExperience?.forEach(exp => {
          addWorkExperience(exp);
        });

        parsedData.data.education?.forEach(edu => {
          addEducation(edu);
        });

        parsedData.data.skills?.forEach(skill => {
          addSkill(skill);
        });

        parsedData.data.projects?.forEach(project => {
          addProject(project);
        });

        setProgress(80);

        // Analyser chaque section du CV
        const results: AnalysisResult[] = [
          {
            section: 'personalInfo',
            status: Object.values(parsedData.data.personalInfo || {}).every(v => v) ? 'complete' : 
                   Object.values(parsedData.data.personalInfo || {}).some(v => v) ? 'partial' : 'empty',
            message: 'Informations personnelles'
          },
          {
            section: 'workExperience',
            status: (parsedData.data.workExperience?.length || 0) > 0 ? 'complete' : 'empty',
            message: 'Expérience professionnelle'
          },
          {
            section: 'education',
            status: (parsedData.data.education?.length || 0) > 0 ? 'complete' : 'empty',
            message: 'Formation'
          },
          {
            section: 'skills',
            status: (parsedData.data.skills?.length || 0) > 0 ? 'complete' : 'empty',
            message: 'Compétences'
          },
          {
            section: 'projects',
            status: (parsedData.data.projects?.length || 0) > 0 ? 'complete' : 'empty',
            message: 'Projets'
          }
        ];

        setAnalysisResults(results);
        setProgress(100);
        setIsAnalyzing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'analyse');
        setIsAnalyzing(false);
      }
    };

    analyzeCV();
  }, [location.state, navigate, updatePersonalInfo, addWorkExperience, addEducation, addSkill, addProject]);

  const getStatusColor = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'complete':
        return 'text-green-600';
      case 'partial':
        return 'text-yellow-600';
      case 'empty':
        return 'text-red-600';
    }
  };

  const getStatusIcon = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'complete':
        return '✓';
      case 'partial':
        return '!';
      case 'empty':
        return '×';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center text-red-600 mb-6">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold">{error}</h2>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Analyse de votre CV
        </h1>

        {isAnalyzing ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-center text-gray-600">
              {progress < 100 ? "Analyse en cours..." : "Analyse terminée !"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Résultats de l'analyse</h2>
            <div className="space-y-4">
              {analysisResults.map((result) => (
                <div key={result.section} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                    </span>
                    <span className="text-gray-700">{result.message}</span>
                  </div>
                  <span className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.status === 'complete' ? 'Complet' : 
                     result.status === 'partial' ? 'Partiel' : 'À remplir'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => navigate('/cv-form/personal-info')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Compléter mon CV
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImproveCv;
