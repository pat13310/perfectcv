import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';
import GradientButton from '../Buttons/GradientButton';

interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl: string;
}

const Certifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { language } = useLanguage();
  const t = translations[language].form.certifications;
  const v = translations[language].form.validation;

  const validationSchema = Yup.object({
    name: Yup.string().required(v.required),
    issuer: Yup.string().required(v.required),
    date: Yup.string().required(v.required),
    credentialId: Yup.string().required(v.required),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setCertifications([...certifications, values]);
      resetForm();
    },
  });

  const handleDelete = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-medium text-gray-800/90 mb-6">{t.title}</h2>

      {/* Existing certifications list */}
      {certifications.length > 0 && (
        <div className="mb-6 space-y-4">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md relative">
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-semibold text-lg">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              <p className="text-sm text-gray-500">
                {t.issued}: {cert.date}
                {cert.expiryDate && ` • ${t.expires}: ${cert.expiryDate}`}
              </p>
              <p className="text-sm text-gray-600 mt-1">{t.credentialIdLabel}: {cert.credentialId}</p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-600 hover:text-blue-800 inline-block"
                >
                  {t.verifyCredential}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new certification form */}
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
            <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-1">
              {t.issuer}
            </label>
            <input
              type="text"
              id="issuer"
              {...formik.getFieldProps('issuer')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.issuer && formik.errors.issuer
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.issuer && formik.errors.issuer && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.issuer}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              {t.date}
            </label>
            <input
              type="month"
              id="date"
              {...formik.getFieldProps('date')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.date && formik.errors.date
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t.expiryDate}
            </label>
            <input
              type="month"
              id="expiryDate"
              {...formik.getFieldProps('expiryDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 mb-1">
              {t.credentialId}
            </label>
            <input
              type="text"
              id="credentialId"
              {...formik.getFieldProps('credentialId')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.credentialId && formik.errors.credentialId
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.credentialId && formik.errors.credentialId && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.credentialId}</p>
            )}
          </div>

          <div>
            <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700 mb-1">
              {t.credentialUrl}
            </label>
            <input
              type="url"
              id="credentialUrl"
              {...formik.getFieldProps('credentialUrl')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t.urlPlaceholder}
            />
          </div>
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

export default Certifications;
