import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';
import GradientButton from '../Buttons/GradientButton';

const PersonalInfo: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].form.personalInfo;
  const v = translations[language].form.validation;

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(v.required),
      lastName: Yup.string().required(v.required),
      email: Yup.string().email(v.invalidEmail).required(v.required),
      phone: Yup.string().required(v.required),
      address: Yup.string(),
      summary: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-2xl font-medium text-gray-800/90 mb-6">{t.title}</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {t.firstName}
            </label>
            <input
              type="text"
              id="firstName"
              {...formik.getFieldProps('firstName')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.firstName && formik.errors.firstName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              {t.lastName}
            </label>
            <input
              type="text"
              id="lastName"
              {...formik.getFieldProps('lastName')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.lastName && formik.errors.lastName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.lastName}</p>
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
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            {t.address}
          </label>
          <textarea
            id="address"
            {...formik.getFieldProps('address')}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            {t.summary}
          </label>
          <textarea
            id="summary"
            {...formik.getFieldProps('summary')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>

          {/* <button
            type="submit"
            className="w-full opacity-80 md:w-auto px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:opacity-100 transition-opacity duration-300"
          >
            {t.save}
          </button> */}
          <GradientButton type="submit">
          {t.save}
          </GradientButton>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
