import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../context/LanguageContext';

interface Skill {
  name: string;
  level: string;
  category: string;
}

const Skills: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].form.skills;
  const v = translations[language].form.validation;

  const skillLevelsTranslated = [
    t.levels.beginner,
    t.levels.intermediate,
    t.levels.advanced,
    t.levels.expert
  ];

  const defaultCategoriesTranslated = [
    t.defaultCategories.technical,
    t.defaultCategories.softSkills,
    t.defaultCategories.languages,
    t.defaultCategories.tools
  ];

  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const validationSchema = Yup.object({
    name: Yup.string().required(v.required),
    level: Yup.string().required(v.required),
    category: Yup.string().required(v.required),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      level: '',
      category: ''
    },
    validationSchema,
    onSubmit: (values) => {
      if (editingIndex !== null) {
        const updatedSkills = [...skills];
        updatedSkills[editingIndex] = values;
        setSkills(updatedSkills);
        setEditingIndex(null);
      } else {
        setSkills([...skills, values]);
      }
      formik.resetForm();
    },
  });

  const handleDelete = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-medium text-gray-800/90 mb-6">{t.title}</h2>

      {/* Display grouped skills */}
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <span className="text-gray-800">{skill.name}</span>
                <span className="text-sm text-gray-500">• {skill.level}</span>
                <button
                  onClick={() => handleDelete(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add new skill form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              {t.level}
            </label>
            <select
              id="level"
              {...formik.getFieldProps('level')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.level && formik.errors.level
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">{t.selectLevel}</option>
              {skillLevelsTranslated.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {formik.touched.level && formik.errors.level && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.level}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              {t.category}
            </label>
            <select
              id="category"
              {...formik.getFieldProps('category')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.category && formik.errors.category
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">{t.selectCategory}</option>
              {defaultCategoriesTranslated.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.category}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 opacity-80 hover:opacity-100 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-2xl  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t.addSkill}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Skills;
