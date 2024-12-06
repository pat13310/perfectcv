import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { AcademicCapIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { CSSTransition } from 'react-transition-group';

interface Education {
    degree?: string;
    school?: string;
    location?: string;
    dates?: string;
    description?: string;
    startDate?: string; // Format YYYY-MM ou YYYY
    endDate?: string;   // Format YYYY-MM ou YYYY
}

interface EducationSectionProps {
    data: Education[];
    isExpanded: boolean;
    onToggle: () => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ data, isExpanded, onToggle }) => {
    const { t } = useTranslation();
    const nodeRef = useRef(null);

    const sortedEducation = useMemo(() => {
        return [...data].sort((a, b) => {
            if (!a.startDate || !b.startDate) return 0;
            return b.startDate.localeCompare(a.startDate);
        });
    }, [data]);

    return (
        <div className="mb-6">
            <div
                className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                        <AcademicCapIcon className="h-6 w-6 text-purple-700/85" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-700">{t('form.education.title')}</h2>
                </div>
                {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
            </div>
            <CSSTransition
                in={isExpanded}
                timeout={200}
                classNames="education"
                unmountOnExit
                nodeRef={nodeRef}
            >
                <div ref={nodeRef} className="px-4 pb-4">
                    <ul className="space-y-3">
                        {sortedEducation.map((item, index) => (
                            <li key={index} className="bg-white p-2">
                                <div className="font-medium text-base text-gray-800/90">
                                    {item.degree && <span>{item.degree}</span>}
                                    {item.school && <span> {t('form.education.at')} {item.school}</span>}
                                </div>
                                <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
                                    {item.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon className="h-4 w-4 text-purple-700/85" />
                                            <span className="font-medium text-gray-800/90">{item.location}</span>
                                        </div>
                                    )}
                                    {item.dates && <span className="text-medium text-gray-700/85">{item.dates}</span>}
                                </div>
                                {item.description && (
                                    <div className="text-gray-800/90 text-sm mt-2">
                                        {item.description}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </CSSTransition>
            <style>
                {`
                .education-enter {
                    opacity: 0;
                    transform: translateY(-10px);
                    max-height: 0;
                }
                .education-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 2000px;
                    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out, max-height 500ms ease-in-out;
                }
                .education-exit {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 2000px;
                }
                .education-exit-active {
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

export default EducationSection;
