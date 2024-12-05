import React from 'react';

interface TemplateCardProps {
  title: string;
  description: string;
  image: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const DefaultTemplateImage = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 group-hover:from-indigo-100/90 group-hover:to-purple-100/90 transition-all duration-700">
    <div className="flex flex-col items-center transform group-hover:scale-102 transition-all duration-500">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 blur-xl transform -rotate-12 group-hover:rotate-12 transition-transform duration-700" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 blur-xl transform rotate-12 group-hover:-rotate-12 transition-transform duration-700" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Document Icon with animated lines */}
        <div className="relative mb-4">
          <svg
            className="w-20 h-20 text-indigo-400/90 group-hover:text-indigo-500/90 transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              className="animate-draw-lines"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          
          {/* Animated dots */}
          <div className="absolute -top-1 -right-1 flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-purple-300 animate-pulse delay-150" />
            <div className="w-2 h-2 rounded-full bg-pink-300 animate-pulse delay-300" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-1.5">
          <span className="block text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
            Aperçu du template
          </span>
          <div className="flex items-center space-x-2 text-xs text-indigo-400/80">
            <span className="inline-block w-4 h-0.5 bg-current rounded animate-loading" />
            <span>Chargement</span>
            <span className="inline-block w-4 h-0.5 bg-current rounded animate-loading-reverse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  description,
  image,
  isSelected = false,
  onClick
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative cursor-pointer
        rounded-xl overflow-hidden
        transition-all duration-500 ease-out
        bg-white
        ${isSelected 
          ? 'ring-2 ring-indigo-500/80 shadow-lg shadow-indigo-100 scale-[1.02]' 
          : 'hover:shadow-lg hover:shadow-indigo-50 hover:scale-[1.02] hover:border-indigo-200/50'
        }
        p-3
        flex flex-col items-center
        border border-gray-100
        w-[240px] mx-3 my-3
        group
      `}
    >
      <div className="w-full h-40 relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 group-hover:to-black/10 transition-all duration-500 z-10" />
        {(imageError || isLoading) && <DefaultTemplateImage />}
        <img 
          src={image}
          alt={title}
          className={`
            w-full h-full object-cover transform 
            group-hover:scale-105 transition-all duration-700
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          onError={() => setImageError(true)}
          onLoad={handleImageLoad}
        />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate w-full text-center group-hover:text-indigo-600 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 text-center line-clamp-2 h-10 px-2 leading-5">
        {description}
      </p>

      {isSelected && (
        <div className="absolute top-3 right-3 animate-fade-in">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-indigo-100/50">
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// Add these animations to your global CSS or Tailwind config
const style = document.createElement('style');
style.textContent = `
  @keyframes draw-lines {
    0% { stroke-dasharray: 0 100; opacity: 0; }
    50% { opacity: 1; }
    100% { stroke-dasharray: 100 100; opacity: 1; }
  }
  @keyframes loading {
    0% { transform: scaleX(0.1); }
    50% { transform: scaleX(1); }
    100% { transform: scaleX(0.1); }
  }
  .animate-draw-lines {
    animation: draw-lines 2s ease-out forwards;
  }
  .animate-loading {
    animation: loading 1.5s ease-in-out infinite;
    transform-origin: left;
  }
  .animate-loading-reverse {
    animation: loading 1.5s ease-in-out infinite;
    transform-origin: right;
  }
`;
document.head.appendChild(style);

export default TemplateCard;
