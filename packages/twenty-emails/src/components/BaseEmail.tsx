import { i18n, Messages } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Container, Html } from '@react-email/components';
import { PropsWithChildren } from 'react';

import { BaseHead } from 'src/components/BaseHead';
import { Logo } from 'src/components/Logo';
import { APP_LOCALES, SOURCE_LOCALE } from 'twenty-shared';
import { messages as enMessages } from '../locales/generated/en';
import { messages as faMessages } from '../locales/generated/fa-IR';


type BaseEmailProps = PropsWithChildren<{
  width?: number;
  locale: keyof typeof APP_LOCALES;
}>;

const messages: Record<keyof typeof APP_LOCALES, Messages> = {
  en: enMessages,
  'fa-IR': faMessages,
};

(Object.entries(messages) as [keyof typeof APP_LOCALES, any][]).forEach(
  ([locale, message]) => {
    i18n.load(locale, message);
  },
);

i18n.activate(SOURCE_LOCALE);

export const BaseEmail = ({ children, width, locale }: BaseEmailProps) => {
  i18n.activate(locale);

  return (
    <I18nProvider i18n={i18n}>
      <Html lang={locale}>
        <BaseHead />
        <Container width={width || 290}>
          <Logo />
          {children}
        </Container>
      </Html>
    </I18nProvider>
  );
};
