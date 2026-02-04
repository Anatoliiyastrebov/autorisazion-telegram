import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ShieldCheck } from 'lucide-react';

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { language } = useLanguage();

  const privacyPolicy = {
    ru: {
      title: 'Политика конфиденциальности',
      sections: [
        {
          title: 'Контролер данных',
          content: 'Контролером данных является лицо, предоставляющее консультацию по здоровью. Для запросов по обработке данных свяжитесь с нами через указанные контактные данные в анкете.',
        },
        {
          title: 'Правовая основа обработки',
          content: 'Обработка персональных данных осуществляется на основании вашего добровольного согласия (ст. 6 п. 1 лит. a GDPR). Вы можете в любое время отозвать свое согласие.',
        },
        {
          title: 'Какие данные мы собираем',
          content: 'Мы собираем персональные данные, которые вы предоставляете в анкете: имя, возраст, вес, информацию о состоянии здоровья, симптомы, жалобы, аллергии, историю болезней и контактные данные (Telegram или Instagram). Предоставление данных является добровольным, но необходимо для предоставления консультации.',
        },
        {
          title: 'Зачем мы собираем данные',
          content: 'Данные собираются исключительно для предоставления консультации по здоровью. Мы используем эту информацию для анализа вашего состояния и подготовки рекомендаций. Данные не используются для автоматизированного принятия решений или профилирования.',
        },
        {
          title: 'Куда отправляются данные',
          content: 'Данные отправляются в Telegram-бот через официальный API Telegram. Сообщение с вашей анкетой отправляется в защищенный чат для обработки консультантом. Telegram обрабатывает данные в соответствии с применимыми законами о защите данных.',
        },
        {
          title: 'Как долго хранятся данные',
          content: 'Данные хранятся в Telegram-чате до момента завершения консультации или до момента отзыва вашего согласия. После завершения консультации или отзыва согласия вы можете запросить удаление ваших данных. Мы удалим ваши данные в течение 30 дней с момента запроса.',
        },
        {
          title: 'Ваши права',
          content: 'В соответствии с GDPR/DSGVO вы имеете право: на доступ к вашим данным (ст. 15 GDPR), их исправление (ст. 16 GDPR), удаление (ст. 17 GDPR), ограничение обработки (ст. 18 GDPR), переносимость данных (ст. 20 GDPR) и возражение против обработки (ст. 21 GDPR). Вы можете в любое время отозвать согласие на обработку данных без влияния на законность обработки, основанную на согласии до его отзыва.',
        },
        {
          title: 'Право на подачу жалобы',
          content: 'Вы имеете право подать жалобу в надзорный орган по защите данных, если считаете, что обработка ваших персональных данных нарушает GDPR. В Германии это Федеральный уполномоченный по защите данных и свободе информации (BfDI).',
        },
        {
          title: 'Как реализовать ваши права',
          content: 'Для реализации ваших прав (доступ, исправление, удаление и т.д.) свяжитесь с нами через Telegram или Instagram, указав ваше имя и дату заполнения анкеты. Мы обработаем ваш запрос в течение 30 дней с момента получения.',
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      sections: [
        {
          title: 'Data Controller',
          content: 'The data controller is the person providing health consultation. For requests regarding data processing, please contact us through the contact details provided in the questionnaire.',
        },
        {
          title: 'Legal Basis for Processing',
          content: 'The processing of personal data is based on your voluntary consent (Art. 6 para. 1 lit. a GDPR). You can withdraw your consent at any time.',
        },
        {
          title: 'What data we collect',
          content: 'We collect personal data that you provide in the questionnaire: name, age, weight, health information, symptoms, complaints, allergies, medical history, and contact details (Telegram or Instagram). Providing data is voluntary but necessary for providing consultation.',
        },
        {
          title: 'Why we collect data',
          content: 'Data is collected solely for the purpose of providing health consultation. We use this information to analyze your condition and prepare recommendations. Data is not used for automated decision-making or profiling.',
        },
        {
          title: 'Where data is sent',
          content: 'Data is sent to a Telegram bot through the official Telegram API. The message with your questionnaire is sent to a secure chat for processing by a consultant. Telegram processes data in accordance with applicable data protection laws.',
        },
        {
          title: 'How long data is stored',
          content: 'Data is stored in the Telegram chat until the consultation is completed or until you withdraw your consent. After completion of the consultation or withdrawal of consent, you can request deletion of your data. We will delete your data within 30 days of the request.',
        },
        {
          title: 'Your rights',
          content: 'In accordance with GDPR, you have the right to: access your data (Art. 15 GDPR), correct it (Art. 16 GDPR), delete it (Art. 17 GDPR), restrict processing (Art. 18 GDPR), data portability (Art. 20 GDPR), and object to processing (Art. 21 GDPR). You can withdraw your consent to data processing at any time without affecting the lawfulness of processing based on consent before its withdrawal.',
        },
        {
          title: 'Right to lodge a complaint',
          content: 'You have the right to lodge a complaint with a data protection supervisory authority if you believe that the processing of your personal data violates GDPR. In Germany, this is the Federal Commissioner for Data Protection and Freedom of Information (BfDI).',
        },
        {
          title: 'How to exercise your rights',
          content: 'To exercise your rights (access, correction, deletion, etc.), contact us via Telegram or Instagram, providing your name and the date you filled out the questionnaire. We will process your request within 30 days of receipt.',
        },
      ],
    },
    de: {
      title: 'Datenschutzerklärung',
      sections: [
        {
          title: 'Verantwortlicher',
          content: 'Verantwortlicher für die Datenverarbeitung ist die Person, die die Gesundheitsberatung durchführt. Für Anfragen zur Datenverarbeitung kontaktieren Sie uns bitte über die in der Umfrage angegebenen Kontaktdaten.',
        },
        {
          title: 'Rechtsgrundlage der Verarbeitung',
          content: 'Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage Ihrer freiwilligen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Einwilligung jederzeit widerrufen.',
        },
        {
          title: 'Welche Daten wir sammeln',
          content: 'Wir sammeln personenbezogene Daten, die Sie im Fragebogen angeben: Name, Alter, Gewicht, Gesundheitsinformationen, Symptome, Beschwerden, Allergien, Krankengeschichte und Kontaktdaten (Telegram oder Instagram). Die Bereitstellung der Daten ist freiwillig, aber für die Beratung erforderlich.',
        },
        {
          title: 'Warum wir Daten sammeln',
          content: 'Daten werden ausschließlich für die Bereitstellung einer Gesundheitsberatung gesammelt. Wir verwenden diese Informationen zur Analyse Ihres Zustands und zur Vorbereitung von Empfehlungen. Die Daten werden nicht für automatisierte Entscheidungsfindung oder Profiling verwendet.',
        },
        {
          title: 'Wohin Daten gesendet werden',
          content: 'Daten werden über die offizielle Telegram-API an einen Telegram-Bot gesendet. Die Nachricht mit Ihrem Fragebogen wird an einen sicheren Chat zur Bearbeitung durch einen Berater gesendet. Telegram verarbeitet Daten in Übereinstimmung mit den geltenden Datenschutzgesetzen.',
        },
        {
          title: 'Wie lange Daten gespeichert werden',
          content: 'Daten werden im Telegram-Chat gespeichert, bis die Beratung abgeschlossen ist oder Sie Ihre Einwilligung widerrufen. Nach Abschluss der Beratung oder Widerruf der Einwilligung können Sie die Löschung Ihrer Daten anfordern. Wir löschen Ihre Daten innerhalb von 30 Tagen nach der Anfrage.',
        },
        {
          title: 'Ihre Rechte',
          content: 'Gemäß DSGVO haben Sie folgende Rechte: Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Sie können Ihre Einwilligung zur Datenverarbeitung jederzeit widerrufen, ohne dass die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung berührt wird.',
        },
        {
          title: 'Beschwerderecht',
          content: 'Sie haben das Recht, bei einer Datenschutzaufsichtsbehörde Beschwerde einzulegen, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt. In Deutschland ist dies der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI).',
        },
        {
          title: 'Wie Sie Ihre Rechte ausüben können',
          content: 'Um Ihre Rechte (Auskunft, Berichtigung, Löschung usw.) auszuüben, kontaktieren Sie uns über Telegram oder Instagram und geben Sie Ihren Namen und das Datum der Fragebogenausfüllung an. Wir bearbeiten Ihre Anfrage innerhalb von 30 Tagen nach Eingang.',
        },
      ],
    },
  };

  const policy = privacyPolicy[language];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            {policy.title}
          </DialogTitle>
          <DialogDescription>
            {language === 'ru'
              ? 'Информация о сборе и обработке персональных данных'
              : language === 'de'
              ? 'Informationen zur Erhebung und Verarbeitung personenbezogener Daten'
              : 'Information about collection and processing of personal data'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {policy.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">{section.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

