import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CVData } from '../context/CVContext';
import { useNavigate } from 'react-router-dom';

interface ParseResultProps {
    data: Partial<CVData>;
}

const ParseResult: React.FC<ParseResultProps> = ({ data }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
        softSkills: false,
        technical: false
    });

    useEffect(() => {
        console.log('Skills data:', data.skills);
        if (Array.isArray(data.skills)) {
            console.log('Technical skills:', data.skills.filter(skill => skill?.category?.toLowerCase() === 'technical'));
            console.log('Soft skills:', data.skills.filter(skill => skill?.category?.toLowerCase() === 'soft'));
        }
    }, [data.skills]);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section === 'soft' ? 'softSkills' : section]: !prev[section === 'soft' ? 'softSkills' : section]
        }));
    };

    const renderSection = (sectionKey: keyof CVData, content: any) => {
        if (!content) return null;

        const title = t(`form.${sectionKey}.title`);

        const renderContent = () => {
            if (!expandedSections[sectionKey]) return null;
            if (sectionKey === 'personalInfo') {
                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="grid gap-4">
                            <div className="flex items-start">
                                <span className="text-blue-600 font-medium w-32">{t('form.personalInfo.name')}:</span>
                                <span className="text-gray-700">{(content as any).name}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-600 font-medium w-32">{t('form.personalInfo.email')}:</span>
                                <span className="text-gray-700">{(content as any).email}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-600 font-medium w-32">{t('form.personalInfo.phone')}:</span>
                                <span className="text-gray-700">{(content as any).phone}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-blue-600 font-medium w-32">{t('form.personalInfo.location')}:</span>
                                <span className="text-gray-700">{(content as any).location}</span>
                            </div>
                        </div>
                    </div>
                );
            } else if (Array.isArray(content)) {
                return (
                    <ul className="space-y-4">
                        {content.map((item: any, index: number) => (
                            <li key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                {sectionKey === 'workExperience' && (
                                    <>
                                        <div className="font-medium text-lg text-gray-900">
                                            {item.position && <span>{item.position}</span>}
                                            {item.company && <span> {t('form.workExperience.at')} {item.company}</span>}
                                        </div>
                                        <div className="text-gray-600">
                                            {item.dates && <span>{item.dates}</span>}
                                        </div>
                                        <ul className="list-disc list-inside mt-2">
                                            {item.responsibilities?.map((resp: string, i: number) => (
                                                <li key={i} className="text-gray-700">{resp}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {sectionKey === 'education' && (
                                    <>
                                        <div className="font-medium text-lg text-gray-900">
                                            {item.degree && <span>{item.degree}</span>}
                                            {item.school && <span> {t('form.education.at')} {item.school}</span>}
                                            {item.location && <span className="text-blue-700">, {item.location}</span>}
                                        </div>
                                        <div className="text-gray-600 mt-1">
                                            {item.dates && <span>{item.dates}</span>}
                                        </div>
                                        {item.description && (
                                            <div className="text-gray-700 mt-2">
                                                {item.description}
                                            </div>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                );
            }
            return null;
        };

        return (
            <div className="mb-8">
                <div
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleSection(sectionKey)}
                >
                    <h2 className="text-2xl font-medium text-gray-700">{title}</h2>
                    <span className="text-gray-500">
                        {expandedSections[sectionKey] ? '▼' : '▶'}
                    </span>
                </div>
                {renderContent()}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        {t('parseResult.title')}
                    </h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-5 py-2 border border-indigo-300 rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors"
                        >
                            {t('common.back')}
                        </button>
                        <button
                            onClick={() => {/* TODO: Implement edit functionality */}}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            {t('common.edit')}
                        </button>
                    </div>
                </div>

                <div className="space-y-10">
                    {data.personalInfo && renderSection('personalInfo', data.personalInfo)}
                    {renderSection('workExperience', data.workExperience ?? [{ company: '', position: '', dates: '', responsibilities: [] }])}
                    {data.education && renderSection('education', data.education)}

                    {/* Technical Skills Section */}
                    <div className="mb-6">
                        <div
                            className="flex items-center justify-between mb-4 cursor-pointer"
                            onClick={() => toggleSection('technical')}
                        >
                            <h2 className="text-2xl font-medium text-gray-700">{t('form.skills.technical')}</h2>
                            <span className="text-gray-500">
                                {expandedSections['technical'] ? '▼' : '▶'}
                            </span>
                        </div>
                        {expandedSections['technical'] && (
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex flex-wrap gap-3">
                                    {Array.isArray(data.skills) && data.skills
                                        .filter(skill => skill?.category === 'technical' || (!skill?.category && !skill?.name?.toLowerCase().includes('soft')))
                                        .map((skill, index) => (
                                            <div key={index} className="flex flex-col">
                                                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                                                    {skill.name}
                                                </span>
                                                {skill.level && (
                                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${skill.level.toLowerCase() === 'expert' ? '100' :
                                                                        skill.level.toLowerCase() === 'advanced' ? '75' :
                                                                        skill.level.toLowerCase() === 'intermediate' ? '50' :
                                                                        '25'}%`
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Soft Skills Section */}
                    <div className="mb-6">
                        <div
                            className="flex items-center justify-between mb-4 cursor-pointer"
                            onClick={() => toggleSection('softSkills')}
                        >
                            <h2 className="text-2xl font-medium text-gray-700">{t('form.skills.soft')}</h2>
                            <span className="text-gray-500">
                                {expandedSections['softSkills'] ? '▼' : '▶'}
                            </span>
                        </div>
                        {expandedSections['softSkills'] && (
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex flex-wrap gap-3">
                                    {Array.isArray(data.skills) && data.skills
                                        .filter(skill => skill?.category === 'soft' || skill?.name?.toLowerCase().includes('soft'))
                                        .map((skill, index) => (
                                            <div key={index} className="flex flex-col">
                                                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                                                    {skill.name}
                                                </span>
                                                {skill.level && (
                                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-green-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${skill.level.toLowerCase() === 'expert' ? '100' :
                                                                        skill.level.toLowerCase() === 'advanced' ? '75' :
                                                                        skill.level.toLowerCase() === 'intermediate' ? '50' :
                                                                        '25'}%`
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {data.languages && renderSection('languages', data.languages)}
                </div>
            </div>
        </div>
    );
};

export default ParseResult;
