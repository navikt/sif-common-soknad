import React from 'react';
import '@formatjs/intl-pluralrules/polyfill';
import 'nav-frontend-skjema-style';
import { Normaltekst } from 'nav-frontend-typografi';
require('@formatjs/intl-pluralrules/locale-data/nb');
require('@formatjs/intl-pluralrules/locale-data/nn');

const App = () => {
    return <Normaltekst tag="div">Init @navikt/sif-common-soknad</Normaltekst>;
};

export default App;
