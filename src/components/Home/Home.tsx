import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';
import CVParserUI from '../Parser/CVParserUI';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [showParser, setShowParser] = useState(false);

  const handleParseComplete = (result: any) => {
    navigate('/improve-cv', { state: { ...result } });
  };

  const handleParseError = (error: string) => {
    // Gérer l'erreur ici
    console.error(error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 animate-gradient-x overflow-hidden">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-8 animate-fade-in">
            {t.title}
            <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {t.subtitle}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 animate-fade-in-up">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <button
              onClick={() => navigate('/cv-form')}
              className="group relative inline-flex items-center px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105"
            >
              <span className="relative z-10">{t.startButton}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button
              onClick={() => setShowParser(true)}
              className="group relative inline-flex items-center px-8 py-4 text-lg font-medium rounded-full border-2 border-purple-600 text-purple-600 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                {t.improveButton}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 relative z-10 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>

          {/* Modal pour le parser */}
          {showParser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto p-6 transform transition-all duration-300 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Analyser votre CV</h2>
                  <button
                    onClick={() => setShowParser(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <CVParserUI
                  onParseComplete={handleParseComplete}
                  onError={handleParseError}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: t.features.fast.title,
                description: t.features.fast.description
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                ),
                title: t.features.templates.title,
                description: t.features.templates.description
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: t.features.ai.title,
                description: t.features.ai.description
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
              >
                <div className="text-purple-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.testimonials.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Sophie Martin",
                  role: t.testimonials.roles.developer,
                  content: t.testimonials.content1
                },
                {
                  name: "Thomas Bernard",
                  role: t.testimonials.roles.manager,
                  content: t.testimonials.content2
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                  <p className="text-gray-600 mb-4">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
