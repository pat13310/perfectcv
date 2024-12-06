import React, { useRef } from 'react';
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
    const nodeRef = useRef(null);

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div
                className="p-4 cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                        <UserCircleIcon className="h-6 w-6 text-purple-700/85" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-700">{t('form.personalInfo.title')}</h2>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex-grow" />
                    {isExpanded ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                    )}
                </div>
            </div>

            <CSSTransition
                in={isExpanded}
                timeout={200}
                classNames="personal-info"
                unmountOnExit
                nodeRef={nodeRef}
            >
                <div ref={nodeRef} className="px-4 pb-4">
                    <div className="space-y-2">
                        {data.name && (
                            <div className="text-gray-800/90">
                                <span className="font-medium">{t('form.personalInfo.name')}: </span>
                                {data.name}
                            </div>
                        )}
                        {data.email && (
                            <div className="text-gray-800/90">
                                <span className="font-medium">{t('form.personalInfo.email')}: </span>
                                {data.email}
                            </div>
                        )}
                        {data.phone && (
                            <div className="text-gray-800/90">
                                <span className="font-medium">{t('form.personalInfo.phone')}: </span>
                                {data.phone}
                            </div>
                        )}
                        {data.location && (
                            <div className="text-gray-800/90">
                                <span className="font-medium">{t('form.personalInfo.location')}: </span>
                                {data.location}
                            </div>
                        )}
                    </div>
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
                    transition: opacity 200ms ease-in-out, transform 200ms ease-in-out, max-height 200ms ease-in-out;
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
                    transition: opacity 200ms ease-in-out, transform 200ms ease-in-out, max-height 200ms ease-in-out;
                }
                `}
            </style>
        </div>
    );
};

export default PersonalInfoSection;
