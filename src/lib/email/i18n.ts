export type EmailLocale = 'en' | 'ru' | 'tm';

export interface EmailStrings {
  contactConfirm: {
    subject:        (subject: string) => string;
    preheader:      string;
    title:          string;
    subtitle:       string;
    greeting:       (firstName: string, lastName: string) => string;
    intro:          string;
    summaryHeading: string;
    subjectLabel:   string;
    messageLabel:   string;
    whatNextHeading:string;
    step1:          string;
    step2:          (email: string) => string;
    step3:          string;
    ctaBtn:         string;
  };
  contactNotify: {
    subject:        (fullName: string, subject: string) => string;
    title:          string;
    subtitle:       (fullName: string, email: string) => string;
    firstNameLabel: string;
    lastNameLabel:  string;
    emailLabel:     string;
    phoneLabel:     string;
    subjectLabel:   string;
    messageHeading: string;
    replyBtn:       (firstName: string) => string;
  };
  vacancyConfirm: {
    subject:                (vacancyTitle: string) => string;
    preheader:              (vacancyTitle: string) => string;
    title:                  string;
    subtitle:               (vacancyTitle: string) => string;
    greeting:               (firstName: string, lastName: string) => string;
    intro:                  (vacancyTitle: string) => string;
    appliedPositionHeading: string;
    positionLabel:          string;
    companyLabel:           string;
    locationLabel:          string;
    companyValue:           string;
    locationValue:          string;
    whatNextHeading:        string;
    step1:                  string;
    step2:                  string;
    step3:                  string;
    ctaBtn:                 string;
  };
  vacancyNotify: {
    subject:        (vacancyTitle: string, fullName: string) => string;
    title:          string;
    subtitle:       (vacancyTitle: string) => string;
    firstNameLabel: string;
    lastNameLabel:  string;
    dobLabel:       string;
    emailLabel:     string;
    phoneLabel:     string;
    positionLabel:  string;
    cvLabel:        string;
    cvNote:         string;
    coverHeading:   string;
    replyBtn:       string;
  };
}

const en: EmailStrings = {
  contactConfirm: {
    subject:         (s) => `We received your message — RAHATLYK`,
    preheader:       `We've received your message and will be in touch soon.`,
    title:           `Message Received`,
    subtitle:        `Thank you for reaching out to RAHATLYK.`,
    greeting:        (f, l) => `Hi <strong>${f} ${l}</strong>,`,
    intro:           `Thank you for contacting us. We've received your message and one of our team members will get back to you as soon as possible.`,
    summaryHeading:  `Your Message Summary`,
    subjectLabel:    `Subject`,
    messageLabel:    `Message`,
    whatNextHeading: `What Happens Next`,
    step1:           `Our team reviews your message within <strong>1 business day</strong>.`,
    step2:           (e) => `We'll reply directly to <strong>${e}</strong> — be sure to check your inbox.`,
    step3:           `If your enquiry is urgent, call us at <strong>+993 12 000 000</strong>.`,
    ctaBtn:          `Visit Our Website →`,
  },
  contactNotify: {
    subject:         (n, s) => `[Contact Form] ${s} — ${n}`,
    title:           `New Contact Form Submission`,
    subtitle:        (n, e) => `From: ${n} &lt;${e}&gt;`,
    firstNameLabel:  `First Name`,
    lastNameLabel:   `Last Name`,
    emailLabel:      `Email`,
    phoneLabel:      `Phone`,
    subjectLabel:    `Subject`,
    messageHeading:  `Message`,
    replyBtn:        (n) => `Reply to ${n} →`,
  },
  vacancyConfirm: {
    subject:                (t) => `Application received — ${t} | RAHATLYK`,
    preheader:              (t) => `Your application for ${t} at RAHATLYK has been received.`,
    title:                  `Application Received`,
    subtitle:               (t) => `Position: ${t}`,
    greeting:               (f, l) => `Hi <strong>${f} ${l}</strong>,`,
    intro:                  (t) => `Thank you for your interest in joining RAHATLYK! We've received your application for the <strong style="color:#0e7490">${t}</strong> position and our HR team will review your CV carefully.`,
    appliedPositionHeading: `Applied Position`,
    positionLabel:          `Position`,
    companyLabel:           `Company`,
    locationLabel:          `Location`,
    companyValue:           `RAHATLYK — Pure. Natural. Life.`,
    locationValue:          `Ashgabat, Turkmenistan`,
    whatNextHeading:        `What Happens Next`,
    step1:                  `Our HR team reviews your CV and cover letter within <strong>3–5 business days</strong>.`,
    step2:                  `If you're shortlisted, we'll reach out to schedule an interview.`,
    step3:                  `Check your email regularly — we'll contact you at the address you provided.`,
    ctaBtn:                 `View Other Openings →`,
  },
  vacancyNotify: {
    subject:        (t, n) => `[Application] ${t} — ${n}`,
    title:          `New Job Application`,
    subtitle:       (t) => `Position: ${t}`,
    firstNameLabel: `First Name`,
    lastNameLabel:  `Last Name`,
    dobLabel:       `Date of Birth`,
    emailLabel:     `Email`,
    phoneLabel:     `Phone`,
    positionLabel:  `Position`,
    cvLabel:        `CV File`,
    cvNote:         `(attached to HR email)`,
    coverHeading:   `Cover Letter`,
    replyBtn:       `Reply to Applicant →`,
  },
};

