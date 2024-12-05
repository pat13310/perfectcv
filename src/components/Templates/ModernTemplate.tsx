import React from 'react';
import { CVData } from '../../context/CVContext';

interface ModernTemplateProps {
  data: CVData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 print:p-6">
      {/* Header / Personal Info */}
      <header className="border-b-4 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.address && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{data.personalInfo.address}</span>
            </div>
          )}
        </div>
        {data.personalInfo.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        )}
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Work Experience */}
          {data.workExperience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Work Experience</h2>
              <div className="space-y-6">
                {data.workExperience.map((exp, index) => (
                  <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-blue-600 before:rounded-full">
                    <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                    <p className="text-gray-500 text-sm">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    <p className="mt-2 text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects</h2>
              <div className="space-y-6">
                {data.projects.map((project, index) => (
                  <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-blue-600 before:rounded-full">
                    <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {project.startDate} - {project.endDate}
                    </p>
                    <p className="mt-2 text-gray-700">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-blue-600 hover:text-blue-800 inline-block text-sm"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
              <div className="space-y-4">
                {Object.entries(
                  data.skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) {
                      acc[skill.category] = [];
                    }
                    acc[skill.category].push(skill);
                    return acc;
                  }, {} as Record<string, typeof data.skills>)
                ).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-gray-600">{edu.school}</p>
                    <p className="text-gray-500 text-sm">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="mt-1 text-gray-700 text-sm">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Certifications</h2>
              <div className="space-y-4">
                {data.certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-800">{cert.name}</h3>
                    <p className="text-gray-600">{cert.issuer}</p>
                    <p className="text-gray-500 text-sm">
                      Issued: {cert.date}
                      {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* References */}
      {data.references.length > 0 && (
        <section className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">References</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.references.map((ref, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">{ref.name}</h3>
                <p className="text-gray-600">{ref.position}</p>
                <p className="text-gray-600">{ref.company}</p>
                <p className="text-gray-500 text-sm mt-1">
                  <span className="font-medium">Relationship:</span> {ref.relationship}
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {ref.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {ref.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;
