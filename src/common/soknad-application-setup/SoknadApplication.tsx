import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import '@formatjs/intl-numberformat/locale-data/nb';
import '@formatjs/intl-numberformat/locale-data/nn';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-pluralrules/locale-data/nb';
import '@formatjs/intl-pluralrules/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/nb';
import '@formatjs/intl-relativetimeformat/locale-data/nn';
import '@formatjs/intl-relativetimeformat/polyfill';
import AppStatusWrapper from '@navikt/sif-common-core/lib/components/app-status-wrapper/AppStatusWrapper';
import LanguageToggle from '@navikt/sif-common-core/lib/components/language-toggle/LanguageToggle';
import ApplicationMessages from '@navikt/sif-common-core/lib/dev-utils/intl/application-messages/ApplicationMessages';
import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from '@navikt/sif-common-core/lib/utils/localeUtils';
import getSentryLoggerForApp from '@navikt/sif-common-sentry';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import ErrorPage from '../soknad-common-pages/ErrorPage';
import SoknadErrorMessages from '../soknad-error-messages/SoknadErrorMessages';

interface AppStatusSanityConfig {
    projectId: string;
    dataset: string;
}

interface AppStatus {
    applicationKey: string;
    sanityConfig: AppStatusSanityConfig;
}
interface Props {
    /** App name - not visual to user */
    appName: string;
    /** Locale messages */
    intlMessages: MessageFileFormat;
    /** Key used in sentry logging for identifying the app in the logs */
    sentryKey?: string;
    /** Config for connecting to the appStatus sanity project */
    appStatus?: AppStatus;
    /** The content */
    children: React.ReactNode;
    /** Public path */
    publicPath: string;
}

const localeFromSessionStorage = getLocaleFromSessionStorage();
moment.locale(localeFromSessionStorage);

const isValidAppStatus = (appStatus: AppStatus | any): appStatus is AppStatus =>
    appStatus !== undefined &&
    appStatus.sanityConfig?.dataset !== undefined &&
    appStatus.sanityConfig?.projectId !== undefined;

const SoknadApplication = ({ intlMessages: messages, appName, sentryKey, appStatus, publicPath, children }: Props) => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    const localeMessages = messages[locale] || messages['nb'];
    const hasMultipleLocales = Object.keys(messages).length > 1;

    if (sentryKey) {
        getSentryLoggerForApp(sentryKey, [/sykdom-i-familien/]).init();
    }

    return (
        <Normaltekst tag="div">
            <IntlProvider locale={locale} messages={localeMessages}>
                {hasMultipleLocales && (
                    <LanguageToggle
                        locale={locale}
                        toggle={(activeLocale: Locale): void => {
                            setLocaleInSessionStorage(activeLocale);
                            setLocale(activeLocale);
                        }}
                    />
                )}
                <BrowserRouter basename={publicPath}>
                    {isValidAppStatus(appStatus) ? (
                        <AppStatusWrapper
                            applicationKey={appStatus.applicationKey}
                            sanityConfig={appStatus.sanityConfig}
                            contentRenderer={() => <>{children}</>}
                            unavailableContentRenderer={() => (
                                <ErrorPage contentRenderer={() => <SoknadErrorMessages.ApplicationUnavailable />} />
                            )}
                        />
                    ) : (
                        children
                    )}
                    <ApplicationMessages messages={messages} title={appName} />
                </BrowserRouter>
            </IntlProvider>
        </Normaltekst>
    );
};
export default SoknadApplication;
