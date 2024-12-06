import React, { useState, useEffect } from 'react';
import { CVData } from '../context/CVContext';
import HeaderSection from '../components/ParseResult/HeaderSection';
import PersonalInfoSection from '../components/ParseResult/PersonalInfoSection';
import WorkExperienceSection from '../components/ParseResult/WorkExperienceSection';
import EducationSection from '../components/ParseResult/EducationSection';
import SkillsSection from '../components/ParseResult/SkillsSection';
import { FaEdit } from 'react-icons/fa';

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

    const renderButton = (label: string, onClick: () => void) => (
        <button
            onClick={onClick}
            className="ml-2 mb-2 p-2 border border-gray-300 rounded-full text-gray-300 bg-gray-50 hover:text-gray-700 hover:bg-gray-100 shadow-sm transform hover:scale-105 transition-transform duration-200"
        >
            <FaEdit className="" />
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-2  px-4 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8">
                <HeaderSection onEdit={handleEdit} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-1">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {data.personalInfo && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                <PersonalInfoSection
                                    data={data.personalInfo}
                                    isExpanded={expandedSections.personalInfo}
                                    onToggle={() => toggleSection('personalInfo')}
                                />
                                {renderButton('Edit Personal Info', handleEdit)}
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                            <WorkExperienceSection
                                data={data.workExperience ?? []}
                                isExpanded={expandedSections.workExperience}
                                onToggle={() => toggleSection('workExperience')}
                            />
                            {renderButton('Edit Work Experience', handleEdit)}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {data.education && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                <EducationSection
                                    data={data.education}
                                    isExpanded={expandedSections.education}
                                    onToggle={() => toggleSection('education')}
                                />
                                {renderButton('Edit Education', handleEdit)}
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
                                    {renderButton('Edit Technical Skills', handleEdit)}
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                    <SkillsSection
                                        skills={data.skills}
                                        isExpanded={expandedSections.softSkills}
                                        onToggle={() => toggleSection('softSkills')}
                                        category="soft"
                                    />
                                    {renderButton('Edit Soft Skills', handleEdit)}
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
