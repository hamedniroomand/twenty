import { Injectable, OnModuleInit } from '@nestjs/common';

import { i18n } from '@lingui/core';
import { APP_LOCALES, SOURCE_LOCALE } from 'twenty-shared';

import { messages as enMessages } from 'src/engine/core-modules/i18n/locales/generated/en';
import { messages as faMessages } from 'src/engine/core-modules/i18n/locales/generated/fa-IR';

@Injectable()
export class I18nService implements OnModuleInit {
  async loadTranslations() {
    const messages: Record<keyof typeof APP_LOCALES, any> = {
      en: enMessages,
      'fa-IR': faMessages,
    };

    (Object.entries(messages) as [keyof typeof APP_LOCALES, any][]).forEach(
      ([locale, message]) => {
        i18n.load(locale, message);
      },
    );

    i18n.activate(SOURCE_LOCALE);
  }

  async onModuleInit() {
    this.loadTranslations();
  }
}
