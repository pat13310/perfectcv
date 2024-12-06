import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface HeaderSectionProps {
    onEdit: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ onEdit }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-semibold text-gray-800">
                {t('parseResult.title')}
            </h1>
            <div className="space-x-4">
                <button
                    onClick={() => navigate('/')}
                    className="px-5 py-2 border border-indigo-300 rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors"
                >
                    {t('common.back')}
                </button>
                <button
                    onClick={onEdit}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    {t('common.edit')}
                </button>
            </div>
        </div>
    );
};

export default HeaderSection;
