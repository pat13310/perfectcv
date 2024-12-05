import React from 'react';
import { useTranslation } from 'react-i18next';
import { CVData } from '../../context/CVContext';

interface ParseResultModalProps {
    open: boolean;
    onClose: () => void;
    data: Partial<CVData>;
}

const ParseResultModal: React.FC<ParseResultModalProps> = ({ open, onClose, data }) => {
    const { t } = useTranslation();

    const renderSection = (title: string, content: any) => {
        if (!content) return null;

        const renderContent = () => {
            if (Array.isArray(content)) {
                return (
                    <ul className="space-y-2">
                        {content.map((item, index) => (
                            <li key={index} className="border-b border-gray-200 pb-2">
                                <div className="font-medium">
                                    {item.title || item.degree || item.name || item}
                                </div>
                                {(item.company || item.institution || item.description) && (
                                    <div className="text-gray-600 text-sm">
                                        {item.company || item.institution || item.description}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                );
            } else if (typeof content === 'object') {
                return (
                    <div className="space-y-2">
                        {Object.entries(content).map(([key, value]) => (
                            <div key={key} className="flex">
                                <span className="font-medium w-24">{key}:</span>
                                <span className="text-gray-700">{value as string}</span>
                            </div>
                        ))}
                    </div>
                );
            } else {
                return <p className="text-gray-700">{String(content)}</p>;
            }
        };

        return (
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                {renderContent()}
            </div>
        );
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                        <div className="p-4 border-b border-gray-200">
                            <h1 className="text-2xl font-bold">{t('parser.results.title')}</h1>
                        </div>
                        
                        <div className="p-4">
                            {renderSection(t('parser.results.personalInfo'), data.personalInfo)}
                            {renderSection(t('parser.results.workExperience'), data.workExperience)}
                            {renderSection(t('parser.results.education'), data.education)}
                            {renderSection(t('parser.results.skills'), data.skills)}
                            {renderSection(t('parser.results.projects'), data.projects)}
                        </div>

                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                {t('common.continue')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ParseResultModal;
