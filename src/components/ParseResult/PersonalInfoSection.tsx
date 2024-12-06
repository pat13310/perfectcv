import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface PersonalInfo {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
}

interface PersonalInfoSectionProps {
    data: PersonalInfo;
    isExpanded: boolean;
    onToggle: () => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ data, isExpanded, onToggle }) => {
    const { t } = useTranslation();

    return (
        <div className="mb-6">
            <div
                className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-medium text-gray-700">{t('form.personalInfo.title')}</h2>
                </div>
                {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
            </div>
            {isExpanded && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="grid gap-3">
                        <div className="flex items-start">
                            <span className="text-blue-600 font-medium w-28 text-sm">{t('form.personalInfo.name')}:</span>
                            <span className="text-gray-700 text-sm">{data.name}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-blue-600 font-medium w-28 text-sm">{t('form.personalInfo.email')}:</span>
                            <span className="text-gray-700 text-sm">{data.email}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-blue-600 font-medium w-28 text-sm">{t('form.personalInfo.phone')}:</span>
                            <span className="text-gray-700 text-sm">{data.phone}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-blue-600 font-medium w-28 text-sm">{t('form.personalInfo.location')}:</span>
                            <span className="text-gray-700 text-sm">{data.location}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoSection;
