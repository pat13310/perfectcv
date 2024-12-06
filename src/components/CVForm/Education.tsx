import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';
import GradientButton from '../Buttons/GradientButton';

interface EducationType {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

const Education: React.FC = () => {
  const [educations, setEducations] = useState<EducationType[]>([]);
  const { language } = useLanguage();
  const t = translations[language].form.education;
  const v = translations[language].form.validation;

  const educationSchema = Yup.object().shape({
    school: Yup.string().required(v.required),
    degree: Yup.string().required(v.required),
    field: Yup.string().required(v.required),
    startDate: Yup.string().required(v.required),
    current: Yup.boolean(),
    endDate: Yup.string().when('current', {
      is: false,
      then: (schema) => schema.required(v.required),
      otherwise: (schema) => schema.notRequired(),
    }),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
    validationSchema: educationSchema,
    onSubmit: (values, { resetForm }) => {
      setEducations([...educations, values]);
      resetForm();
    },
  });

  const handleDelete = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-2xl font-medium text-gray-800/90 mb-6">{t.title}</h2>
      
      {/* Existing education list */}
      {educations.length > 0 && (
        <div className="mb-6 space-y-4">
          {educations.map((edu, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md relative">
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-semibold text-lg">{edu.degree} in {edu.field}</h3>
              <p className="text-gray-600">{edu.school}</p>
              <p className="text-sm text-gray-500">
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </p>
              {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add new education form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
              {t.school}
            </label>
            <input
              type="text"
              id="school"
              {...formik.getFieldProps('school')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.school && formik.errors.school
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.school && formik.errors.school && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.school}</p>
            )}
          </div>

          <div>
            <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
              {t.degree}
            </label>
            <input
              type="text"
              id="degree"
              {...formik.getFieldProps('degree')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.degree && formik.errors.degree
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.degree && formik.errors.degree && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.degree}</p>
            )}
          </div>

          <div>
            <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
              {t.field}
            </label>
            <input
              type="text"
              id="field"
              {...formik.getFieldProps('field')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.field && formik.errors.field
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.field && formik.errors.field && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.field}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                disabled={formik.values.current}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.endDate && formik.errors.endDate
                    ? 'border-red-500'
                    : 'border-gray-300'
                } ${formik.values.current ? 'bg-gray-100' : ''}`}
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.endDate}</p>
              )}
            </div>
          </div>
        </div>

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

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {t.description}
          </label>
          <textarea
            id="description"
            {...formik.getFieldProps('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

export default Education;
