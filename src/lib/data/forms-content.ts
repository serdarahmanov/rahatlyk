type L = { en: string; ru: string; tm: string }

export const FORMS_CONTENT = {
  commonFields: {
    labels: {
      firstName: { en: 'First name', ru: 'Имя',       tm: 'At'       } satisfies L,
      lastName:  { en: 'Last name',  ru: 'Фамилия',    tm: 'Familiýa' } satisfies L,
      email:     { en: 'Email',      ru: 'Эл. почта',  tm: 'E-poçta'  } satisfies L,
      phone:     { en: 'Phone',      ru: 'Телефон',    tm: 'Telefon'  } satisfies L,
    },
    placeholders: {
      firstName: { en: 'John',             ru: 'Иван',             tm: 'Aşyr'         } satisfies L,
      lastName:  { en: 'Smith',            ru: 'Иванов',           tm: 'Orazow'       } satisfies L,
      email:     { en: 'you@example.com',  ru: 'ivan@example.com', tm: 'ashyr@mysal.com' } satisfies L,
      phone:     { en: '+993 ...',         ru: '+993 ...',         tm: '+993 ...'     } satisfies L,
    },
  },

  contactForm: {
    labels: {
      subject:      { en: 'Subject',  ru: 'Тема',        tm: 'Tema'     } satisfies L,
      message:      { en: 'Message',  ru: 'Сообщение',   tm: 'Habar'    } satisfies L,
      submitButton: { en: 'Send',     ru: 'Отправить',   tm: 'Ibermek'  } satisfies L,
    },
    placeholders: {
      subject: {
        en: 'What is this about?',
        ru: 'Чем можем помочь?',
        tm: 'Nädip kömek edip bileris?',
      } satisfies L,
      message: {
        en: 'Your message…',
        ru: 'Ваше сообщение…',
        tm: 'Habaryňyz…',
      } satisfies L,
    },
    messages: {
      success: {
        en: "Your message has been sent! We'll be in touch soon.",
        ru: 'Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.',
        tm: 'Habatyňyz iberildi! Ýakyn wagtda siziň bilen habarlaşarys.',
      } satisfies L,
      error: {
        en: 'Something went wrong. Please try again.',
        ru: 'Произошла ошибка. Пожалуйста, попробуйте ещё раз.',
        tm: 'Näsazlyk ýüze çykdy. Gaýtadan synanyşyň.',
      } satisfies L,
      sending: {
        en: 'Sending…',
        ru: 'Отправляется…',
        tm: 'Iberilýär…',
      } satisfies L,
      thankYou: {
        en: "Thanks {name} — we'll be in touch at {email}.",
        ru: 'Спасибо, {name} — мы свяжемся с вами по адресу {email}.',
        tm: 'Sag boluň, {name} — {email} arkaly siziň bilen habarlaşarys.',
      } satisfies L,
      whatHappensNext: {
        en: 'What happens next',
        ru: 'Что будет дальше',
        tm: 'Mundan soň näme bolar',
      } satisfies L,
      step1: {
        en: 'Our team reviews your message within 1 business day.',
        ru: 'Наша команда рассмотрит ваше сообщение в течение 1 рабочего дня.',
        tm: 'Toparymyz habatyňyzy 1 iş günüň dowamynda gözden geçirer.',
      } satisfies L,
      step2: {
        en: "We'll reply directly to {email}.",
        ru: 'Мы ответим напрямую на {email}.',
        tm: '{email} adresine göni jogap bereris.',
      } satisfies L,
      step3: {
        en: 'For urgent enquiries call {phone}.',
        ru: 'По срочным вопросам звоните {phone}.',
        tm: 'Gyssagly ýagdaýlarda {phone} belgä jaň ediň.',
      } satisfies L,
      sendAnother: {
        en: 'Send Another Message',
        ru: 'Отправить ещё одно сообщение',
        tm: 'Ýene bir habar iberiň',
      } satisfies L,
    },
  },

  contactForm_errors: {
    requiredFields:  { en: 'Name, email, subject and message are required.',     ru: 'Имя, эл. почта, тема и сообщение обязательны.',                          tm: 'At, e-poçta, tema we habar hökmandyr.'                                  } satisfies L,
    emailInvalid:    { en: 'Invalid email address.',                             ru: 'Неверный адрес эл. почты.',                                               tm: 'Nädogry e-poçta salgysy.'                                               } satisfies L,
    nameTooLong:     { en: 'Name is too long.',                                  ru: 'Имя слишком длинное.',                                                    tm: 'At gaty uzyn.'                                                          } satisfies L,
    emailTooLong:    { en: 'Email address is too long.',                         ru: 'Адрес эл. почты слишком длинный.',                                         tm: 'E-poçta salgysy gaty uzyn.'                                             } satisfies L,
    phoneTooLong:    { en: 'Phone number is too long.',                          ru: 'Номер телефона слишком длинный.',                                          tm: 'Telefon belgisi gaty uzyn.'                                             } satisfies L,
    subjectTooLong:  { en: 'Subject must be under 200 characters.',              ru: 'Тема должна содержать не более 200 символов.',                            tm: 'Tema 200 harpdan az bolmaly.'                                           } satisfies L,
    messageTooLong:  { en: 'Message must be under 5 000 characters.',            ru: 'Сообщение должно содержать не более 5 000 символов.',                     tm: 'Habar 5 000 harpdan az bolmaly.'                                        } satisfies L,
    serverError:     { en: 'Failed to send message. Please try again later.',    ru: 'Не удалось отправить сообщение. Повторите попытку позже.',                 tm: 'Habar iberip bolmady. Biraz soňra gaýtadan synanyşyň.'                  } satisfies L,
  },

  vacancyForm_errors: {
    requiredFields:    { en: 'Name, email, date of birth and vacancy are required.',           ru: 'Имя, эл. почта, дата рождения и вакансия обязательны.',                       tm: 'At, e-poçta, doglan senesi we wezipe hökmandyr.'                                  } satisfies L,
    emailInvalid:      { en: 'Invalid email address.',                                         ru: 'Неверный адрес эл. почты.',                                                    tm: 'Nädogry e-poçta salgysy.'                                                         } satisfies L,
    vacancyInvalid:    { en: 'Invalid vacancy.',                                               ru: 'Неверная вакансия.',                                                            tm: 'Nädogry wezipe.'                                                                  } satisfies L,
    nameTooLong:       { en: 'Name is too long.',                                              ru: 'Имя слишком длинное.',                                                          tm: 'At gaty uzyn.'                                                                    } satisfies L,
    emailTooLong:      { en: 'Email address is too long.',                                     ru: 'Адрес эл. почты слишком длинный.',                                              tm: 'E-poçta salgysy gaty uzyn.'                                                       } satisfies L,
    phoneTooLong:      { en: 'Phone number is too long.',                                      ru: 'Номер телефона слишком длинный.',                                               tm: 'Telefon belgisi gaty uzyn.'                                                       } satisfies L,
    dobInvalid:        { en: 'Invalid date of birth.',                                         ru: 'Неверная дата рождения.',                                                       tm: 'Nädogry doglan senesi.'                                                           } satisfies L,
    coverTooLong:      { en: 'Cover letter must be under 5 000 characters.',                   ru: 'Сопроводительное письмо не должно превышать 5 000 символов.',                  tm: 'Ýüz tutma haty 5 000 harpdan az bolmaly.'                                         } satisfies L,
    cvRequired:        { en: 'CV file is required.',                                           ru: 'Файл резюме обязателен.',                                                       tm: 'Rezýume faýly hökmandyr.'                                                         } satisfies L,
    cvTypeInvalid:     { en: 'CV must be a PDF, DOC or DOCX file.',                            ru: 'Резюме должно быть в формате PDF, DOC или DOCX.',                               tm: 'Rezýume PDF, DOC ýa-da DOCX formatynda bolmaly.'                                  } satisfies L,
    cvTooLarge:        { en: 'CV file must be under 2 MB.',                                    ru: 'Размер файла резюме не должен превышать 2 МБ.',                                 tm: 'Rezýume faýlynyň ölçegi 2 MB-dan az bolmaly.'                                     } satisfies L,
    cvContentMismatch: { en: 'CV file content does not match its declared type.',              ru: 'Содержимое файла резюме не соответствует заявленному типу.',                    tm: 'Rezýume faýlynyň mazmuny onuň görnüşine laýyk gelmeýär.'                          } satisfies L,
    serverError:       { en: 'Failed to submit application. Please try again later.',          ru: 'Не удалось отправить заявку. Повторите попытку позже.',                         tm: 'Arza iberip bolmady. Biraz soňra gaýtadan synanyşyň.'                             } satisfies L,
  },

  vacancyForm: {
    labels: {
      formTitle: {
        en: 'Apply for this Position',
        ru: 'Подать заявку на эту должность',
        tm: 'Bu wezipä arza bermek',
      } satisfies L,
      applyButton: {
        en: 'Apply for This Role',
        ru: 'Откликнуться',
        tm: 'Bu wezipä arza bermek',
      } satisfies L,
      dateOfBirth: {
        en: 'Date of birth',
        ru: 'Дата рождения',
        tm: 'Doglan senesi',
      } satisfies L,
      cv: {
        en: 'CV / Resume',
        ru: 'Резюме',
        tm: 'Rezýume',
      } satisfies L,
      coverLetter: {
        en: 'Cover letter',
        ru: 'Сопроводительное письмо',
        tm: 'Ýüz tutma haty',
      } satisfies L,
      submitButton: {
        en: 'Submit Application',
        ru: 'Подать заявку',
        tm: 'Arza ibermek',
      } satisfies L,
    },
    placeholders: {
      coverLetter: {
        en: "Tell us why you're a great fit…",
        ru: 'Расскажите, почему вы подходите для этой должности…',
        tm: 'Bu wezipä näme üçin laýyk gelýändigiňizi aýdyň…',
      } satisfies L,
    },
    upload: {
      clickToUpload: {
        en: 'Click to upload',
        ru: 'Нажмите для загрузки',
        tm: 'Ýüklemek üçin basyň',
      } satisfies L,
      dragAndDrop: {
        en: 'or drag and drop',
        ru: 'или перетащите файл',
        tm: 'ýa-da süýräp goýuň',
      } satisfies L,
      hint: {
        en: 'PDF, DOC, DOCX — up to 2 MB',
        ru: 'PDF, DOC, DOCX — до 2 МБ',
        tm: 'PDF, DOC, DOCX — 2 MB çenli',
      } satisfies L,
    },
    messages: {
      successHeading: {
        en: 'Application Submitted',
        ru: 'Заявка отправлена',
        tm: 'Arza iberildi',
      } satisfies L,
      successThankYou: {
        en: 'Thanks {name} — a confirmation has been sent to {email}.',
        ru: 'Спасибо, {name} — подтверждение отправлено на {email}.',
        tm: 'Sag boluň, {name} — tassyklama {email} adresine iberildi.',
      } satisfies L,
      whatHappensNext: {
        en: 'What happens next',
        ru: 'Что будет дальше',
        tm: 'Mundan soň näme bolar',
      } satisfies L,
      step1: {
        en: 'Our HR team reviews your CV within 3–5 business days.',
        ru: 'Наш HR-отдел рассмотрит ваше резюме в течение 3–5 рабочих дней.',
        tm: 'HR toparymyz rezýumäňizi 3–5 iş günüň dowamynda gözden geçirer.',
      } satisfies L,
      step2: {
        en: "If shortlisted, we'll reach out to schedule an interview.",
        ru: 'Если вы войдёте в список кандидатов, мы свяжемся с вами для назначения собеседования.',
        tm: 'Dalaşgärler sanawyna girseniňiz, söhbetdeşlik bellemek üçin siziň bilen habarlaşarys.',
      } satisfies L,
      step3: {
        en: 'Check {email} — that\'s where we\'ll contact you.',
        ru: 'Следите за почтой {email} — мы напишем туда.',
        tm: '{email} adresini barlaň — biziň habarymyz şol ýere geler.',
      } satisfies L,
      submitting: {
        en: 'Submitting…',
        ru: 'Отправляется…',
        tm: 'Iberilýär…',
      } satisfies L,
      submitAnother: {
        en: 'Submit Another Application',
        ru: 'Подать ещё одну заявку',
        tm: 'Ýene bir arza ibermek',
      } satisfies L,
      error: {
        en: 'Something went wrong. Please try again later.',
        ru: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
        tm: 'Näsazlyk ýüze çykdy. Biraz soňra gaýtadan synanyşyň.',
      } satisfies L,
    },
  },
}
