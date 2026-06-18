type LocalizedText = { en: string; ru: string; tm: string }

export const ABOUT_CONTENT: {
  hero: { title: LocalizedText; description: LocalizedText }
  formLabels: {
    firstName: LocalizedText
    lastName: LocalizedText
    email: LocalizedText
    phone: LocalizedText
    subject: LocalizedText
    message: LocalizedText
    submitButton: LocalizedText
  }
  formMessages: {
    success: LocalizedText
    error: LocalizedText
    sending: LocalizedText
    thankYou: LocalizedText
    whatHappensNext: LocalizedText
    step1: LocalizedText
    step2: LocalizedText
    step3: LocalizedText
    sendAnother: LocalizedText
  }
  formPlaceholders: {
    firstName: LocalizedText
    lastName: LocalizedText
    email: LocalizedText
    phone: LocalizedText
    subject: LocalizedText
    message: LocalizedText
  }
} = {
  hero: {
    title: {
      en: "We'd Love to Hear From You",
      ru: 'Мы будем рады услышать от вас',
      tm: 'Siziň fikiriňizi bilmek isleýäris',
    },
    description: {
      en: "We are as passionate about your experience as we are about the purity of each and every RAHATLYK bottle. We rely on our connection with you — whatever you need, we'll be only too happy to help.",
      ru: 'Нам так же важен ваш опыт, как и чистота каждой бутылки RAHATLYK. Мы ценим нашу связь с вами — что бы вам ни понадобилось, мы будем рады помочь.',
      tm: "Siziň tejribäňiz biziň üçin RAHATLYK-yň her çüýşesiniň arassalygy ýaly gymmatly. Siziň bilen aragatnaşygymyza gymmat berýäris — size näme gerek bolsa, kömek etmäge şat bolarys.",
    },
  },
  formLabels: {
    firstName: { en: 'First name', ru: 'Имя',      tm: 'At'        },
    lastName:  { en: 'Last name',  ru: 'Фамилия',   tm: 'Familiýa'  },
    email:     { en: 'Email',      ru: 'Эл. почта', tm: 'E-poçta'   },
    phone:     { en: 'Phone',      ru: 'Телефон',   tm: 'Telefon'   },
    subject:   { en: 'Subject',    ru: 'Тема',      tm: 'Tema'      },
    message:      { en: 'Message',  ru: 'Сообщение',  tm: 'Habar'      },
    submitButton: { en: 'Send',     ru: 'Отправить',  tm: 'Ibermek'    },
  },
  formMessages: {
    success: {
      en: "Your message has been sent! We'll be in touch soon.",
      ru: 'Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.',
      tm: 'Habatyňyz iberildi! Ýakyn wagtda siziň bilen habarlaşarys.',
    },
    error: {
      en: 'Something went wrong. Please try again.',
      ru: 'Произошла ошибка. Пожалуйста, попробуйте ещё раз.',
      tm: 'Näsazlyk ýüze çykdy. Gaýtadan synanyşyň.',
    },
    sending: {
      en: 'Sending…',
      ru: 'Отправляется…',
      tm: 'Iberilýär…',
    },
    thankYou: {
      en: "Thanks {name} — we'll be in touch at {email}.",
      ru: 'Спасибо, {name} — мы свяжемся с вами по адресу {email}.',
      tm: 'Sag boluň, {name} — {email} arkaly siziň bilen habarlaşarys.',
    },
    whatHappensNext: {
      en: 'What happens next',
      ru: 'Что будет дальше',
      tm: 'Mundan soň näme bolar',
    },
    step1: {
      en: 'Our team reviews your message within 1 business day.',
      ru: 'Наша команда рассмотрит ваше сообщение в течение 1 рабочего дня.',
      tm: 'Toparymyz habatyňyzy 1 iş günüň dowamynda gözden geçirer.',
    },
    step2: {
      en: "We'll reply directly to {email}.",
      ru: 'Мы ответим напрямую на {email}.',
      tm: '{email} adresine göni jogap bereris.',
    },
    step3: {
      en: 'For urgent enquiries call {phone}.',
      ru: 'По срочным вопросам звоните {phone}.',
      tm: 'Gyssagly ýagdaýlarda {phone} belgä jaň ediň.',
    },
    sendAnother: {
      en: 'Send Another Message',
      ru: 'Отправить ещё одно сообщение',
      tm: 'Ýene bir habar iberiň',
    },
  },
  formPlaceholders: {
    firstName: { en: 'John',                    ru: 'Иван',                     tm: 'Aşyr'                  },
    lastName:  { en: 'Smith',                   ru: 'Иванов',                   tm: 'Orazow'                },
    email:     { en: 'you@example.com',         ru: 'ivan@example.com',         tm: 'ashyr@mysal.com'       },
    phone:     { en: '+993 ...',                ru: '+993 ...',                 tm: '+993 ...'              },
    subject:   { en: 'What is this about?',     ru: 'Чем можем помочь?',        tm: 'Nädip kömek edip bileris?' },
    message:   { en: 'Your message…',           ru: 'Ваше сообщение…',          tm: 'Habaryňyz…'            },
  },
}
