import React, { useState, useEffect } from 'react';
import { CVData } from '../context/CVContext';
import HeaderSection from '../components/ParseResult/HeaderSection';
import PersonalInfoSection from '../components/ParseResult/PersonalInfoSection';
import WorkExperienceSection from '../components/ParseResult/WorkExperienceSection';
import EducationSection from '../components/ParseResult/EducationSection';
import SkillsSection from '../components/ParseResult/SkillsSection';

interface ParseResultProps {
    data: Partial<CVData>;
}

const ParseResult: React.FC<ParseResultProps> = ({ data }) => {
    useEffect(() => {
        console.log('ParseResult - Full data:', data);
        if (data.skills) {
            console.log('ParseResult - Skills data:', data.skills);
            console.log('ParseResult - Is skills array?', Array.isArray(data.skills));
        }
    }, [data]);

    const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
        personalInfo: true,
        workExperience: true,
        education: true,
        technicalSkills: true,
        softSkills: true
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleEdit = () => {
        // TODO: Implement edit functionality
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <HeaderSection onEdit={handleEdit} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {data.personalInfo && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                <PersonalInfoSection
                                    data={data.personalInfo}
                                    isExpanded={expandedSections.personalInfo}
                                    onToggle={() => toggleSection('personalInfo')}
                                />
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                            <WorkExperienceSection
                                data={data.workExperience ?? []}
                                isExpanded={expandedSections.workExperience}
                                onToggle={() => toggleSection('workExperience')}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {data.education && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                <EducationSection
                                    data={data.education}
                                    isExpanded={expandedSections.education}
                                    onToggle={() => toggleSection('education')}
                                />
                            </div>
                        )}

                        {data.skills && (
                            <>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                    <SkillsSection
                                        skills={data.skills}
                                        isExpanded={expandedSections.technicalSkills}
                                        onToggle={() => toggleSection('technicalSkills')}
                                        category="technical"
                                    />
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                    <SkillsSection
                                        skills={data.skills}
                                        isExpanded={expandedSections.softSkills}
                                        onToggle={() => toggleSection('softSkills')}
                                        category="soft"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParseResult;
