import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';
import GradientButton from '../Buttons/GradientButton';

interface Reference {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

const References: React.FC = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [showForm, setShowForm] = useState(true);
  const { language } = useLanguage();
  const t = translations[language].form.references;
  const v = translations[language].form.validation;

  const validationSchema = Yup.object({
    name: Yup.string().required(v.required),
    position: Yup.string().required(v.required),
    company: Yup.string().required(v.required),
    email: Yup.string().email(v.invalidEmail).required(v.required),
    phone: Yup.string().required(v.required),
    relationship: Yup.string().required(v.required),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setReferences([...references, values]);
      resetForm();
    },
  });

  const handleDelete = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-800/90 mb-6">{t.title}</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="text-blue-600 hover:text-blue-800"
        >
          {showForm ? t.hideForm : t.addReference}
        </button>
      </div>

      {/* Existing references list */}
      {references.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {references.map((ref, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md relative">
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-semibold text-lg">{ref.name}</h3>
              <p className="text-gray-600">{ref.position}</p>
              <p className="text-gray-600">{ref.company}</p>
              <p className="text-gray-500 text-sm mt-2">
                <span className="font-medium">{t.relationshipLabel}:</span> {ref.relationship}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="text-gray-500">{t.emailLabel}:</span>{' '}
                  <a href={`mailto:${ref.email}`} className="text-blue-600 hover:text-blue-800">
                    {ref.email}
                  </a>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">{t.phoneLabel}:</span>{' '}
                  <a href={`tel:${ref.phone}`} className="text-blue-600 hover:text-blue-800">
                    {ref.phone}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new reference form */}
      {showForm && (
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
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                {t.relationship}
              </label>
              <input
                type="text"
                id="relationship"
                {...formik.getFieldProps('relationship')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.relationship && formik.errors.relationship
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder={t.relationshipPlaceholder}
              />
              {formik.touched.relationship && formik.errors.relationship && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.relationship}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
              </label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps('email')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t.phone}
              </label>
              <input
                type="tel"
                id="phone"
                {...formik.getFieldProps('phone')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.phone && formik.errors.phone
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.phone}</p>
              )}
            </div>
          </div>

          <div>
          <GradientButton type="submit"  >
            {t.add}
          </GradientButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default References;
