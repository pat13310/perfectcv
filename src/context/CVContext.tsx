import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { TemplateType } from '../components/Templates/TemplateRenderer';

// Types for custom sections
export interface CustomSection {
  id: string;
  title: string;
  items: Array<{
    id: string;
    content: string;
    date?: string;
    subtitle?: string;
  }>;
}

export interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  workExperience: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    category: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId: string;
    link?: string;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
  customSections: CustomSection[];
  selectedTemplate: TemplateType;
}

interface CVContextType {
  cvData: CVData;
  updatePersonalInfo: (info: CVData['personalInfo']) => void;
  addWorkExperience: (exp: CVData['workExperience'][0]) => void;
  updateWorkExperience: (index: number, exp: CVData['workExperience'][0]) => void;
  removeWorkExperience: (index: number) => void;
  addEducation: (edu: CVData['education'][0]) => void;
  updateEducation: (index: number, edu: CVData['education'][0]) => void;
  removeEducation: (index: number) => void;
  addSkill: (skill: CVData['skills'][0]) => void;
  updateSkill: (index: number, skill: CVData['skills'][0]) => void;
  removeSkill: (index: number) => void;
  addProject: (project: CVData['projects'][0]) => void;
  updateProject: (index: number, project: CVData['projects'][0]) => void;
  removeProject: (index: number) => void;
  addCertification: (cert: CVData['certifications'][0]) => void;
  updateCertification: (index: number, cert: CVData['certifications'][0]) => void;
  removeCertification: (index: number) => void;
  addReference: (ref: CVData['references'][0]) => void;
  updateReference: (index: number, ref: CVData['references'][0]) => void;
  removeReference: (index: number) => void;
  addCustomSection: (section: Omit<CustomSection, 'id'>) => void;
  updateCustomSection: (id: string, section: Omit<CustomSection, 'id'>) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string, item: Omit<CustomSection['items'][0], 'id'>) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, item: Omit<CustomSection['items'][0], 'id'>) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  updateSelectedTemplate: (template: TemplateType) => void;
}

const initialState: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  references: [],
  customSections: [],
  selectedTemplate: 'moderne',
};

type CVAction =
  | { type: 'SET_CV_DATA'; payload: CVData }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: CVData['personalInfo'] }
  | { type: 'ADD_WORK_EXPERIENCE'; payload: CVData['workExperience'][0] }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: { index: number; exp: CVData['workExperience'][0] } }
  | { type: 'REMOVE_WORK_EXPERIENCE'; payload: number }
  | { type: 'ADD_EDUCATION'; payload: CVData['education'][0] }
  | { type: 'UPDATE_EDUCATION'; payload: { index: number; edu: CVData['education'][0] } }
  | { type: 'REMOVE_EDUCATION'; payload: number }
  | { type: 'ADD_SKILL'; payload: CVData['skills'][0] }
  | { type: 'UPDATE_SKILL'; payload: { index: number; skill: CVData['skills'][0] } }
  | { type: 'REMOVE_SKILL'; payload: number }
  | { type: 'ADD_PROJECT'; payload: CVData['projects'][0] }
  | { type: 'UPDATE_PROJECT'; payload: { index: number; project: CVData['projects'][0] } }
  | { type: 'REMOVE_PROJECT'; payload: number }
  | { type: 'ADD_CERTIFICATION'; payload: CVData['certifications'][0] }
  | { type: 'UPDATE_CERTIFICATION'; payload: { index: number; cert: CVData['certifications'][0] } }
  | { type: 'REMOVE_CERTIFICATION'; payload: number }
  | { type: 'ADD_REFERENCE'; payload: CVData['references'][0] }
  | { type: 'UPDATE_REFERENCE'; payload: { index: number; ref: CVData['references'][0] } }
  | { type: 'REMOVE_REFERENCE'; payload: number }
  | { type: 'ADD_CUSTOM_SECTION'; payload: CustomSection }
  | { type: 'UPDATE_CUSTOM_SECTION'; payload: { id: string; section: Omit<CustomSection, 'id'> } }
  | { type: 'REMOVE_CUSTOM_SECTION'; payload: string }
  | { type: 'ADD_CUSTOM_SECTION_ITEM'; payload: { sectionId: string; item: CustomSection['items'][0] } }
  | { type: 'UPDATE_CUSTOM_SECTION_ITEM'; payload: { sectionId: string; itemId: string; item: Omit<CustomSection['items'][0], 'id'> } }
  | { type: 'REMOVE_CUSTOM_SECTION_ITEM'; payload: { sectionId: string; itemId: string } }
  | { type: 'UPDATE_SELECTED_TEMPLATE'; payload: TemplateType };

