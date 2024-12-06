import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/solid';

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

    const sortedEducation = useMemo(() => {
        return [...data].sort((a, b) => {
            // Extraire l'année de fin ou de début
            const getYear = (item: Education) => {
                if (item.endDate) {
                    return parseInt(item.endDate.split('-')[0]);
                }
                if (item.startDate) {
                    return parseInt(item.startDate.split('-')[0]);
                }
                if (item.dates) {
                    // Essayer d'extraire l'année la plus récente des dates
                    const years = item.dates.match(/\d{4}/g);
                    if (years && years.length > 0) {
                        return Math.max(...years.map(y => parseInt(y)));
                    }
                }
                return 0;
            };

            const yearA = getYear(a);
            const yearB = getYear(b);

            if (yearA === yearB) {
                // Si même année, essayer de comparer les mois si disponibles
                const getMonth = (item: Education) => {
                    if (item.endDate && item.endDate.includes('-')) {
                        return parseInt(item.endDate.split('-')[1]);
                    }
                    if (item.startDate && item.startDate.includes('-')) {
                        return parseInt(item.startDate.split('-')[1]);
                    }
                    return 0;
                };

                return getMonth(b) - getMonth(a);
            }

            return yearB - yearA; // Tri décroissant
        });
    }, [data]);

    return (
        <div className="mb-6">
            <div
                className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-medium text-gray-700">{t('form.education.title')}</h2>
                </div>
                {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
            </div>
            {isExpanded && (
                <ul className="space-y-3">
                    {sortedEducation.map((item, index) => (
                        <li key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="font-medium text-base text-gray-900">
                                {item.degree && <span>{item.degree}</span>}
                                {item.school && <span> {t('form.education.at')} {item.school}</span>}
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
                                {item.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPinIcon className="h-4 w-4 text-gray-500" />
                                        <span>{item.location}</span>
                                    </div>
                                )}
                                {item.dates && <span>{item.dates}</span>}
                            </div>
                            {item.description && (
                                <div className="text-gray-700 text-sm mt-2">
                                    {item.description}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EducationSection;
