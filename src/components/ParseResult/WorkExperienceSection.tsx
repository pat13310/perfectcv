import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { BriefcaseIcon } from '@heroicons/react/24/solid';
import { CSSTransition } from 'react-transition-group';

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

const WorkExperienceItem: React.FC<WorkExperience> = ({ position, company, dates, responsibilities }) => {
    const { t } = useTranslation();

    return (
        <li className="bg-white rounded-lg p-3 shadow-sm">
            <div className="font-semibold text-base text-gray-900">
                {position && <span>{position}</span>}
                {company && <span> {t('form.workExperience.at')} {company}</span>}
            </div>
            <div className="text-gray-700 text-sm">
                {dates && <span>{dates}</span>}
            </div>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-800">
                {responsibilities?.map((resp, i) => (
                    <li key={i} className="text-gray-800">{resp}</li>
                ))}
            </ul>
        </li>
    );
};

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
                    <h2 className="text-xl font-bold text-gray-800">{t('form.workExperience.title')}</h2>
                </div>
                {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
            </div>
            <CSSTransition
                in={isExpanded}
                timeout={500}
                classNames="work-experience"
                unmountOnExit
            >
                <ul className="space-y-3">
                    {data.map((item, index) => (
                        <WorkExperienceItem key={index} {...item} />
                    ))}
                </ul>
            </CSSTransition>
            <style>
                {`
                .work-experience-enter {
                    opacity: 0;
                    transform: translateY(-10px);
                    max-height: 0;
                }
                .work-experience-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 2000px;
                    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out, max-height 500ms ease-in-out;
                }
                .work-experience-exit {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 2000px;
                }
                .work-experience-exit-active {
                    opacity: 0;
                    transform: translateY(-10px);
                    max-height: 0;
                    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out, max-height 500ms ease-in-out;
                }
                `}
            </style>
        </div>
    );
};

export default WorkExperienceSection;
