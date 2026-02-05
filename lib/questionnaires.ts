// Типы для анкет
export type Language = 'ru' | 'en' | 'de'
export type QuestionType = 'text' | 'number' | 'radio' | 'checkbox' | 'textarea'

export interface QuestionOption {
  value: string
  label: {
    ru: string
    en: string
    de: string
  }
}

export interface Question {
  id: string
  type: QuestionType
  label: {
    ru: string
    en: string
    de: string
  }
  icon: string
  options?: QuestionOption[]
  required: boolean
  hasAdditional: boolean
  placeholder?: {
    ru: string
    en: string
    de: string
  }
  min?: number
  max?: number
}

export interface QuestionnaireSection {
  id: string
  title: {
    ru: string
    en: string
    de: string
  }
  icon: string
  questions: Question[]
}

// Common options used across questionnaires
const yesNoOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'yes', label: { ru: 'Да', en: 'Yes', de: 'Ja' } },
  { value: 'no', label: { ru: 'Нет', en: 'No', de: 'Nein' } },
]

const yesNoOptionsSimple: QuestionOption[] = [
  { value: 'yes', label: { ru: 'Да', en: 'Yes', de: 'Ja' } },
  { value: 'no', label: { ru: 'Нет', en: 'No', de: 'Nein' } },
]

const digestionOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'stomach_pain', label: { ru: 'Боли в животе', en: 'Stomach pain', de: 'Bauchschmerzen' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea', de: 'Durchfall' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation', de: 'Verstopfung' } },
]

const digestionOptionsExtended: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'stomach_pain', label: { ru: 'Боли в животе', en: 'Stomach pain', de: 'Bauchschmerzen' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea', de: 'Durchfall' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation', de: 'Verstopfung' } },
  { value: 'bloating', label: { ru: 'Вздутие', en: 'Bloating', de: 'Blähungen' } },
]

const allergyOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'pollen', label: { ru: 'Цветение', en: 'Pollen', de: 'Pollen' } },
  { value: 'animals', label: { ru: 'Животные', en: 'Animals', de: 'Tiere' } },
  { value: 'dust', label: { ru: 'Пыль', en: 'Dust', de: 'Staub' } },
  { value: 'food', label: { ru: 'Еда', en: 'Food', de: 'Lebensmittel' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const allergyOptionsExtended: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'pollen', label: { ru: 'Цветение', en: 'Pollen', de: 'Pollen' } },
  { value: 'animals', label: { ru: 'Животные', en: 'Animals', de: 'Tiere' } },
  { value: 'dust', label: { ru: 'Пыль', en: 'Dust', de: 'Staub' } },
  { value: 'food', label: { ru: 'Еда', en: 'Food', de: 'Lebensmittel' } },
  { value: 'medications', label: { ru: 'Лекарства', en: 'Medications', de: 'Medikamente' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const skinOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'moles', label: { ru: 'Много родинок', en: 'Many moles', de: 'Viele Muttermale' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts', de: 'Warzen' } },
  { value: 'rashes', label: { ru: 'Высыпания', en: 'Rashes', de: 'Ausschläge' } },
  { value: 'eczema', label: { ru: 'Экзема', en: 'Eczema', de: 'Ekzeme' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const sleepOptionsSimple: QuestionOption[] = [
  { value: 'good', label: { ru: 'Хорошо', en: 'Good', de: 'Gut' } },
  { value: 'bad', label: { ru: 'Плохо', en: 'Bad', de: 'Schlecht' } },
  { value: 'sometimes', label: { ru: 'Иногда проблемы', en: 'Sometimes problems', de: 'Manchmal Probleme' } },
]

const birthOptions: QuestionOption[] = [
  { value: 'natural', label: { ru: 'Естественно', en: 'Natural', de: 'Natürlich' } },
  { value: 'cesarean', label: { ru: 'Кесарево', en: 'Cesarean', de: 'Kaiserschnitt' } },
]

const injuriesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All is well', de: 'Alles in Ordnung' } },
  { value: 'injuries', label: { ru: 'Травмы', en: 'Injuries', de: 'Verletzungen' } },
  { value: 'surgeries', label: { ru: 'Операции', en: 'Surgeries', de: 'Operationen' } },
  { value: 'head_trauma', label: { ru: 'Удары по голове', en: 'Head trauma', de: 'Kopftrauma' } },
  { value: 'fractures', label: { ru: 'Переломы', en: 'Fractures', de: 'Brüche' } },
  { value: 'severe_falls', label: { ru: 'Сильные падения', en: 'Severe falls', de: 'Schwere Stürze' } },
]

const operationsTraumasOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет операций и травм', en: 'No operations or injuries', de: 'Keine Operationen oder Verletzungen' } },
  { value: 'surgeries', label: { ru: 'Операции', en: 'Surgeries', de: 'Operationen' } },
  { value: 'organ_removed', label: { ru: 'Удалены органы', en: 'Organs removed', de: 'Organe entfernt' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const illnessAntibioticsOptions: QuestionOption[] = [
  { value: 'rarely_ill', label: { ru: 'Редко болеет', en: 'Rarely ill', de: 'Selten krank' } },
  { value: 'often_ill', label: { ru: 'Часто болеет', en: 'Often ill', de: 'Oft krank' } },
  { value: 'took_antibiotics', label: { ru: 'Принимал антибиотики', en: 'Took antibiotics', de: 'Antibiotika genommen' } },
  { value: 'took_medications', label: { ru: 'Принимал лекарства', en: 'Took medications', de: 'Medikamente genommen' } },
  { value: 'both', label: { ru: 'И часто болеет, и принимал антибиотики', en: 'Both often ill and took antibiotics', de: 'Sowohl oft krank als auch Antibiotika genommen' } },
]

const headachesSleepOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'headaches', label: { ru: 'Головные боли', en: 'Headaches', de: 'Kopfschmerzen' } },
  { value: 'poor_sleep', label: { ru: 'Плохой сон', en: 'Poor sleep', de: 'Schlechter Schlaf' } },
  { value: 'both', label: { ru: 'И головные боли, и плохой сон', en: 'Both headaches and poor sleep', de: 'Sowohl Kopfschmerzen als auch schlechter Schlaf' } },
]

const hyperactiveOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'hyperactive', label: { ru: 'Гиперактивный', en: 'Hyperactive', de: 'Hyperaktiv' } },
  { value: 'tired_often', label: { ru: 'Часто устаёт', en: 'Often tired', de: 'Oft müde' } },
  { value: 'normal', label: { ru: 'Нормально', en: 'Normal', de: 'Normal' } },
]

const pressureOptions: QuestionOption[] = [
  { value: 'low', label: { ru: 'Низкое', en: 'Low', de: 'Niedrig' } },
  { value: 'high', label: { ru: 'Высокое', en: 'High', de: 'Hoch' } },
  { value: 'normal', label: { ru: 'Нормальное', en: 'Normal', de: 'Normal' } },
]

const waterOptions: QuestionOption[] = [
  { value: '1', label: { ru: '1 литр', en: '1 liter', de: '1 Liter' } },
  { value: '1.5', label: { ru: '1.5 литра', en: '1.5 liters', de: '1.5 Liter' } },
  { value: '2', label: { ru: '2 литра', en: '2 liters', de: '2 Liter' } },
  { value: '2.5', label: { ru: '2.5 литра', en: '2.5 liters', de: '2.5 Liter' } },
  { value: '3', label: { ru: '3 литра', en: '3 liters', de: '3 Liter' } },
  { value: '3.5', label: { ru: '3.5 литра', en: '3.5 liters', de: '3.5 Liter' } },
]

const covidComplicationsOptions: QuestionOption[] = [
  { value: 'hair_loss', label: { ru: 'Выпадение волос', en: 'Hair loss', de: 'Haarausfall' } },
  { value: 'heart_problems', label: { ru: 'Проблемы сердца', en: 'Heart problems', de: 'Herzprobleme' } },
  { value: 'joints', label: { ru: 'Суставы', en: 'Joints', de: 'Gelenke' } },
  { value: 'memory_loss', label: { ru: 'Потеря памяти', en: 'Memory loss', de: 'Gedächtnisverlust' } },
  { value: 'panic_attacks', label: { ru: 'Панические атаки', en: 'Panic attacks', de: 'Panikattacken' } },
  { value: 'poor_sleep', label: { ru: 'Ухудшение сна', en: 'Poor sleep', de: 'Schlechter Schlaf' } },
  { value: 'no_complications', label: { ru: 'Нет осложнений', en: 'No complications', de: 'Keine Komplikationen' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const hairQualityOptions: QuestionOption[] = [
  { value: 'healthy', label: { ru: 'Здоровые', en: 'Healthy', de: 'Gesund' } },
  { value: 'dry', label: { ru: 'Сухие', en: 'Dry', de: 'Trocken' } },
  { value: 'oily', label: { ru: 'Жирные', en: 'Oily', de: 'Fettig' } },
  { value: 'brittle', label: { ru: 'Ломкие', en: 'Brittle', de: 'Brüchig' } },
  { value: 'falling_out', label: { ru: 'Выпадают', en: 'Falling out', de: 'Ausfallend' } },
  { value: 'thin', label: { ru: 'Тонкие', en: 'Thin', de: 'Dünn' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const teethProblemsOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'crumble_fast', label: { ru: 'Быстро крошатся', en: 'Crumble fast', de: 'Bröckeln schnell' } },
  { value: 'decay_fast', label: { ru: 'Быстро портятся', en: 'Decay fast', de: 'Verderben schnell' } },
  { value: 'bad_breath', label: { ru: 'Неприятный запах изо рта', en: 'Bad breath', de: 'Mundgeruch' } },
  { value: 'bleeding_gums', label: { ru: 'Кровоточат десна', en: 'Bleeding gums', de: 'Zahnfleischbluten' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const digestionDetailedOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'heartburn', label: { ru: 'Изжога', en: 'Heartburn', de: 'Sodbrennen' } },
  { value: 'bitterness', label: { ru: 'Горечь во рту', en: 'Bitterness in mouth', de: 'Bitterkeit im Mund' } },
  { value: 'bloating', label: { ru: 'Вздутие', en: 'Bloating', de: 'Blähungen' } },
  { value: 'heaviness', label: { ru: 'Тяжесть в желудке', en: 'Heaviness in stomach', de: 'Schwere im Magen' } },
  { value: 'gas', label: { ru: 'Газы', en: 'Gas', de: 'Blähungen' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea', de: 'Durchfall' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation', de: 'Verstopfung' } },
  { value: 'pancreatitis', label: { ru: 'Панкреатит', en: 'Pancreatitis', de: 'Pankreatitis' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const chronicDiseasesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет', en: 'No', de: 'Nein' } },
  { value: 'diabetes', label: { ru: 'Диабет', en: 'Diabetes', de: 'Diabetes' } },
  { value: 'autoimmune_thyroiditis', label: { ru: 'Аутоиммунный тиреоидит', en: 'Autoimmune thyroiditis', de: 'Autoimmunthyreoiditis' } },
  { value: 'arthritis', label: { ru: 'Артрит', en: 'Arthritis', de: 'Arthritis' } },
  { value: 'psoriasis', label: { ru: 'Псориаз', en: 'Psoriasis', de: 'Psoriasis' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const headachesDetailedOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'headaches', label: { ru: 'Головные боли', en: 'Headaches', de: 'Kopfschmerzen' } },
  { value: 'migraines', label: { ru: 'Мигрени', en: 'Migraines', de: 'Migräne' } },
  { value: 'weather_dependent', label: { ru: 'Метеозависимость', en: 'Weather dependent', de: 'Wetterabhängig' } },
  { value: 'concussion', label: { ru: 'Сотрясение мозга', en: 'Concussion', de: 'Gehirnerschütterung' } },
  { value: 'head_trauma', label: { ru: 'Удары по голове', en: 'Head trauma', de: 'Kopftrauma' } },
  { value: 'tinnitus', label: { ru: 'Шум в ушах', en: 'Tinnitus', de: 'Tinnitus' } },
  { value: 'floaters', label: { ru: 'Мушки перед глазами', en: 'Floaters', de: 'Mouches volantes' } },
  { value: 'dizziness', label: { ru: 'Головокружения', en: 'Dizziness', de: 'Schwindel' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const numbnessOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'numbness_fingers', label: { ru: 'Онемение пальцев рук и ног', en: 'Numbness in fingers and toes', de: 'Taubheit in Fingern und Zehen' } },
  { value: 'cold_limbs', label: { ru: 'Руки и ноги холодные даже летом', en: 'Cold hands and feet even in summer', de: 'Kalte Hände und Füße auch im Sommer' } },
  { value: 'both', label: { ru: 'Оба симптома', en: 'Both symptoms', de: 'Beide Symptome' } },
]

const varicoseHemorrhoidsDetailedOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'varicose_network', label: { ru: 'Варикоз (сеточка)', en: 'Varicose veins (network)', de: 'Krampfadern (Netz)' } },
  { value: 'varicose_pronounced', label: { ru: 'Варикоз (выраженные вены)', en: 'Varicose veins (pronounced)', de: 'Krampfadern (ausgeprägt)' } },
  { value: 'hemorrhoids_bleeding', label: { ru: 'Геморрой (кровоточит)', en: 'Hemorrhoids (bleeding)', de: 'Hämorrhoiden (blutend)' } },
  { value: 'hemorrhoids_no_bleeding', label: { ru: 'Геморрой (не кровоточит)', en: 'Hemorrhoids (not bleeding)', de: 'Hämorrhoiden (nicht blutend)' } },
  { value: 'pigment_spots', label: { ru: 'Пигментные пятна', en: 'Pigment spots', de: 'Pigmentflecken' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const jointsDetailedOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'squeak', label: { ru: 'Скрипят', en: 'Squeak', de: 'Quietschen' } },
  { value: 'crunch', label: { ru: 'Хрустят', en: 'Crunch', de: 'Knacken' } },
  { value: 'inflammation', label: { ru: 'Воспаляются', en: 'Inflamed', de: 'Entzündet' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const cystsPolypsOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет', en: 'No', de: 'Nein' } },
  { value: 'cysts', label: { ru: 'Кисты', en: 'Cysts', de: 'Zysten' } },
  { value: 'polyps', label: { ru: 'Полипы', en: 'Polyps', de: 'Polypen' } },
  { value: 'fibroids', label: { ru: 'Миомы', en: 'Fibroids', de: 'Myome' } },
  { value: 'tumors', label: { ru: 'Опухоли', en: 'Tumors', de: 'Tumore' } },
  { value: 'hernias', label: { ru: 'Грыжи', en: 'Hernias', de: 'Hernien' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const herpesWartsOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет', en: 'No', de: 'Nein' } },
  { value: 'herpes', label: { ru: 'Герпес', en: 'Herpes', de: 'Herpes' } },
  { value: 'papillomas', label: { ru: 'Папилломы', en: 'Papillomas', de: 'Papillome' } },
  { value: 'moles', label: { ru: 'Родинки', en: 'Moles', de: 'Muttermale' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts', de: 'Warzen' } },
  { value: 'red_spots', label: { ru: 'Красные точки на коже', en: 'Red spots on skin', de: 'Rote Punkte auf der Haut' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const menstruationDetailedOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Регулярные, нормальные', en: 'Regular, normal', de: 'Regelmäßig, normal' } },
  { value: 'irregular', label: { ru: 'Нерегулярные', en: 'Irregular', de: 'Unregelmäßig' } },
  { value: 'painful', label: { ru: 'Болезненные', en: 'Painful', de: 'Schmerzhaft' } },
  { value: 'prolonged', label: { ru: 'Затяжные', en: 'Prolonged', de: 'Verlängert' } },
  { value: 'heavy_bleeding', label: { ru: 'Обильные кровотечения', en: 'Heavy bleeding', de: 'Starke Blutungen' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const prostatitisOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'acute', label: { ru: 'Острый простатит', en: 'Acute prostatitis', de: 'Akute Prostatitis' } },
  { value: 'chronic', label: { ru: 'Хронический простатит', en: 'Chronic prostatitis', de: 'Chronische Prostatitis' } },
  { value: 'symptoms', label: { ru: 'Есть симптомы', en: 'Have symptoms', de: 'Habe Symptome' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const skinProblemsDetailedOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
  { value: 'acne', label: { ru: 'Прыщи', en: 'Acne', de: 'Akne' } },
  { value: 'furuncles', label: { ru: 'Фурункулы', en: 'Furuncles', de: 'Furunkel' } },
  { value: 'acne_vulgaris', label: { ru: 'Акне', en: 'Acne vulgaris', de: 'Akne vulgaris' } },
  { value: 'irritation', label: { ru: 'Раздражение', en: 'Irritation', de: 'Reizung' } },
  { value: 'rosacea', label: { ru: 'Розацеа', en: 'Rosacea', de: 'Rosazea' } },
  { value: 'psoriasis', label: { ru: 'Псориаз', en: 'Psoriasis', de: 'Psoriasis' } },
  { value: 'dermatitis', label: { ru: 'Дерматит', en: 'Dermatitis', de: 'Dermatitis' } },
  { value: 'eczema', label: { ru: 'Экзема', en: 'Eczema', de: 'Ekzem' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const coldsFrequencyOptions: QuestionOption[] = [
  { value: 'rarely', label: { ru: 'Редко (1-2 раза в год)', en: 'Rarely (1-2 times a year)', de: 'Selten (1-2 mal im Jahr)' } },
  { value: 'sometimes', label: { ru: 'Иногда (3-4 раза в год)', en: 'Sometimes (3-4 times a year)', de: 'Manchmal (3-4 mal im Jahr)' } },
  { value: 'often', label: { ru: 'Часто (5+ раз в год)', en: 'Often (5+ times a year)', de: 'Oft (5+ mal im Jahr)' } },
]

const lifestyleOptions: QuestionOption[] = [
  { value: 'sedentary', label: { ru: 'Сидячий', en: 'Sedentary', de: 'Sitzend' } },
  { value: 'sport', label: { ru: 'Спорт', en: 'Sport', de: 'Sport' } },
  { value: 'home_exercise', label: { ru: 'Домашняя гимнастика', en: 'Home exercise', de: 'Hausgymnastik' } },
  { value: 'cold_showers', label: { ru: 'Холодные обливания', en: 'Cold showers', de: 'Kalte Duschen' } },
  { value: 'stressful_work', label: { ru: 'Стрессовая работа', en: 'Stressful work', de: 'Stressige Arbeit' } },
  { value: 'physical_load', label: { ru: 'Физические нагрузки', en: 'Physical load', de: 'Körperliche Belastung' } },
  { value: 'toxic_substances', label: { ru: 'Токсичные вещества на работе', en: 'Toxic substances at work', de: 'Giftige Stoffe bei der Arbeit' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
]

const stonesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет', en: 'No', de: 'Nein' } },
  { value: 'sand_kidneys', label: { ru: 'Песок в почках', en: 'Sand in kidneys', de: 'Sand in Nieren' } },
  { value: 'sand_gallbladder', label: { ru: 'Песок в желчном', en: 'Sand in gallbladder', de: 'Sand in Gallenblase' } },
  { value: 'stones_kidneys', label: { ru: 'Камни в почках', en: 'Stones in kidneys', de: 'Steine in Nieren' } },
  { value: 'stones_gallbladder', label: { ru: 'Камни в желчном', en: 'Stones in gallbladder', de: 'Steine in Gallenblase' } },
]

// =====================
// INFANT QUESTIONNAIRE
// =====================
export const infantQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information', de: 'Persönliche Daten' },
    icon: 'user',
    questions: [
      { id: 'name', type: 'text', label: { ru: 'Имя', en: 'Name', de: 'Vorname' }, icon: 'user', required: true, hasAdditional: false },
      { id: 'last_name', type: 'text', label: { ru: 'Фамилия', en: 'Last Name', de: 'Nachname' }, icon: 'user', required: true, hasAdditional: false },
      { id: 'age_months', type: 'number', label: { ru: 'Возраст (в месяцах)', en: 'Age (in months)', de: 'Alter (in Monaten)' }, icon: 'calendar', required: true, hasAdditional: false },
      { id: 'weight', type: 'number', label: { ru: 'Вес (кг)', en: 'Weight (kg)', de: 'Gewicht (kg)' }, icon: 'scale', required: true, hasAdditional: false },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health', de: 'Gesundheit' },
    icon: 'heart',
    questions: [
      { id: 'digestion', type: 'checkbox', label: { ru: 'Пищеварение', en: 'Digestion', de: 'Verdauung' }, icon: 'heart', options: digestionOptions, required: true, hasAdditional: false },
      { id: 'sweats_at_night', type: 'radio', label: { ru: 'Потеет во сне', en: 'Sweats at night', de: 'Schwitzt nachts' }, icon: 'droplets', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'bad_breath', type: 'radio', label: { ru: 'Есть ли неприятный запах изо рта', en: 'Is there bad breath', de: 'Gibt es Mundgeruch' }, icon: 'wind', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'skin_condition', type: 'checkbox', label: { ru: 'Родинки / бородавки / высыпания / экзема', en: 'Moles / warts / rashes / eczema', de: 'Muttermale / Warzen / Ausschläge / Ekzeme' }, icon: 'sparkles', options: skinOptions, required: true, hasAdditional: true },
      { id: 'allergies', type: 'checkbox', label: { ru: 'Аллергия', en: 'Allergies', de: 'Allergien' }, icon: 'flower', options: allergyOptions, required: true, hasAdditional: true },
      { id: 'water_per_day', type: 'number', label: { ru: 'Сколько воды в день пьёт ребенок (миллилитров)', en: 'How much water does the child drink per day (milliliters)', de: 'Wie viel Wasser trinkt das Kind pro Tag (Milliliter)' }, icon: 'droplet', required: true, hasAdditional: false },
      { id: 'injuries', type: 'checkbox', label: { ru: 'Травмы / операции / удары по голове / переломы', en: 'Injuries / surgeries / head trauma / fractures', de: 'Verletzungen / Operationen / Kopftrauma / Brüche' }, icon: 'activity', options: injuriesOptions, required: true, hasAdditional: true },
      { id: 'sleep_quality', type: 'radio', label: { ru: 'Хорошо ли спит', en: 'Does the child sleep well', de: 'Schläft das Kind gut' }, icon: 'moon', options: sleepOptionsSimple, required: true, hasAdditional: false },
      { id: 'illness_antibiotics', type: 'checkbox', label: { ru: 'Часто ли болеет / принимал ли антибиотики или лекарства', en: 'Is often ill / has taken antibiotics or medications', de: 'Ist oft krank / hat Antibiotika oder Medikamente genommen' }, icon: 'pill', options: illnessAntibioticsOptions, required: true, hasAdditional: true },
    ],
  },
  {
    id: 'birth_pregnancy',
    title: { ru: 'Роды и беременность', en: 'Birth and Pregnancy', de: 'Geburt und Schwangerschaft' },
    icon: 'baby',
    questions: [
      { id: 'birth_type', type: 'radio', label: { ru: 'Как прошли роды', en: 'How was the birth', de: 'Wie war die Geburt' }, icon: 'baby', options: birthOptions, required: true, hasAdditional: false },
      { id: 'mother_toxicosis', type: 'radio', label: { ru: 'Был ли у мамы сильный токсикоз при беременности', en: 'Did mother have severe toxicosis during pregnancy', de: 'Hatte die Mutter starke Toxikose während der Schwangerschaft' }, icon: 'alert-circle', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'mother_allergy', type: 'radio', label: { ru: 'Была ли у мамы аллергия до или во время беременности', en: 'Did mother have allergies before or during pregnancy', de: 'Hatte die Mutter Allergien vor oder während der Schwangerschaft' }, icon: 'flower', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'mother_constipation', type: 'radio', label: { ru: 'Был ли у мамы запор', en: 'Did mother have constipation', de: 'Hatte die Mutter Verstopfung' }, icon: 'alert-triangle', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'mother_antibiotics', type: 'radio', label: { ru: 'Пила ли мама антибиотики во время беременности', en: 'Did mother take antibiotics during pregnancy', de: 'Nahm die Mutter Antibiotika während der Schwangerschaft' }, icon: 'pill', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'mother_anemia', type: 'radio', label: { ru: 'Была ли анемия у мамы', en: 'Did mother have anemia', de: 'Hatte die Mutter Anämie' }, icon: 'heart', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'pregnancy_problems', type: 'radio', label: { ru: 'Были ли проблемы во время беременности', en: 'Were there problems during pregnancy', de: 'Gab es Probleme während der Schwangerschaft' }, icon: 'file-text', options: yesNoOptionsSimple, required: true, hasAdditional: true },
      { id: 'what_else', type: 'textarea', label: { ru: 'Что ещё нужно знать о здоровье ребёнка?', en: 'What else should we know about the child\'s health?', de: 'Was sollten wir noch über die Gesundheit des Kindes wissen?' }, icon: 'info', required: false, hasAdditional: false, placeholder: { ru: 'Дополнительная информация', en: 'Additional information', de: 'Zusätzliche Informationen' } },
    ],
  },
  {
    id: 'medical_documents',
    title: { ru: 'Медицинские документы', en: 'Medical Documents', de: 'Medizinische Dokumente' },
    icon: 'file-text',
    questions: [
      { id: 'has_medical_documents', type: 'radio', label: { ru: 'Есть ли у вас анализы крови за последние 2-3 месяца? УЗИ?', en: 'Do you have blood test results from the last 2-3 months? Ultrasound?', de: 'Haben Sie Blutuntersuchungsergebnisse der letzten 2-3 Monate? Ultraschall?' }, icon: 'file-text', options: yesNoOptionsSimple, required: true, hasAdditional: false },
    ],
  },
]

// =====================
// CHILD QUESTIONNAIRE
// =====================
export const childQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information', de: 'Persönliche Daten' },
    icon: 'user',
    questions: [
      { id: 'name', type: 'text', label: { ru: 'Имя', en: 'Name', de: 'Vorname' }, icon: 'user', required: true, hasAdditional: false },
      { id: 'last_name', type: 'text', label: { ru: 'Фамилия', en: 'Last Name', de: 'Nachname' }, icon: 'user', required: true, hasAdditional: false },
      { id: 'age', type: 'number', label: { ru: 'Возраст (от 1 до 12 лет)', en: 'Age (1 to 12 years)', de: 'Alter (1 bis 12 Jahre)' }, icon: 'calendar', required: true, hasAdditional: false, min: 1, max: 12 },
      { id: 'weight', type: 'number', label: { ru: 'Вес (кг)', en: 'Weight (kg)', de: 'Gewicht (kg)' }, icon: 'scale', required: true, hasAdditional: false },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health', de: 'Gesundheit' },
    icon: 'heart',
    questions: [
      { id: 'digestion', type: 'checkbox', label: { ru: 'Пищеварение', en: 'Digestion', de: 'Verdauung' }, icon: 'heart', options: digestionOptionsExtended, required: true, hasAdditional: false },
      { id: 'teeth_decay', type: 'radio', label: { ru: 'Зубы быстро портятся', en: 'Teeth decay quickly', de: 'Zähne verderben schnell' }, icon: 'smile', options: yesNoOptions, required: true, hasAdditional: false },
      { id: 'sweats_grinds', type: 'checkbox', label: { ru: 'Потеет во сне / скрипит зубами', en: 'Sweats at night / grinds teeth', de: 'Schwitzt nachts / knirscht mit den Zähnen' }, icon: 'moon', options: [
        { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
        { value: 'sweats', label: { ru: 'Потеет во сне', en: 'Sweats at night', de: 'Schwitzt nachts' } },
        { value: 'grinds', label: { ru: 'Скрипит зубами', en: 'Grinds teeth', de: 'Knirscht mit den Zähnen' } },
      ], required: true, hasAdditional: false },
      { id: 'bad_breath', type: 'radio', label: { ru: 'Неприятный запах изо рта', en: 'Bad breath', de: 'Mundgeruch' }, icon: 'wind', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'sugar_dependency', type: 'text', label: { ru: 'Зависимость от сладкого', en: 'Sugar dependency', de: 'Zuckerabhängigkeit' }, icon: 'candy', required: true, hasAdditional: false, placeholder: { ru: 'Опишите', en: 'Describe', de: 'Beschreiben' } },
      { id: 'skin_condition', type: 'checkbox', label: { ru: 'Родинки / бородавки / высыпания / экзема', en: 'Moles / warts / rashes / eczema', de: 'Muttermale / Warzen / Ausschläge / Ekzeme' }, icon: 'sparkles', options: skinOptions, required: true, hasAdditional: true },
      { id: 'allergies', type: 'checkbox', label: { ru: 'Аллергия', en: 'Allergies', de: 'Allergien' }, icon: 'flower', options: allergyOptions, required: true, hasAdditional: true },
      { id: 'hyperactive', type: 'radio', label: { ru: 'Гиперактивный или часто жалуется на усталость', en: 'Hyperactive or often complains of tiredness', de: 'Hyperaktiv oder klagt oft über Müdigkeit' }, icon: 'zap', options: hyperactiveOptions, required: true, hasAdditional: false },
      { id: 'water_per_day', type: 'radio', label: { ru: 'Сколько воды в день (литров)', en: 'Water per day (liters)', de: 'Wasser pro Tag (Liter)' }, icon: 'droplet', options: waterOptions, required: true, hasAdditional: false },
      { id: 'injuries', type: 'checkbox', label: { ru: 'Травмы / операции / удары по голове / переломы', en: 'Injuries / surgeries / head trauma / fractures', de: 'Verletzungen / Operationen / Kopftrauma / Brüche' }, icon: 'activity', options: injuriesOptions, required: true, hasAdditional: true },
      { id: 'headaches_sleep', type: 'checkbox', label: { ru: 'Головные боли и сон', en: 'Headaches and sleep', de: 'Kopfschmerzen und Schlaf' }, icon: 'brain', options: headachesSleepOptions, required: true, hasAdditional: false },
      { id: 'illness_antibiotics', type: 'checkbox', label: { ru: 'Простуды и лекарства', en: 'Colds and medications', de: 'Erkältungen und Medikamente' }, icon: 'pill', options: illnessAntibioticsOptions, required: true, hasAdditional: false },
      { id: 'what_else', type: 'textarea', label: { ru: 'Что ещё нужно знать о здоровье ребёнка?', en: 'What else should we know about the child\'s health?', de: 'Was sollten wir noch über die Gesundheit des Kindes wissen?' }, icon: 'info', required: false, hasAdditional: false, placeholder: { ru: 'Дополнительная информация', en: 'Additional information', de: 'Zusätzliche Informationen' } },
    ],
  },
  {
    id: 'medical_documents',
    title: { ru: 'Медицинские документы', en: 'Medical Documents', de: 'Medizinische Dokumente' },
    icon: 'file-text',
    questions: [
      { id: 'has_medical_documents', type: 'radio', label: { ru: 'Есть ли у вас анализы крови за последние 2-3 месяца? УЗИ?', en: 'Do you have blood test results from the last 2-3 months? Ultrasound?', de: 'Haben Sie Blutuntersuchungsergebnisse der letzten 2-3 Monate? Ultraschall?' }, icon: 'file-text', options: yesNoOptionsSimple, required: true, hasAdditional: false },
    ],
  },
]

// =====================
// WOMAN QUESTIONNAIRE
// =====================
export const womanQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information', de: 'Persönliche Daten' },
    icon: 'user',
    questions: [
      { id: 'name', type: 'text', label: { ru: 'Имя', en: 'Name', de: 'Vorname' }, icon: 'user', required: true, hasAdditional: false },
      { id: 'last_name', type: 'text', label: { ru: 'Фамилия', en: 'Last Name', de: 'Nachname' }, icon: 'user', required: true, hasAdditional: false },
      { id: 'age', type: 'number', label: { ru: 'Возраст', en: 'Age', de: 'Alter' }, icon: 'calendar', required: true, hasAdditional: false },
      { id: 'weight', type: 'number', label: { ru: 'Вес (кг)', en: 'Weight (kg)', de: 'Gewicht (kg)' }, icon: 'scale', required: true, hasAdditional: false },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health', de: 'Gesundheit' },
    icon: 'heart',
    questions: [
      { id: 'weight_satisfaction', type: 'radio', label: { ru: 'Довольны ли вы своим весом?', en: 'Are you satisfied with your weight?', de: 'Sind Sie mit Ihrem Gewicht zufrieden?' }, icon: 'scale', options: [
        { value: 'satisfied', label: { ru: 'Да, довольна', en: 'Yes, satisfied', de: 'Ja, zufrieden' } },
        { value: 'not_satisfied', label: { ru: 'Нет, недовольна', en: 'No, not satisfied', de: 'Nein, nicht zufrieden' } },
      ], required: true, hasAdditional: false },
      { id: 'weight_goal', type: 'radio', label: { ru: 'Что вы хотите сделать с весом?', en: 'What do you want to do with your weight?', de: 'Was möchten Sie mit Ihrem Gewicht tun?' }, icon: 'target', options: [
        { value: 'lose', label: { ru: 'Сбросить вес', en: 'Lose weight', de: 'Gewicht verlieren' } },
        { value: 'gain', label: { ru: 'Набрать вес', en: 'Gain weight', de: 'Gewicht zunehmen' } },
      ], required: false, hasAdditional: true },
      { id: 'water_per_day', type: 'radio', label: { ru: 'Сколько воды в день Вы пьете?', en: 'How much water do you drink per day?', de: 'Wie viel Wasser trinken Sie pro Tag?' }, icon: 'droplet', options: waterOptions, required: true, hasAdditional: false },
      { id: 'had_covid', type: 'radio', label: { ru: 'Был ли у вас ковид?', en: 'Did you have COVID?', de: 'Hatten Sie COVID?' }, icon: 'shield', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'covid_times', type: 'number', label: { ru: 'Сколько раз вы болели ковидом?', en: 'How many times did you have COVID?', de: 'Wie oft hatten Sie COVID?' }, icon: 'shield', required: false, hasAdditional: false, min: 1, max: 10, placeholder: { ru: 'Введите число', en: 'Enter number', de: 'Zahl eingeben' } },
      { id: 'had_vaccine', type: 'radio', label: { ru: 'Делали ли вы вакцину от ковида?', en: 'Did you get COVID vaccine?', de: 'Haben Sie COVID-Impfung erhalten?' }, icon: 'shield', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'vaccine_doses', type: 'number', label: { ru: 'Сколько доз вакцины вы получили?', en: 'How many vaccine doses did you receive?', de: 'Wie viele Impfdosen haben Sie erhalten?' }, icon: 'shield', required: false, hasAdditional: false, min: 1, max: 10, placeholder: { ru: 'Введите число', en: 'Enter number', de: 'Zahl eingeben' } },
      { id: 'covid_complications', type: 'checkbox', label: { ru: 'Были ли осложнения после ковида?', en: 'Were there complications after COVID?', de: 'Gab es Komplikationen nach COVID?' }, icon: 'alert-circle', options: covidComplicationsOptions, required: true, hasAdditional: true },
      { id: 'hair_quality', type: 'checkbox', label: { ru: 'Состояние волос', en: 'Hair condition', de: 'Haarzustand' }, icon: 'sparkles', options: hairQualityOptions, required: true, hasAdditional: true },
      { id: 'teeth_problems', type: 'checkbox', label: { ru: 'Зубы', en: 'Teeth', de: 'Zähne' }, icon: 'smile', options: teethProblemsOptions, required: true, hasAdditional: true },
      { id: 'digestion_detailed', type: 'checkbox', label: { ru: 'Пищеварение', en: 'Digestion', de: 'Verdauung' }, icon: 'heart', options: digestionDetailedOptions, required: true, hasAdditional: true },
      { id: 'stones_kidneys_gallbladder', type: 'checkbox', label: { ru: 'Песок или камни в желчном или почках', en: 'Sand or stones in gallbladder or kidneys', de: 'Sand oder Steine in Gallenblase oder Nieren' }, icon: 'circle', options: stonesOptions, required: true, hasAdditional: true },
      { id: 'operations_traumas', type: 'checkbox', label: { ru: 'Операции и травмы', en: 'Operations and injuries', de: 'Operationen und Verletzungen' }, icon: 'scissors', options: operationsTraumasOptions, required: true, hasAdditional: true },
      { id: 'blood_pressure', type: 'radio', label: { ru: 'Давление', en: 'Blood pressure', de: 'Blutdruck' }, icon: 'activity', options: pressureOptions, required: true, hasAdditional: true },
      { id: 'chronic_diseases', type: 'checkbox', label: { ru: 'Хронические или аутоиммунные заболевания', en: 'Chronic or autoimmune diseases', de: 'Chronische oder autoimmune Erkrankungen' }, icon: 'alert-circle', options: chronicDiseasesOptions, required: true, hasAdditional: true },
      { id: 'headaches_detailed', type: 'checkbox', label: { ru: 'Головные боли', en: 'Headaches', de: 'Kopfschmerzen' }, icon: 'brain', options: headachesDetailedOptions, required: true, hasAdditional: true },
      { id: 'numbness_cold_limbs', type: 'checkbox', label: { ru: 'Онемение и холодные конечности', en: 'Numbness and cold limbs', de: 'Taubheit und kalte Gliedmaßen' }, icon: 'thermometer', options: numbnessOptions, required: true, hasAdditional: false },
      { id: 'varicose_hemorrhoids_pigment', type: 'checkbox', label: { ru: 'Варикоз, геморрой, пигментация', en: 'Varicose veins, hemorrhoids, pigmentation', de: 'Krampfadern, Hämorrhoiden, Pigmentierung' }, icon: 'heart', options: varicoseHemorrhoidsDetailedOptions, required: true, hasAdditional: true },
      { id: 'joints_detailed', type: 'checkbox', label: { ru: 'Суставы', en: 'Joints', de: 'Gelenke' }, icon: 'bone', options: jointsDetailedOptions, required: true, hasAdditional: true },
      { id: 'cysts_polyps_tumors', type: 'checkbox', label: { ru: 'Кисты, полипы, опухоли', en: 'Cysts, polyps, tumors', de: 'Zysten, Polypen, Tumore' }, icon: 'circle', options: cystsPolypsOptions, required: true, hasAdditional: true },
      { id: 'herpes_warts_discharge', type: 'checkbox', label: { ru: 'Герпес, папилломы, выделения, цистит', en: 'Herpes, papillomas, discharge, cystitis', de: 'Herpes, Papillome, Ausfluss, Zystitis' }, icon: 'alert-circle', options: [
        ...herpesWartsOptions,
        { value: 'thrush', label: { ru: 'Молочница', en: 'Thrush', de: 'Soor' } },
        { value: 'cystitis', label: { ru: 'Цистит', en: 'Cystitis', de: 'Zystitis' } },
      ], required: true, hasAdditional: true },
      { id: 'menstruation_detailed', type: 'checkbox', label: { ru: 'Месячные', en: 'Menstruation', de: 'Menstruation' }, icon: 'calendar', options: menstruationDetailedOptions, required: true, hasAdditional: true },
      { id: 'skin_problems_detailed', type: 'checkbox', label: { ru: 'Проблемы с кожей', en: 'Skin problems', de: 'Hautprobleme' }, icon: 'sparkles', options: skinProblemsDetailedOptions, required: true, hasAdditional: true },
      { id: 'allergies_detailed', type: 'checkbox', label: { ru: 'Аллергия', en: 'Allergies', de: 'Allergien' }, icon: 'flower', options: allergyOptionsExtended, required: true, hasAdditional: true },
      { id: 'colds_medication', type: 'radio', label: { ru: 'Простуды', en: 'Colds', de: 'Erkältungen' }, icon: 'thermometer', options: coldsFrequencyOptions, required: true, hasAdditional: true },
      { id: 'sleep_problems', type: 'checkbox', label: { ru: 'Сон', en: 'Sleep', de: 'Schlaf' }, icon: 'moon', options: [
        { value: 'good', label: { ru: 'Хороший', en: 'Good', de: 'Gut' } },
        { value: 'hard_to_fall_asleep', label: { ru: 'Трудно заснуть', en: 'Hard to fall asleep', de: 'Schwer einzuschlafen' } },
        { value: 'wake_often', label: { ru: 'Часто просыпаюсь ночью', en: 'Often wake up at night', de: 'Wache oft nachts auf' } },
        { value: 'both', label: { ru: 'Оба симптома', en: 'Both symptoms', de: 'Beide Symptome' } },
        { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
      ], required: true, hasAdditional: true },
      { id: 'energy_morning', type: 'checkbox', label: { ru: 'Энергия', en: 'Energy', de: 'Energie' }, icon: 'zap', options: [
        { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
        { value: 'hard_to_wake', label: { ru: 'Тяжело просыпаться', en: 'Hard to wake up', de: 'Schwer aufzuwachen' } },
        { value: 'unrested_morning', label: { ru: 'Утром чувствую себя неотдохнувшей', en: 'Feel unrested in the morning', de: 'Fühle mich morgens unausgeruht' } },
        { value: 'need_coffee', label: { ru: 'Нужна стимуляция кофе', en: 'Need coffee stimulation', de: 'Brauche Kaffeestimulation' } },
        { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
      ], required: true, hasAdditional: true },
      { id: 'memory_concentration', type: 'checkbox', label: { ru: 'Память и концентрация', en: 'Memory and concentration', de: 'Gedächtnis und Konzentration' }, icon: 'brain', options: [
        { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
        { value: 'hard_to_concentrate', label: { ru: 'Трудно сконцентрироваться', en: 'Hard to concentrate', de: 'Schwer zu konzentrieren' } },
        { value: 'forget_names_events', label: { ru: 'Забываются имена и события', en: 'Forget names and events', de: 'Vergesse Namen und Ereignisse' } },
        { value: 'hard_to_remember', label: { ru: 'Сложно запоминать информацию', en: 'Hard to remember information', de: 'Schwer Informationen zu merken' } },
        { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
      ], required: true, hasAdditional: true },
      { id: 'lifestyle', type: 'checkbox', label: { ru: 'Образ жизни', en: 'Lifestyle', de: 'Lebensstil' }, icon: 'activity', options: lifestyleOptions, required: true, hasAdditional: true },
      { id: 'regular_medications', type: 'radio', label: { ru: 'Регулярные лекарства', en: 'Regular medications', de: 'Regelmäßige Medikamente' }, icon: 'pill', options: yesNoOptionsSimple, required: true, hasAdditional: true },
      { id: 'has_medical_documents', type: 'radio', label: { ru: 'Анализы крови и УЗИ', en: 'Blood tests and ultrasound', de: 'Blutuntersuchungen und Ultraschall' }, icon: 'file-text', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'main_concern', type: 'textarea', label: { ru: 'Какой самый важный вопрос Вас волнует в первую очередь?', en: 'What is the most important question that concerns you first?', de: 'Welche wichtigste Frage beschäftigt Sie in erster Linie?' }, icon: 'help-circle', required: false, hasAdditional: false, placeholder: { ru: 'Опишите ваш главный вопрос', en: 'Describe your main question', de: 'Beschreiben Sie Ihre Hauptfrage' } },
    ],
  },
]

// =====================
// MAN QUESTIONNAIRE
// =====================
export const manQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information', de: 'Persönliche Daten' },
    icon: 'user',
    questions: [
      { id: 'name', type: 'text', label: { ru: 'Имя', en: 'Name', de: 'Vorname' }, icon: 'user', required: true, hasAdditional: false },
      { id: 'last_name', type: 'text', label: { ru: 'Фамилия', en: 'Last Name', de: 'Nachname' }, icon: 'user', required: true, hasAdditional: false },
      { id: 'age', type: 'number', label: { ru: 'Возраст', en: 'Age', de: 'Alter' }, icon: 'calendar', required: true, hasAdditional: false },
      { id: 'weight', type: 'number', label: { ru: 'Вес (кг)', en: 'Weight (kg)', de: 'Gewicht (kg)' }, icon: 'scale', required: true, hasAdditional: false },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health', de: 'Gesundheit' },
    icon: 'heart',
    questions: [
      { id: 'weight_satisfaction', type: 'radio', label: { ru: 'Довольны ли вы своим весом?', en: 'Are you satisfied with your weight?', de: 'Sind Sie mit Ihrem Gewicht zufrieden?' }, icon: 'scale', options: [
        { value: 'satisfied', label: { ru: 'Да, доволен', en: 'Yes, satisfied', de: 'Ja, zufrieden' } },
        { value: 'not_satisfied', label: { ru: 'Нет, недоволен', en: 'No, not satisfied', de: 'Nein, nicht zufrieden' } },
      ], required: true, hasAdditional: false },
      { id: 'weight_goal', type: 'radio', label: { ru: 'Что вы хотите сделать с весом?', en: 'What do you want to do with your weight?', de: 'Was möchten Sie mit Ihrem Gewicht tun?' }, icon: 'target', options: [
        { value: 'lose', label: { ru: 'Сбросить вес', en: 'Lose weight', de: 'Gewicht verlieren' } },
        { value: 'gain', label: { ru: 'Набрать вес', en: 'Gain weight', de: 'Gewicht zunehmen' } },
      ], required: false, hasAdditional: true },
      { id: 'water_per_day', type: 'radio', label: { ru: 'Сколько воды в день Вы пьете?', en: 'How much water do you drink per day?', de: 'Wie viel Wasser trinken Sie pro Tag?' }, icon: 'droplet', options: waterOptions, required: true, hasAdditional: false },
      { id: 'had_covid', type: 'radio', label: { ru: 'Был ли у вас ковид?', en: 'Did you have COVID?', de: 'Hatten Sie COVID?' }, icon: 'shield', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'covid_times', type: 'number', label: { ru: 'Сколько раз вы болели ковидом?', en: 'How many times did you have COVID?', de: 'Wie oft hatten Sie COVID?' }, icon: 'shield', required: false, hasAdditional: false, min: 1, max: 10, placeholder: { ru: 'Введите число', en: 'Enter number', de: 'Zahl eingeben' } },
      { id: 'had_vaccine', type: 'radio', label: { ru: 'Делали ли вы вакцину от ковида?', en: 'Did you get COVID vaccine?', de: 'Haben Sie COVID-Impfung erhalten?' }, icon: 'shield', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'vaccine_doses', type: 'number', label: { ru: 'Сколько доз вакцины вы получили?', en: 'How many vaccine doses did you receive?', de: 'Wie viele Impfdosen haben Sie erhalten?' }, icon: 'shield', required: false, hasAdditional: false, min: 1, max: 10, placeholder: { ru: 'Введите число', en: 'Enter number', de: 'Zahl eingeben' } },
      { id: 'covid_complications', type: 'checkbox', label: { ru: 'Были ли осложнения после ковида?', en: 'Were there complications after COVID?', de: 'Gab es Komplikationen nach COVID?' }, icon: 'alert-circle', options: covidComplicationsOptions, required: true, hasAdditional: true },
      { id: 'hair_quality', type: 'checkbox', label: { ru: 'Состояние волос', en: 'Hair condition', de: 'Haarzustand' }, icon: 'sparkles', options: hairQualityOptions, required: true, hasAdditional: true },
      { id: 'teeth_problems', type: 'checkbox', label: { ru: 'Зубы', en: 'Teeth', de: 'Zähne' }, icon: 'smile', options: teethProblemsOptions, required: true, hasAdditional: true },
      { id: 'digestion_detailed', type: 'checkbox', label: { ru: 'Пищеварение', en: 'Digestion', de: 'Verdauung' }, icon: 'heart', options: digestionDetailedOptions, required: true, hasAdditional: true },
      { id: 'stones_kidneys_gallbladder', type: 'checkbox', label: { ru: 'Песок или камни в желчном или почках', en: 'Sand or stones in gallbladder or kidneys', de: 'Sand oder Steine in Gallenblase oder Nieren' }, icon: 'circle', options: stonesOptions, required: true, hasAdditional: true },
      { id: 'operations_traumas', type: 'checkbox', label: { ru: 'Операции и травмы', en: 'Operations and injuries', de: 'Operationen und Verletzungen' }, icon: 'scissors', options: operationsTraumasOptions, required: true, hasAdditional: true },
      { id: 'blood_pressure', type: 'radio', label: { ru: 'Давление', en: 'Blood pressure', de: 'Blutdruck' }, icon: 'activity', options: pressureOptions, required: true, hasAdditional: true },
      { id: 'chronic_diseases', type: 'checkbox', label: { ru: 'Хронические или аутоиммунные заболевания', en: 'Chronic or autoimmune diseases', de: 'Chronische oder autoimmune Erkrankungen' }, icon: 'alert-circle', options: chronicDiseasesOptions, required: true, hasAdditional: true },
      { id: 'headaches_detailed', type: 'checkbox', label: { ru: 'Головные боли', en: 'Headaches', de: 'Kopfschmerzen' }, icon: 'brain', options: headachesDetailedOptions, required: true, hasAdditional: true },
      { id: 'numbness_cold_limbs', type: 'checkbox', label: { ru: 'Онемение и холодные конечности', en: 'Numbness and cold limbs', de: 'Taubheit und kalte Gliedmaßen' }, icon: 'thermometer', options: numbnessOptions, required: true, hasAdditional: false },
      { id: 'varicose_hemorrhoids_pigment', type: 'checkbox', label: { ru: 'Варикоз, геморрой, пигментация', en: 'Varicose veins, hemorrhoids, pigmentation', de: 'Krampfadern, Hämorrhoiden, Pigmentierung' }, icon: 'heart', options: varicoseHemorrhoidsDetailedOptions, required: true, hasAdditional: true },
      { id: 'joints_detailed', type: 'checkbox', label: { ru: 'Суставы', en: 'Joints', de: 'Gelenke' }, icon: 'bone', options: jointsDetailedOptions, required: true, hasAdditional: true },
      { id: 'cysts_polyps_tumors', type: 'checkbox', label: { ru: 'Кисты, полипы, опухоли', en: 'Cysts, polyps, tumors', de: 'Zysten, Polypen, Tumore' }, icon: 'circle', options: cystsPolypsOptions, required: true, hasAdditional: true },
      { id: 'herpes_warts_discharge', type: 'checkbox', label: { ru: 'Герпес, папилломы, выделения, цистит', en: 'Herpes, papillomas, discharge, cystitis', de: 'Herpes, Papillome, Ausfluss, Zystitis' }, icon: 'alert-circle', options: [
        ...herpesWartsOptions,
        { value: 'discharge_male', label: { ru: 'Выделения (по-мужски)', en: 'Discharge (male)', de: 'Ausfluss (männlich)' } },
        { value: 'cystitis', label: { ru: 'Цистит', en: 'Cystitis', de: 'Zystitis' } },
      ], required: true, hasAdditional: false },
      { id: 'prostatitis', type: 'checkbox', label: { ru: 'Простатит', en: 'Prostatitis', de: 'Prostatitis' }, icon: 'alert-circle', options: prostatitisOptions, required: true, hasAdditional: true },
      { id: 'skin_problems_detailed', type: 'checkbox', label: { ru: 'Проблемы с кожей', en: 'Skin problems', de: 'Hautprobleme' }, icon: 'sparkles', options: skinProblemsDetailedOptions, required: true, hasAdditional: true },
      { id: 'allergies_detailed', type: 'checkbox', label: { ru: 'Аллергия', en: 'Allergies', de: 'Allergien' }, icon: 'flower', options: allergyOptionsExtended, required: true, hasAdditional: true },
      { id: 'colds_medication', type: 'radio', label: { ru: 'Простуды', en: 'Colds', de: 'Erkältungen' }, icon: 'thermometer', options: coldsFrequencyOptions, required: true, hasAdditional: true },
      { id: 'sleep_problems', type: 'checkbox', label: { ru: 'Сон', en: 'Sleep', de: 'Schlaf' }, icon: 'moon', options: [
        { value: 'good', label: { ru: 'Хороший', en: 'Good', de: 'Gut' } },
        { value: 'hard_to_fall_asleep', label: { ru: 'Трудно заснуть', en: 'Hard to fall asleep', de: 'Schwer einzuschlafen' } },
        { value: 'wake_often', label: { ru: 'Часто просыпаюсь ночью', en: 'Often wake up at night', de: 'Wache oft nachts auf' } },
        { value: 'both', label: { ru: 'Оба симптома', en: 'Both symptoms', de: 'Beide Symptome' } },
        { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
      ], required: true, hasAdditional: true },
      { id: 'energy_morning', type: 'checkbox', label: { ru: 'Энергия', en: 'Energy', de: 'Energie' }, icon: 'zap', options: [
        { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
        { value: 'hard_to_wake', label: { ru: 'Тяжело просыпаться', en: 'Hard to wake up', de: 'Schwer aufzuwachen' } },
        { value: 'unrested_morning', label: { ru: 'Утром чувствую себя неотдохнувшим', en: 'Feel unrested in the morning', de: 'Fühle mich morgens unausgeruht' } },
        { value: 'need_coffee', label: { ru: 'Нужна стимуляция кофе', en: 'Need coffee stimulation', de: 'Brauche Kaffeestimulation' } },
        { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
      ], required: true, hasAdditional: true },
      { id: 'memory_concentration', type: 'checkbox', label: { ru: 'Память и концентрация', en: 'Memory and concentration', de: 'Gedächtnis und Konzentration' }, icon: 'brain', options: [
        { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues', de: 'Keine Beschwerden' } },
        { value: 'hard_to_concentrate', label: { ru: 'Трудно сконцентрироваться', en: 'Hard to concentrate', de: 'Schwer zu konzentrieren' } },
        { value: 'forget_names_events', label: { ru: 'Забываются имена и события', en: 'Forget names and events', de: 'Vergesse Namen und Ereignisse' } },
        { value: 'hard_to_remember', label: { ru: 'Сложно запоминать информацию', en: 'Hard to remember information', de: 'Schwer Informationen zu merken' } },
        { value: 'other', label: { ru: 'Другое', en: 'Other', de: 'Andere' } },
      ], required: true, hasAdditional: true },
      { id: 'lifestyle', type: 'checkbox', label: { ru: 'Образ жизни', en: 'Lifestyle', de: 'Lebensstil' }, icon: 'activity', options: lifestyleOptions, required: true, hasAdditional: true },
      { id: 'regular_medications', type: 'radio', label: { ru: 'Регулярные лекарства', en: 'Regular medications', de: 'Regelmäßige Medikamente' }, icon: 'pill', options: yesNoOptionsSimple, required: true, hasAdditional: true },
      { id: 'has_medical_documents', type: 'radio', label: { ru: 'Анализы крови и УЗИ', en: 'Blood tests and ultrasound', de: 'Blutuntersuchungen und Ultraschall' }, icon: 'file-text', options: yesNoOptionsSimple, required: true, hasAdditional: false },
      { id: 'main_concern', type: 'textarea', label: { ru: 'Какой самый важный вопрос Вас волнует в первую очередь?', en: 'What is the most important question that concerns you first?', de: 'Welche wichtigste Frage beschäftigt Sie in erster Linie?' }, icon: 'help-circle', required: false, hasAdditional: false, placeholder: { ru: 'Опишите ваш главный вопрос', en: 'Describe your main question', de: 'Beschreiben Sie Ihre Hauptfrage' } },
    ],
  },
]

// =====================
// HELPER FUNCTIONS
// =====================
export type QuestionnaireTypeName = 'infant' | 'child' | 'woman' | 'man' | 'baby' | 'women' | 'men'

export const getQuestionnaire = (type: QuestionnaireTypeName): QuestionnaireSection[] => {
  switch (type) {
    case 'infant':
    case 'baby':
      return infantQuestionnaire
    case 'child':
      return childQuestionnaire
    case 'woman':
    case 'women':
      return womanQuestionnaire
    case 'man':
    case 'men':
      return manQuestionnaire
    default:
      return infantQuestionnaire
  }
}

export const getQuestionnaireTitle = (type: QuestionnaireTypeName, lang: Language = 'ru'): string => {
  const titles: Record<QuestionnaireTypeName, Record<Language, string>> = {
    infant: { ru: 'Анкета для младенца', en: 'Infant Questionnaire', de: 'Säuglingsfragebogen' },
    baby: { ru: 'Анкета для младенца', en: 'Infant Questionnaire', de: 'Säuglingsfragebogen' },
    child: { ru: 'Детская анкета', en: 'Child Questionnaire', de: 'Kinderfragebogen' },
    woman: { ru: 'Женская анкета', en: 'Women\'s Questionnaire', de: 'Frauenfragebogen' },
    women: { ru: 'Женская анкета', en: 'Women\'s Questionnaire', de: 'Frauenfragebogen' },
    man: { ru: 'Мужская анкета', en: 'Men\'s Questionnaire', de: 'Männerfragebogen' },
    men: { ru: 'Мужская анкета', en: 'Men\'s Questionnaire', de: 'Männerfragebogen' },
  }
  return titles[type]?.[lang] || titles[type]?.ru || ''
}
