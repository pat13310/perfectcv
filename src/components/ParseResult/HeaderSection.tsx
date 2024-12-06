import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../Buttons/GradientButton';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';

interface HeaderSectionProps {
    onEdit: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ onEdit }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-normal text-gray-700/90">
                    {t('parseResult.title')}
                </h1>
                <div className="flex space-x-4">
                    <GradientButton onClick={() => navigate('/')} className="flex items-center">
                        <FaArrowLeft className="mr-2" /> {t('parseResult.backButton')}
                    </GradientButton>
                    <GradientButton onClick={onEdit} className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {t('parseResult.editButton')}<FaPlus className="ml-2" /> 
                    </GradientButton>
                </div>
            </div>
        </div>
    );
};

export default HeaderSection;