const ru: EmailStrings = {
  contactConfirm: {
    subject:         () => `Мы получили ваше сообщение — RAHATLYK`,
    preheader:       `Мы получили ваше сообщение и скоро свяжемся с вами.`,
    title:           `Сообщение получено`,
    subtitle:        `Благодарим за обращение в RAHATLYK.`,
    greeting:        (f, l) => `Здравствуйте, <strong>${f} ${l}</strong>,`,
    intro:           `Спасибо за обращение. Мы получили ваше сообщение, и один из наших специалистов свяжется с вами в ближайшее время.`,
    summaryHeading:  `Сводка вашего сообщения`,
    subjectLabel:    `Тема`,
    messageLabel:    `Сообщение`,
    whatNextHeading: `Что происходит дальше`,
    step1:           `Наша команда рассмотрит ваше сообщение в течение <strong>1 рабочего дня</strong>.`,
    step2:           (e) => `Мы ответим напрямую на <strong>${e}</strong> — обязательно проверьте почту.`,
    step3:           `Если вопрос срочный, позвоните нам: <strong>+993 12 000 000</strong>.`,
    ctaBtn:          `Посетить наш сайт →`,
  },
  contactNotify: {
    subject:         (n, s) => `[Форма обратной связи] ${s} — ${n}`,
    title:           `Новая заявка с формы обратной связи`,
    subtitle:        (n, e) => `От: ${n} &lt;${e}&gt;`,
    firstNameLabel:  `Имя`,
    lastNameLabel:   `Фамилия`,
    emailLabel:      `Эл. почта`,
    phoneLabel:      `Телефон`,
    subjectLabel:    `Тема`,
    messageHeading:  `Сообщение`,
    replyBtn:        (n) => `Ответить ${n} →`,
  },
  vacancyConfirm: {
    subject:                (t) => `Заявка получена — ${t} | RAHATLYK`,
    preheader:              (t) => `Ваша заявка на должность ${t} в RAHATLYK получена.`,
    title:                  `Заявка получена`,
    subtitle:               (t) => `Должность: ${t}`,
    greeting:               (f, l) => `Здравствуйте, <strong>${f} ${l}</strong>,`,
    intro:                  (t) => `Спасибо за интерес к работе в RAHATLYK! Мы получили вашу заявку на должность <strong style="color:#0e7490">${t}</strong> и наш HR-отдел внимательно изучит ваше резюме.`,
    appliedPositionHeading: `Желаемая должность`,
    positionLabel:          `Должность`,
    companyLabel:           `Компания`,
    locationLabel:          `Местоположение`,
    companyValue:           `RAHATLYK — Чисто. Натурально. Жизнь.`,
    locationValue:          `Ашхабад, Туркменистан`,
    whatNextHeading:        `Что происходит дальше`,
    step1:                  `Наш HR-отдел рассмотрит ваше резюме и сопроводительное письмо в течение <strong>3–5 рабочих дней</strong>.`,
    step2:                  `Если вы пройдёте отбор, мы свяжемся с вами для собеседования.`,
    step3:                  `Регулярно проверяйте почту — мы напишем на адрес, который вы указали.`,
    ctaBtn:                 `Другие вакансии →`,
  },
  vacancyNotify: {
    subject:        (t, n) => `[Заявка] ${t} — ${n}`,
    title:          `Новая заявка на вакансию`,
    subtitle:       (t) => `Должность: ${t}`,
    firstNameLabel: `Имя`,
    lastNameLabel:  `Фамилия`,
    dobLabel:       `Дата рождения`,
    emailLabel:     `Эл. почта`,
    phoneLabel:     `Телефон`,
    positionLabel:  `Должность`,
    cvLabel:        `Файл резюме`,
    cvNote:         `(прикреплено к письму HR)`,
    coverHeading:   `Сопроводительное письмо`,
    replyBtn:       `Ответить кандидату →`,
  },
};

