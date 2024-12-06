import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';
import GradientButton from '../Buttons/GradientButton';

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
  startDate: string;
  endDate: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { language } = useLanguage();
  const t = translations[language].form.projects;
  const v = translations[language].form.validation;

  const validationSchema = Yup.object({
    name: Yup.string().required(v.required),
    description: Yup.string().required(v.required),
    technologies: Yup.string().required(v.required),
    startDate: Yup.string().required(v.required),
    endDate: Yup.string().required(v.required),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const projectData = {
        ...values,
        technologies: values.technologies.split(',').map(tech => tech.trim()),
      };
      setProjects([...projects, projectData]);
      resetForm();
    },
  });

  const handleDelete = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-medium text-gray-800/90 mb-6">{t.title}</h2>

      {/* Existing projects list */}
      {projects.length > 0 && (
        <div className="mb-6 space-y-4">
          {projects.map((project, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md relative">
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-sm text-gray-500">
                {project.startDate} - {project.endDate}
              </p>
              <p className="mt-2 text-gray-700">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
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
                  className="mt-2 text-blue-600 hover:text-blue-800 inline-block"
                >
                  {t.viewProject}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new project form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t.name}
            </label>
            <input
              type="text"
              id="name"
              {...formik.getFieldProps('name')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">
              {t.technologies}
            </label>
            <input
              type="text"
              id="technologies"
              {...formik.getFieldProps('technologies')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.technologies && formik.errors.technologies
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.technologies && formik.errors.technologies && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.technologies}</p>
            )}
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t.startDate}
            </label>
            <input
              type="month"
              id="startDate"
              {...formik.getFieldProps('startDate')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.startDate && formik.errors.startDate
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t.endDate}
            </label>
            <input
              type="month"
              id="endDate"
              {...formik.getFieldProps('endDate')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.endDate && formik.errors.endDate
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            {t.link}
          </label>
          <input
            type="url"
            id="link"
            {...formik.getFieldProps('link')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t.linkPlaceholder}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {t.description}
          </label>
          <textarea
            id="description"
            {...formik.getFieldProps('description')}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.description && formik.errors.description
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        <div>
          <GradientButton type="submit"  >
            {t.add}
          </GradientButton>
        </div>
      </form>
    </div>
  );
};

export default Projects;
