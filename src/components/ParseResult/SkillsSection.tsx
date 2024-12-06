import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { WrenchScrewdriverIcon, SparklesIcon } from '@heroicons/react/24/solid';

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
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
            </div>
            {isExpanded && (
                <div className="bg-white rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                        {filteredSkills.map((skill, index) => (
                            <div key={index} className="flex flex-col">
                                <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                                    {skill.name}
                                </span>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillsSection;
