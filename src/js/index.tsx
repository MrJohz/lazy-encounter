// polyfills first!
import 'abortcontroller-polyfill';
import { useStrict } from 'mobx';

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';

useStrict(true);

ReactDOM.render(
    <App/>,
    document.getElementById('hub'));
