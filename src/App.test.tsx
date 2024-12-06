import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Route: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Navigate: () => null,
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
}));

// Mock the context providers
jest.mock('./context/CVContext', () => ({
  CVProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useCV: () => ({
    cv: {},
    updateCV: jest.fn(),
    resetCV: jest.fn(),
  }),
}));

jest.mock('./context/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLanguage: () => ({
    language: 'en',
    setLanguage: jest.fn(),
  }),
}));

// Mock all form components
const MockFormComponent = ({ name }: { name: string }) => (
  <div data-testid={`mock-${name}`}>{name} Mock</div>
);

jest.mock('./components/CVForm/PersonalInfo', () => ({
  __esModule: true,
  default: () => <MockFormComponent name="personal-info" />,
}));

jest.mock('./components/CVForm/Education', () => ({
  __esModule: true,
  default: () => <MockFormComponent name="education" />,
}));

jest.mock('./components/CVForm/WorkExperience', () => ({
  __esModule: true,
  default: () => <MockFormComponent name="work-experience" />,
}));

jest.mock('./components/CVForm/Skills', () => ({
  __esModule: true,
  default: () => <MockFormComponent name="skills" />,
}));

jest.mock('./components/CVForm/Projects', () => ({
  __esModule: true,
  default: () => <MockFormComponent name="projects" />,
}));

jest.mock('./components/CVForm/Certifications', () => ({
  __esModule: true,
  default: () => <MockFormComponent name="certifications" />,
}));

jest.mock('./components/CVForm/References', () => ({
  __esModule: true,
  default: () => <MockFormComponent name="references" />,
}));

jest.mock('./components/CVForm/CustomSection', () => ({
  __esModule: true,
  default: () => <MockFormComponent name="custom-section" />,
}));

// Mock other components
jest.mock('./components/Layout/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="mock-header">Mock Header</header>,
}));

jest.mock('./components/Templates/TemplateSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-template-selector">Template Selector Mock</div>,
}));

jest.mock('./components/Home/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-home">Home Mock</div>,
}));

jest.mock('./components/Navigation/FormNavigation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-form-navigation">Form Navigation Mock</div>,
}));

jest.mock('./components/Preview/CVPreview', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-cv-preview">CV Preview Mock</div>,
}));

jest.mock('./components/Improve/ImproveCv', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-improve-cv">Improve CV Mock</div>,
}));

jest.mock('./pages/ParseResult', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-parse-result">Parse Result Mock</div>,
}));

// Mock the CVParser service
jest.mock('./services/CVParser');

describe('App Component', () => {
  test('renders app without crashing', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });
});
