import React from 'react';
import { CVData } from '../../context/CVContext';

interface MinimalTemplateProps {
  data: CVData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 print:p-6">
      {/* Header / Personal Info */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="text-gray-600 space-y-1">
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
        </div>
        {data.personalInfo.summary && (
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">{data.personalInfo.summary}</p>
        )}
      </header>

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-light text-gray-800 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">
            Work Experience
          </h2>
          <div className="space-y-6">
            {data.workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-medium text-gray-800">{exp.position}</h3>
                  <span className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-600">{exp.company}</p>
                <p className="mt-2 text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-light text-gray-800 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-medium text-gray-800">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <p className="text-gray-600">{edu.school}</p>
                {edu.description && <p className="mt-1 text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-light text-gray-800 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">
            Skills
          </h2>
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
                <h3 className="text-gray-700 font-medium mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="text-gray-600">
                      {skill.name}
                      {index < skills.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-light text-gray-800 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">
            Projects
          </h2>
          <div className="space-y-6">
            {data.projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
                  <span className="text-gray-500 text-sm">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{project.description}</p>
                <div className="mt-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="text-gray-600">
                      {tech}
                      {techIndex < project.technologies.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-gray-600 hover:text-gray-800 inline-block text-sm"
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-light text-gray-800 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">
            Certifications
          </h2>
          <div className="space-y-4">
            {data.certifications.map((cert, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-800">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer}</p>
                <p className="text-gray-500 text-sm">
                  {cert.date}
                  {cert.expiryDate && ` - ${cert.expiryDate}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <section>
          <h2 className="text-xl font-light text-gray-800 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">
            References
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.references.map((ref, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-800">{ref.name}</h3>
                <p className="text-gray-600">{ref.position}</p>
                <p className="text-gray-600">{ref.company}</p>
                <p className="text-gray-500 text-sm mt-1">{ref.relationship}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>{ref.email}</p>
                  <p>{ref.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
