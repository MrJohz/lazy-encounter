import React from 'react';
import { NoArgCallback } from '../../utils/jsx-props';
import { Square } from './Square';

import styles from './Back.css';

type Props = NoArgCallback<'onBack'>;

export function Back({onBack}: Props) {
    return <Square onClick={onBack} className={styles.back}>
        <div className={styles.icon}>
            <i className={'fas fa-arrow-left'}/>
            <div>Back</div>
        </div>
    </Square>;
}