function cvReducer(state: CVData, action: CVAction): CVData {
  switch (action.type) {
    case 'SET_CV_DATA':
      return action.payload;
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: action.payload };
    case 'ADD_WORK_EXPERIENCE':
      return { ...state, workExperience: [...state.workExperience, action.payload] };
    case 'UPDATE_WORK_EXPERIENCE':
      return {
        ...state,
        workExperience: state.workExperience.map((exp, i) =>
          i === action.payload.index ? action.payload.exp : exp
        ),
      };
    case 'REMOVE_WORK_EXPERIENCE':
      return {
        ...state,
        workExperience: state.workExperience.filter((_, i) => i !== action.payload),
      };
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map((edu, i) =>
          i === action.payload.index ? action.payload.edu : edu
        ),
      };
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: state.education.filter((_, i) => i !== action.payload),
      };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map((skill, i) =>
          i === action.payload.index ? action.payload.skill : skill
        ),
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter((_, i) => i !== action.payload),
      };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((project, i) =>
          i === action.payload.index ? action.payload.project : project
        ),
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((_, i) => i !== action.payload),
      };
    case 'ADD_CERTIFICATION':
      return { ...state, certifications: [...state.certifications, action.payload] };
    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.map((cert, i) =>
          i === action.payload.index ? action.payload.cert : cert
        ),
      };
    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.filter((_, i) => i !== action.payload),
      };
    case 'ADD_REFERENCE':
      return { ...state, references: [...state.references, action.payload] };
    case 'UPDATE_REFERENCE':
      return {
        ...state,
        references: state.references.map((ref, i) =>
          i === action.payload.index ? action.payload.ref : ref
        ),
      };
    case 'REMOVE_REFERENCE':
      return {
        ...state,
        references: state.references.filter((_, i) => i !== action.payload),
      };
    case 'ADD_CUSTOM_SECTION':
      return {
        ...state,
        customSections: [...state.customSections, action.payload],
      };
    case 'UPDATE_CUSTOM_SECTION':
      return {
        ...state,
        customSections: state.customSections.map((section) =>
          section.id === action.payload.id
            ? { ...section, ...action.payload.section }
            : section
        ),
      };
    case 'REMOVE_CUSTOM_SECTION':
      return {
        ...state,
        customSections: state.customSections.filter(
          (section) => section.id !== action.payload
        ),
      };
    case 'ADD_CUSTOM_SECTION_ITEM':
      return {
        ...state,
        customSections: state.customSections.map((section) =>
          section.id === action.payload.sectionId
            ? { ...section, items: [...section.items, action.payload.item] }
            : section
        ),
      };
    case 'UPDATE_CUSTOM_SECTION_ITEM':
      return {
        ...state,
        customSections: state.customSections.map((section) =>
          section.id === action.payload.sectionId
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.id === action.payload.itemId
                    ? { ...item, ...action.payload.item }
                    : item
                ),
              }
            : section
        ),
      };
    case 'REMOVE_CUSTOM_SECTION_ITEM':
      return {
        ...state,
        customSections: state.customSections.map((section) =>
          section.id === action.payload.sectionId
            ? {
                ...section,
                items: section.items.filter(
                  (item) => item.id !== action.payload.itemId
                ),
              }
            : section
        ),
      };
    case 'UPDATE_SELECTED_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    default:
      return state;
  }
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvData, dispatch] = useReducer(cvReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      dispatch({ type: 'SET_CV_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  const updatePersonalInfo = (info: CVData['personalInfo']) => {
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: info });
  };

  const addWorkExperience = (exp: CVData['workExperience'][0]) => {
    dispatch({ type: 'ADD_WORK_EXPERIENCE', payload: exp });
  };

  const updateWorkExperience = (index: number, exp: CVData['workExperience'][0]) => {
    dispatch({ type: 'UPDATE_WORK_EXPERIENCE', payload: { index, exp } });
  };

  const removeWorkExperience = (index: number) => {
    dispatch({ type: 'REMOVE_WORK_EXPERIENCE', payload: index });
  };

  const addEducation = (edu: CVData['education'][0]) => {
    dispatch({ type: 'ADD_EDUCATION', payload: edu });
  };

  const updateEducation = (index: number, edu: CVData['education'][0]) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: { index, edu } });
  };

  const removeEducation = (index: number) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: index });
  };

  const addSkill = (skill: CVData['skills'][0]) => {
    dispatch({ type: 'ADD_SKILL', payload: skill });
  };

  const updateSkill = (index: number, skill: CVData['skills'][0]) => {
    dispatch({ type: 'UPDATE_SKILL', payload: { index, skill } });
  };

  const removeSkill = (index: number) => {
    dispatch({ type: 'REMOVE_SKILL', payload: index });
  };

  const addProject = (project: CVData['projects'][0]) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };

  const updateProject = (index: number, project: CVData['projects'][0]) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { index, project } });
  };

  const removeProject = (index: number) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: index });
  };

  const addCertification = (cert: CVData['certifications'][0]) => {
    dispatch({ type: 'ADD_CERTIFICATION', payload: cert });
  };

  const updateCertification = (index: number, cert: CVData['certifications'][0]) => {
    dispatch({ type: 'UPDATE_CERTIFICATION', payload: { index, cert } });
  };

  const removeCertification = (index: number) => {
    dispatch({ type: 'REMOVE_CERTIFICATION', payload: index });
  };

  const addReference = (ref: CVData['references'][0]) => {
    dispatch({ type: 'ADD_REFERENCE', payload: ref });
  };

  const updateReference = (index: number, ref: CVData['references'][0]) => {
    dispatch({ type: 'UPDATE_REFERENCE', payload: { index, ref } });
  };

  const removeReference = (index: number) => {
    dispatch({ type: 'REMOVE_REFERENCE', payload: index });
  };

  const addCustomSection = (section: Omit<CustomSection, 'id'>) => {
    const newSection: CustomSection = {
      ...section,
      id: Math.random().toString(36).substr(2, 9),
    };
    dispatch({ type: 'ADD_CUSTOM_SECTION', payload: newSection });
  };

  const updateCustomSection = (id: string, section: Omit<CustomSection, 'id'>) => {
    dispatch({ type: 'UPDATE_CUSTOM_SECTION', payload: { id, section } });
  };

  const removeCustomSection = (id: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_SECTION', payload: id });
  };

  const addCustomSectionItem = (
    sectionId: string,
    item: Omit<CustomSection['items'][0], 'id'>
  ) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    dispatch({
      type: 'ADD_CUSTOM_SECTION_ITEM',
      payload: { sectionId, item: newItem },
    });
  };

  const updateCustomSectionItem = (
    sectionId: string,
    itemId: string,
    item: Omit<CustomSection['items'][0], 'id'>
  ) => {
    dispatch({
      type: 'UPDATE_CUSTOM_SECTION_ITEM',
      payload: { sectionId, itemId, item },
    });
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    dispatch({
      type: 'REMOVE_CUSTOM_SECTION_ITEM',
      payload: { sectionId, itemId },
    });
  };

  const updateSelectedTemplate = (template: TemplateType) => {
    dispatch({ type: 'UPDATE_SELECTED_TEMPLATE', payload: template });
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        updatePersonalInfo,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        addProject,
        updateProject,
        removeProject,
        addCertification,
        updateCertification,
        removeCertification,
        addReference,
        updateReference,
        removeReference,
        addCustomSection,
        updateCustomSection,
        removeCustomSection,
        addCustomSectionItem,
        updateCustomSectionItem,
        removeCustomSectionItem,
        updateSelectedTemplate,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
