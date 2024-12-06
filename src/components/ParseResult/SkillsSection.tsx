import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { WrenchScrewdriverIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { CSSTransition } from 'react-transition-group';

interface Skill {
    name?: string;
    category?: string;
    level?: string;
}

interface SkillsSectionProps {
    skills: Skill[];
    isExpanded: boolean;
    onToggle: () => void;
    category: 'technical' | 'soft';
}

const SkillItem: React.FC<Skill> = ({ name }) => (
    <div className="flex flex-col">
        <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
            {name}
        </span>
    </div>
);

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills = [], isExpanded, onToggle, category }) => {
    const { t } = useTranslation();

    useEffect(() => {
        console.log(`SkillsSection - Received skills for ${category}:`, skills);
    }, [skills, category]);

    const filteredSkills = useMemo(() => {
        if (!Array.isArray(skills)) return [];

        return skills.filter(skill => {
            if (!skill?.category) {
                return category === 'technical';
            }

            const skillCategory = skill.category.toLowerCase();
            return category === 'technical'
                ? skillCategory === 'technical' || skillCategory === 'technique'
                : skillCategory === 'soft' || skillCategory === 'comportementale';
        });
    }, [skills, category]);

    useEffect(() => {
        console.log(`SkillsSection - Filtered ${category} skills:`, filteredSkills);
    }, [filteredSkills, category]);

   
    if (filteredSkills.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <div
                className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    {category === 'technical' ? (
                        <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
                    ) : (
                        <SparklesIcon className="h-6 w-6 text-blue-600" />
                    )}
                    <h2 className="text-xl font-medium text-gray-700">
                        {t(`form.skills.${category}`)}
                    </h2>
                </div>
                {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 transition-transform duration-300 ease-in-out" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500 transition-transform duration-300 ease-in-out" />
                )}
            </div>
            <CSSTransition
                in={isExpanded}
                timeout={500}
                classNames="skills"
                unmountOnExit
            >
                <div className="bg-white rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                        {filteredSkills.map((skill, index) => (
                            <SkillItem key={index} {...skill} />
                        ))}
                    </div>
                </div>
            </CSSTransition>
            <style>
                {`
                .skills-enter {
                    opacity: 0;
                    transform: translateY(-10px);
                    max-height: 0;
                }
                .skills-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 1000px;
                    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out, max-height 500ms ease-in-out;
                }
                .skills-exit {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 1000px;
                }
                .skills-exit-active {
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

export default SkillsSection;
