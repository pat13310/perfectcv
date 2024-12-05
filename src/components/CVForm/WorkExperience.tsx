import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';

interface WorkExperienceType {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

const WorkExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<WorkExperienceType[]>([]);
  const { language } = useLanguage();
  const t = translations[language].form.workExperience;
  const v = translations[language].form.validation;

  const validationSchema = Yup.object().shape({
    company: Yup.string().required(v.required),
    position: Yup.string().required(v.required),
    startDate: Yup.string().required(v.required),
    current: Yup.boolean(),
    endDate: Yup.string().when('current', {
      is: false,
      then: (schema) => schema.required(v.required),
      otherwise: (schema) => schema.notRequired(),
    }),
    description: Yup.string().required(v.required),
  });

  const formik = useFormik({
    initialValues: {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setExperiences([...experiences, values]);
      resetForm();
    },
  });

  const handleDelete = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.title}</h2>
      
      {/* Existing experiences list */}
      {experiences.length > 0 && (
        <div className="mb-6 space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md relative">
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-semibold text-lg">{exp.position}</h3>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.current ? t.current : exp.endDate}
              </p>
              <p className="mt-2 text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add new experience form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              {t.company}
            </label>
            <input
              type="text"
              id="company"
              {...formik.getFieldProps('company')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.company && formik.errors.company
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.company && formik.errors.company && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.company}</p>
            )}
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              {t.position}
            </label>
            <input
              type="text"
              id="position"
              {...formik.getFieldProps('position')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.position && formik.errors.position
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.position && formik.errors.position && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.position}</p>
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
            <div className="space-y-2">
              <input
                type="month"
                id="endDate"
                {...formik.getFieldProps('endDate')}
                disabled={formik.values.current}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.endDate && formik.errors.endDate
                    ? 'border-red-500'
                    : 'border-gray-300'
                } ${formik.values.current ? 'bg-gray-100' : ''}`}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  {...formik.getFieldProps('current')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                  {t.current}
                </label>
              </div>
            </div>
            {formik.touched.endDate && formik.errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.endDate}</p>
            )}
          </div>
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
            placeholder={t.descriptionPlaceholder}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full opacity-80 hover:opacity-100  bg-gradient-to-r from-indigo-600 to-purple-600 md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t.add}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkExperience;
