import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Phone, ChevronDown } from 'lucide-react';
import { countryCodes, defaultCountryCode, type CountryCode } from '@/lib/country-codes';

interface ContactSectionProps {
  telegram: string;
  phone: string;
  phoneCountryCode?: string;
  telegramError?: string;
  phoneError?: string;
  contactMethodError?: string;
  onTelegramChange: (telegram: string) => void;
  onPhoneChange: (phone: string) => void;
  onCountryCodeChange: (countryCode: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  telegram,
  phone,
  phoneCountryCode = defaultCountryCode,
  telegramError,
  phoneError,
  contactMethodError,
  onTelegramChange,
  onPhoneChange,
  onCountryCodeChange,
}) => {
  const { language, t } = useLanguage();
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countryCodes.find(c => c.code === phoneCountryCode) || countryCodes.find(c => c.code === defaultCountryCode)!;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: CountryCode) => {
    onCountryCodeChange(country.code);
    setIsCountryDropdownOpen(false);
    
    // If phone already has a dial code, replace it with the new one
    if (phone.trim()) {
      const phoneWithoutCode = phone.replace(/^\+\d+\s*/, '').trim();
      onPhoneChange(phoneWithoutCode);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Remove any existing country code if user types manually
    const cleaned = value.replace(/^\+\d+\s*/, '');
    onPhoneChange(cleaned);
  };

  const getFullPhoneNumber = () => {
    if (!phone.trim()) return '';
    return `${selectedCountry.dialCode} ${phone.trim()}`;
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-6 md:p-8 border border-medical-200 shadow-sm space-y-6"
      data-section="contact"
    >
      <div className="flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-semibold text-medical-800">
          {t('contactMethod')}
          <span className="text-destructive ml-1">*</span>
        </h2>
      </div>

      {contactMethodError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-sm text-destructive">
            <AlertCircleIcon />
            {contactMethodError}
          </p>
        </div>
      )}

      <div data-question-id="telegram" data-error={!!telegramError}>
        <label className="text-sm text-medical-600 mb-1 block">
          {t('telegram')}
        </label>
        <input
          type="text"
          id="telegram"
          className={`input-field ${telegramError ? 'input-error' : ''}`}
          value={telegram}
          onChange={(e) => onTelegramChange(e.target.value)}
          placeholder={t('telegramHint') || '@username или username'}
        />
        {telegramError && (
          <p className="error-message mt-1">
            <AlertCircleIcon />
            {telegramError}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-medical-600 mb-1 block">
          {t('phone') || 'Телефон'}
        </label>
        <div className="flex gap-2">
          {/* Country Code Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-medical-300 bg-white rounded-lg hover:bg-medical-50 focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[100px] min-h-[44px]"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              <ChevronDown className="w-4 h-4 text-medical-400" />
            </button>
            
            {isCountryDropdownOpen && (
              <div className="absolute z-50 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-medical-300 rounded-lg shadow-lg">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-medical-50 text-left min-h-[44px] ${
                      country.code === phoneCountryCode ? 'bg-medical-100' : ''
                    }`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-sm">{country.name[language]}</span>
                    <span className="text-sm text-medical-600">{country.dialCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone Input */}
          <div className="flex-1" data-question-id="phone" data-error={!!phoneError}>
            <input
              type="tel"
              id="phone"
              className={`input-field ${phoneError ? 'input-error' : ''}`}
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={language === 'ru' ? '123 456 7890' : language === 'de' ? '123 456 7890' : '123 456 7890'}
            />
          </div>
        </div>
        {phone && phone.trim() && (
          <p className="text-xs text-medical-600 mt-1">
            {getFullPhoneNumber()}
          </p>
        )}
        {phoneError && (
          <p className="error-message mt-1">
            <AlertCircleIcon />
            {phoneError}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const AlertCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
