import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCV } from '../../context/CVContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';
import GradientButton from '../Buttons/GradientButton';

interface CustomSectionFormProps {
  sectionId: string;
  onClose: () => void;
}

const CustomSectionForm: React.FC<CustomSectionFormProps> = ({ sectionId, onClose }) => {
  const { addCustomSectionItem } = useCV();
  const { language } = useLanguage();
  const t = translations[language].form.customSection;
  const v = translations[language].form.validation;

  const CustomSectionSchema = Yup.object().shape({
    content: Yup.string().required(t.contentRequired),
    subtitle: Yup.string(),
    date: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      content: '',
      subtitle: '',
      date: '',
    },
    validationSchema: CustomSectionSchema,
    onSubmit: (values, { resetForm }) => {
      addCustomSectionItem(sectionId, {
        content: values.content,
        subtitle: values.subtitle,
        date: values.date,
      });
      resetForm();
      onClose();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          {t.content}
        </label>
        <textarea
          id="content"
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            formik.touched.content && formik.errors.content ? 'border-red-500' : ''
          }`}
          {...formik.getFieldProps('content')}
        />
        {formik.touched.content && formik.errors.content && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.content}</p>
        )}
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
          {t.subtitle}
        </label>
        <input
          type="text"
          id="subtitle"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          {...formik.getFieldProps('subtitle')}
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          {t.date}
        </label>
        <input
          type="text"
          id="date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          {...formik.getFieldProps('date')}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {t.cancel}
        </button>
        <GradientButton type="submit">
          {t.addItem}
        </GradientButton>
      </div>
    </form>
  );
};

const CustomSection: React.FC = () => {
  const { cvData, addCustomSection, removeCustomSection, removeCustomSectionItem } = useCV();
  const [showForm, setShowForm] = React.useState(false);
  const [activeSectionId, setActiveSectionId] = React.useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = React.useState('');
  const { language } = useLanguage();
  const t = translations[language].form.customSection;

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addCustomSection({
        title: newSectionTitle,
        items: [],
      });
      setNewSectionTitle('');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-2xl font-medium text-gray-800/90 mb-6">{t.title}</h2>

      {/* Add new section */}
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder={t.enterSectionTitle}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <GradientButton type="button" onClick={handleAddSection}>
          {t.addSection}
        </GradientButton>
      </div>

      {/* Custom sections list */}
      <div className="space-y-6">
        {cvData.customSections.map((section) => (
          <div key={section.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">{section.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setActiveSectionId(section.id);
                    setShowForm(true);
                  }}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {t.addItem}
                </button>
                <button
                  onClick={() => removeCustomSection(section.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  {t.deleteSection}
                </button>
              </div>
            </div>

            {/* Section items */}
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start bg-gray-50 p-3 rounded">
                  <div>
                    <p className="text-gray-800">{item.content}</p>
                    {item.subtitle && <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>}
                    {item.date && <p className="text-sm text-gray-500">{item.date}</p>}
                  </div>
                  <button
                    onClick={() => removeCustomSectionItem(section.id, item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Add item form */}
            {showForm && activeSectionId === section.id && (
              <div className="mt-4">
                <CustomSectionForm
                  sectionId={section.id}
                  onClose={() => {
                    setShowForm(false);
                    setActiveSectionId(null);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSection;
