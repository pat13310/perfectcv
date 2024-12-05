import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TemplateType } from './TemplateRenderer';
import TemplateCard from './TemplateCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCV } from '../../context/CVContext';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: TemplateType;
  title: string;
  description: string;
  image: string;
}

interface TemplateSelectorProps {
  onSelect?: (templateId: TemplateType) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('moderne');
  const { language } = useLanguage();
  const { updateSelectedTemplate } = useCV();
  const navigate = useNavigate();

  // Set default template on mount
  useEffect(() => {
    updateSelectedTemplate('moderne');
  }, [updateSelectedTemplate]);

  const templates: Template[] = [
    {
      id: 'moderne',
      title: language === 'fr' ? 'Moderne' : 'Modern',
      description: language === 'fr' 
        ? 'Un design contemporain avec une mise en page équilibrée'
        : 'A contemporary design with balanced layout',
      image: '/templates/moderne.png'
    },
    {
      id: 'minimal',
      title: language === 'fr' ? 'Minimaliste' : 'Minimal',
      description: language === 'fr' 
        ? 'Simple et élégant, parfait pour mettre en valeur votre contenu'
        : 'Simple and elegant, perfect for highlighting your content',
      image: '/templates/minimal.png'
    },
    {
      id: 'professionnel',
      title: language === 'fr' ? 'Professionnel' : 'Professional',
      description: language === 'fr' 
        ? 'Style classique adapté aux secteurs traditionnels'
        : 'Classic style suited for traditional industries',
      image: '/templates/professionnel.png'
    },
    {
      id: 'créatif',
      title: language === 'fr' ? 'Créatif' : 'Creative',
      description: language === 'fr' 
        ? 'Design unique pour les profils créatifs et innovants'
        : 'Unique design for creative and innovative profiles',
      image: '/templates/créatif.png'
    },
    {
      id: 'élégant',
      title: language === 'fr' ? 'Élégant' : 'Elegant',
      description: language === 'fr' 
        ? 'Design sophistiqué avec une touche de raffinement'
        : 'Sophisticated design with a touch of refinement',
      image: '/templates/élégant.png'
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    updateSelectedTemplate(templateId);
    if (onSelect) {
      onSelect(templateId);
    }
  };

  const handleValidation = () => {
    if (selectedTemplate) {
      updateSelectedTemplate(selectedTemplate);
      navigate('/cv-form/preview');
    }
  };

  return (
    <div className="w-full py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {language === 'fr' ? 'Choisissez votre modèle' : 'Choose your template'}
      </h2>
      <div className="max-w-6xl mx-auto px-4">
        <Slider {...sliderSettings}>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              title={template.title}
              description={template.description}
              image={template.image}
              isSelected={selectedTemplate === template.id}
              onClick={() => handleSelect(template.id)}
            />
          ))}
        </Slider>
        {selectedTemplate && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleValidation}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
            >
              {language === 'fr' ? 'Valider votre choix' : 'Confirm your choice'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
