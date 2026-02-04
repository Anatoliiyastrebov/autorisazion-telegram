import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Info } from 'lucide-react';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';

interface DSGVOCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const DSGVOCheckbox: React.FC<DSGVOCheckboxProps> = ({ checked, onChange }) => {
  const { t, language } = useLanguage();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const privacyPolicyLink = {
    ru: 'Политика конфиденциальности',
    en: 'Privacy Policy',
    de: 'Datenschutzerklärung',
  };

  const userRightsNotice = {
    ru: 'Вы имеете право на доступ, исправление, удаление и ограничение обработки ваших данных в соответствии с GDPR.',
    en: 'You have the right to access, correct, delete, and restrict processing of your data in accordance with GDPR.',
    de: 'Sie haben das Recht auf Zugang, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten gemäß DSGVO.',
  };

  const shortConsent = {
    ru: 'Согласен на обработку персональных данных согласно GDPR',
    en: 'I agree to the processing of personal data in accordance with GDPR',
    de: 'Ich stimme der Verarbeitung personenbezogener Daten gemäß DSGVO zu',
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 md:p-8 border border-medical-200 shadow-sm">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-6 h-6 rounded-lg border-2 border-medical-300 bg-white peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all duration-200 flex items-center justify-center">
            {checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-medical-700 leading-relaxed">
            {shortConsent[language]}
            {' '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPrivacyPolicy(true);
              }}
              className="text-primary-600 hover:underline font-medium"
            >
              {privacyPolicyLink[language]}
            </button>
          </p>
        </div>
      </label>
    </div>

      <PrivacyPolicyDialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy} />
    </>
  );
};
