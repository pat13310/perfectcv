import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onPreview: () => void;
}

const formSteps = [
  { path: '/cv-form/personal-info', label: 'Personal Info' },
  { path: '/cv-form/education', label: 'Education' },
  { path: '/cv-form/work-experience', label: 'Work Experience' },
  { path: '/cv-form/skills', label: 'Skills' },
  { path: '/cv-form/projects', label: 'Projects' },
  { path: '/cv-form/certifications', label: 'Certifications' },
  { path: '/cv-form/references', label: 'References' },
  { path: '/cv-form/custom-section', label: 'Custom Section' },
];

const NavigationContent: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onPreview,
}) => {
  const { language } = useLanguage();
  const t = translations[language].form.navigation;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center space-x-4">
          <div className="flex space-x-4">
            {currentStep > 1 && (
              <button
                onClick={onPrevious}
                className="px-6 py-2 text-gray-200 bg-gray-700 rounded-3xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-300"
              >
                {t.previous}
              </button>
            )}
          </div>
          
          <div className="flex-1 flex items-center space-x-4">
            <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              >
                <div className="animate-pulse bg-gradient-to-r from-indigo-400 to-purple-400 h-full opacity-50"></div>
              </div>
            </div>
            <div className="text-sm text-gray-300 whitespace-nowrap">
              {currentStep} / {totalSteps}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onPreview}
              className="px-6 py-2 text-gray-200 bg-gray-700 rounded-3xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-300"
            >
              {t.preview}
            </button>
            <button
              onClick={onNext}
              className="px-6 py-2 text-white font-medium rounded-3xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90 hover:opacity-100"
            >
              {currentStep === totalSteps ? t.finish : t.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component that handles navigation logic
const FormNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStepIndex = formSteps.findIndex(step => step.path === location.pathname);

  const handleNext = () => {
    if (currentStepIndex < formSteps.length - 1) {
      navigate(formSteps[currentStepIndex + 1].path);
    } else {
      navigate('/templates');
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      navigate(formSteps[currentStepIndex - 1].path);
    }
  };

  const handlePreview = () => {
    navigate('/cv-form/preview');
  };

  return (
    <NavigationContent
      currentStep={currentStepIndex + 1}
      totalSteps={formSteps.length}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onPreview={handlePreview}
    />
  );
};

export default FormNavigation;
