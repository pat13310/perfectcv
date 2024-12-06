import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { CSSTransition } from 'react-transition-group';

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
            <CSSTransition
                in={isExpanded}
                timeout={500}
                classNames="personal-info"
                unmountOnExit
            >
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mt-4">
                    {Object.entries(data).map(([key, value]) => {
                        if (!value || (Array.isArray(value) && value.length === 0)) return null;
                        return (
                            <div key={key} className="bg-white text-sm flex items-center justify-start p-2 ">
                                <div className="font-medium text-gray-800 capitalize">
                                    {t(`form.personalInfo.${key}`)}
                                </div>
                                <div className="ml-2 font-normal text-gray-00">
                                    {Array.isArray(value) ? value.join(', ') : value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CSSTransition>
            <style>
                {`
                .personal-info-enter {
                    opacity: 0;
                    transform: translateY(-10px);
                    max-height: 0;
                }
                .personal-info-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 2000px;
                    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out, max-height 500ms ease-in-out;
                }
                .personal-info-exit {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 2000px;
                }
                .personal-info-exit-active {
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

export default PersonalInfoSection;