const tm: EmailStrings = {
  contactConfirm: {
    subject:         () => `Habatyňyzy aldyk — RAHATLYK`,
    preheader:       `Habatyňyzy aldyk, gysga wagtda jogap bereris.`,
    title:           `Habar Alyndy`,
    subtitle:        `RAHATLYK bilen habarlaşandygyňyz üçin sagboluň.`,
    greeting:        (f, l) => `Salam, <strong>${f} ${l}</strong>,`,
    intro:           `Bize ýüz tutandygyňyz üçin sagboluň. Habatyňyzy aldyk we toparymyzyň bir agzasy gysga wagtda size jogap berer.`,
    summaryHeading:  `Habar Jemi`,
    subjectLabel:    `Tema`,
    messageLabel:    `Habar`,
    whatNextHeading: `Mundan Soň Näme Bolar`,
    step1:           `Toparymyz habatyňyzy <strong>1 iş gününiň</strong> dowamynda seredip çykar.`,
    step2:           (e) => `Jogabymyzy göni <strong>${e}</strong> adresinize ibereris — gelen gutularyňyzy barlaň.`,
    step3:           `Sorawyňyz gyssagly bolsa, bize jaň ediň: <strong>+993 12 000 000</strong>.`,
    ctaBtn:          `Saýtymyzy Görmek →`,
  },
  contactNotify: {
    subject:         (n, s) => `[Habar Formy] ${s} — ${n}`,
    title:           `Täze Habar Formy Doldurylyp Iberildi`,
    subtitle:        (n, e) => `Kimden: ${n} &lt;${e}&gt;`,
    firstNameLabel:  `Ady`,
    lastNameLabel:   `Familiýasy`,
    emailLabel:      `E-poçta`,
    phoneLabel:      `Telefon`,
    subjectLabel:    `Tema`,
    messageHeading:  `Habar`,
    replyBtn:        (n) => `${n}-a Jogap Beriň →`,
  },
  vacancyConfirm: {
    subject:                (t) => `Arza kabul edildi — ${t} | RAHATLYK`,
    preheader:              (t) => `RAHATLYK-da ${t} wezipesi üçin arzaňyz kabul edildi.`,
    title:                  `Arza Kabul Edildi`,
    subtitle:               (t) => `Wezipe: ${t}`,
    greeting:               (f, l) => `Salam, <strong>${f} ${l}</strong>,`,
    intro:                  (t) => `RAHATLYK-a goşulmaga gyzyklanandygyňyz üçin sagboluň! <strong style="color:#0e7490">${t}</strong> wezipesi üçin arzaňyzy aldyk we HR toparymyz rezýumäňizi üns bilen seredip çykar.`,
    appliedPositionHeading: `Başvurylan Wezipe`,
    positionLabel:          `Wezipe`,
    companyLabel:           `Kompaniýa`,
    locationLabel:          `Ýerleşişi`,
    companyValue:           `RAHATLYK — Arassa. Tebigy. Durmuş.`,
    locationValue:          `Aşgabat, Türkmenistan`,
    whatNextHeading:        `Mundan Soň Näme Bolar`,
    step1:                  `HR toparymyz rezýumäňizi <strong>3–5 iş gününiň</strong> dowamynda seredip çykar.`,
    step2:                  `Saýlansaňyz, söhbetdeşlik üçin sizinle habarlaşarys.`,
    step3:                  `E-poçtaňyzy yzygiderli barlaň — görkezilen adresinize habar ibereris.`,
    ctaBtn:                 `Beýleki Wezipeleri Görmek →`,
  },
  vacancyNotify: {
    subject:        (t, n) => `[Arza] ${t} — ${n}`,
    title:          `Täze Iş Arzasy`,
    subtitle:       (t) => `Wezipe: ${t}`,
    firstNameLabel: `Ady`,
    lastNameLabel:  `Familiýasy`,
    dobLabel:       `Doglan senesi`,
    emailLabel:     `E-poçta`,
    phoneLabel:     `Telefon`,
    positionLabel:  `Wezipe`,
    cvLabel:        `Rezýume faýly`,
    cvNote:         `(HR e-poçtasyna goşuldy)`,
    coverHeading:   `Üstki hat`,
    replyBtn:       `Dalaşgäre Jogap Beriň →`,
  },
};

export const emailI18n: Record<EmailLocale, EmailStrings> = { en, ru, tm };
