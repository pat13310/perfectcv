import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CVProvider } from './context/CVContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './components/Home/Home';
import PersonalInfo from './components/CVForm/PersonalInfo';
import Education from './components/CVForm/Education';
import WorkExperience from './components/CVForm/WorkExperience';
import Skills from './components/CVForm/Skills';
import Projects from './components/CVForm/Projects';
import Certifications from './components/CVForm/Certifications';
import References from './components/CVForm/References';
import CVPreview from './components/Preview/CVPreview';
import Header from './components/Layout/Header';
import TemplateSelector from './components/Templates/TemplateSelector';
import CustomSection from './components/CVForm/CustomSection';
import FormNavigation from './components/Navigation/FormNavigation';
import { useCV } from './context/CVContext';
import ImproveCv from './components/Improve/ImproveCv';
import ParseResult from './pages/ParseResult';

const ParseResultPage = () => {
  const location = useLocation();
  const data = location.state?.data;
  return <ParseResult data={data} />;
};

function App() {

  return (
    <LanguageProvider>
      <Router>
        <CVProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto py-2 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/improve-cv" element={<ImproveCv />} />
                <Route path="/templates" element={<TemplateSelector />} />
                <Route path="/cv-form/personal-info" element={
                  <>
                    <PersonalInfo />
                    <FormNavigation />
                  </>
                } />
                <Route path="/cv-form/education" element={
                  <>
                    <Education />
                    <FormNavigation />
                  </>
                } />
                <Route path="/cv-form/work-experience" element={
                  <>
                    <WorkExperience />
                    <FormNavigation />
                  </>
                } />
                <Route path="/cv-form/skills" element={
                  <>
                    <Skills />
                    <FormNavigation />
                  </>
                } />
                <Route path="/cv-form/projects" element={
                  <>
                    <Projects />
                    <FormNavigation />
                  </>
                } />
                <Route path="/cv-form/certifications" element={
                  <>
                    <Certifications />
                    <FormNavigation />
                  </>
                } />
                <Route path="/cv-form/references" element={
                  <>
                    <References />
                    <FormNavigation />
                  </>
                } />
                <Route path="/cv-form/custom-section" element={
                  <>
                    <CustomSection />
                    <FormNavigation />
                  </>
                } />
                <Route path="/cv-form/preview" element={
                  <CVPreview />
                } />
                <Route path="/cv-form" element={
                  <Navigate to="/cv-form/personal-info" replace />
                } />
                <Route path="/parse-result" element={
                  <ParseResultPage />
                } />
              </Routes>
            </div>
          </div>
        </CVProvider>
      </Router>
    </LanguageProvider>
  );
}

function PreviewPage() {
  const { cvData } = useCV();

  return (
    <div className="relative min-h-screen pb-20">

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="container mx-auto px-4">
          <FormNavigation />
        </div>
      </div>
    </div>
  );
}

export default App;
