import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { BriefcaseIcon } from '@heroicons/react/24/solid';

interface WorkExperience {
    position?: string;
    company?: string;
    dates?: string;
    responsibilities?: string[];
}

interface WorkExperienceSectionProps {
    data: WorkExperience[];
    isExpanded: boolean;
    onToggle: () => void;
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ data, isExpanded, onToggle }) => {
    const { t } = useTranslation();

    return (
        <div className="mb-6">
            <div
                className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-medium text-gray-700">{t('form.workExperience.title')}</h2>
                </div>
                {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
            </div>
            {isExpanded && (
                <ul className="space-y-3">
                    {data.map((item, index) => (
                        <li key={index} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="font-medium text-base text-gray-900">
                                {item.position && <span>{item.position}</span>}
                                {item.company && <span> {t('form.workExperience.at')} {item.company}</span>}
                            </div>
                            <div className="text-gray-600 text-sm">
                                {item.dates && <span>{item.dates}</span>}
                            </div>
                            <ul className="list-disc list-inside mt-2 text-sm">
                                {item.responsibilities?.map((resp, i) => (
                                    <li key={i} className="text-gray-700">{resp}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WorkExperienceSection;
