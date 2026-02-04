export interface CountryCode {
  code: string;
  dialCode: string;
  name: {
    ru: string;
    en: string;
    de: string;
  };
  flag: string;
}

export const countryCodes: CountryCode[] = [
  { code: 'RU', dialCode: '+7', name: { ru: 'Россия', en: 'Russia', de: 'Russland' }, flag: '🇷🇺' },
  { code: 'DE', dialCode: '+49', name: { ru: 'Германия', en: 'Germany', de: 'Deutschland' }, flag: '🇩🇪' },
  { code: 'UA', dialCode: '+380', name: { ru: 'Украина', en: 'Ukraine', de: 'Ukraine' }, flag: '🇺🇦' },
  { code: 'BY', dialCode: '+375', name: { ru: 'Беларусь', en: 'Belarus', de: 'Weißrussland' }, flag: '🇧🇾' },
  { code: 'KZ', dialCode: '+7', name: { ru: 'Казахстан', en: 'Kazakhstan', de: 'Kasachstan' }, flag: '🇰🇿' },
  { code: 'US', dialCode: '+1', name: { ru: 'США', en: 'United States', de: 'Vereinigte Staaten' }, flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: { ru: 'Великобритания', en: 'United Kingdom', de: 'Vereinigtes Königreich' }, flag: '🇬🇧' },
  { code: 'FR', dialCode: '+33', name: { ru: 'Франция', en: 'France', de: 'Frankreich' }, flag: '🇫🇷' },
  { code: 'IT', dialCode: '+39', name: { ru: 'Италия', en: 'Italy', de: 'Italien' }, flag: '🇮🇹' },
  { code: 'ES', dialCode: '+34', name: { ru: 'Испания', en: 'Spain', de: 'Spanien' }, flag: '🇪🇸' },
  { code: 'PL', dialCode: '+48', name: { ru: 'Польша', en: 'Poland', de: 'Polen' }, flag: '🇵🇱' },
  { code: 'CH', dialCode: '+41', name: { ru: 'Швейцария', en: 'Switzerland', de: 'Schweiz' }, flag: '🇨🇭' },
  { code: 'AT', dialCode: '+43', name: { ru: 'Австрия', en: 'Austria', de: 'Österreich' }, flag: '🇦🇹' },
  { code: 'NL', dialCode: '+31', name: { ru: 'Нидерланды', en: 'Netherlands', de: 'Niederlande' }, flag: '🇳🇱' },
  { code: 'BE', dialCode: '+32', name: { ru: 'Бельгия', en: 'Belgium', de: 'Belgien' }, flag: '🇧🇪' },
  { code: 'SE', dialCode: '+46', name: { ru: 'Швеция', en: 'Sweden', de: 'Schweden' }, flag: '🇸🇪' },
  { code: 'NO', dialCode: '+47', name: { ru: 'Норвегия', en: 'Norway', de: 'Norwegen' }, flag: '🇳🇴' },
  { code: 'DK', dialCode: '+45', name: { ru: 'Дания', en: 'Denmark', de: 'Dänemark' }, flag: '🇩🇰' },
  { code: 'FI', dialCode: '+358', name: { ru: 'Финляндия', en: 'Finland', de: 'Finnland' }, flag: '🇫🇮' },
  { code: 'CZ', dialCode: '+420', name: { ru: 'Чехия', en: 'Czech Republic', de: 'Tschechien' }, flag: '🇨🇿' },
  { code: 'GR', dialCode: '+30', name: { ru: 'Греция', en: 'Greece', de: 'Griechenland' }, flag: '🇬🇷' },
  { code: 'PT', dialCode: '+351', name: { ru: 'Португалия', en: 'Portugal', de: 'Portugal' }, flag: '🇵🇹' },
  { code: 'TR', dialCode: '+90', name: { ru: 'Турция', en: 'Turkey', de: 'Türkei' }, flag: '🇹🇷' },
  { code: 'IL', dialCode: '+972', name: { ru: 'Израиль', en: 'Israel', de: 'Israel' }, flag: '🇮🇱' },
  { code: 'AE', dialCode: '+971', name: { ru: 'ОАЭ', en: 'United Arab Emirates', de: 'Vereinigte Arabische Emirate' }, flag: '🇦🇪' },
  { code: 'CN', dialCode: '+86', name: { ru: 'Китай', en: 'China', de: 'China' }, flag: '🇨🇳' },
  { code: 'JP', dialCode: '+81', name: { ru: 'Япония', en: 'Japan', de: 'Japan' }, flag: '🇯🇵' },
  { code: 'KR', dialCode: '+82', name: { ru: 'Южная Корея', en: 'South Korea', de: 'Südkorea' }, flag: '🇰🇷' },
  { code: 'IN', dialCode: '+91', name: { ru: 'Индия', en: 'India', de: 'Indien' }, flag: '🇮🇳' },
  { code: 'BR', dialCode: '+55', name: { ru: 'Бразилия', en: 'Brazil', de: 'Brasilien' }, flag: '🇧🇷' },
  { code: 'MX', dialCode: '+52', name: { ru: 'Мексика', en: 'Mexico', de: 'Mexiko' }, flag: '🇲🇽' },
  { code: 'AR', dialCode: '+54', name: { ru: 'Аргентина', en: 'Argentina', de: 'Argentinien' }, flag: '🇦🇷' },
  { code: 'AU', dialCode: '+61', name: { ru: 'Австралия', en: 'Australia', de: 'Australien' }, flag: '🇦🇺' },
  { code: 'NZ', dialCode: '+64', name: { ru: 'Новая Зеландия', en: 'New Zealand', de: 'Neuseeland' }, flag: '🇳🇿' },
  { code: 'ZA', dialCode: '+27', name: { ru: 'ЮАР', en: 'South Africa', de: 'Südafrika' }, flag: '🇿🇦' },
  { code: 'EG', dialCode: '+20', name: { ru: 'Египет', en: 'Egypt', de: 'Ägypten' }, flag: '🇪🇬' },
];

export const getCountryByCode = (code: string): CountryCode | undefined => {
  return countryCodes.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): CountryCode | undefined => {
  return countryCodes.find(country => country.dialCode === dialCode);
};

export const defaultCountryCode = 'DE'; // Default to Germany
