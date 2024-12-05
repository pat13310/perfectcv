import React from 'react';
import { useCV } from '../../context/CVContext';

// Template types
export type TemplateType = 'moderne' | 'minimal' | 'professionnel' | 'créatif' | 'élégant';

// Props interface
interface TemplateRendererProps {
  template: TemplateType;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ template }) => {
  const { cvData } = useCV();

  // For now, we'll return a placeholder. You can implement different templates later
  return (
    <div className="p-4">
      <h2>Template: {template}</h2>
      <pre>{JSON.stringify(cvData, null, 2)}</pre>
    </div>
  );
};

export default TemplateRenderer;
