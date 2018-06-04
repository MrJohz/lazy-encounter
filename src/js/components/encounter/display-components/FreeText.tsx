import React, { StatelessComponent } from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './FreeText.scss';

type FreeTextProps = { text: string }

export const FreeText: StatelessComponent<FreeTextProps> = ({ text }: FreeTextProps) => {
    return <div className={styles.freeText}><ReactMarkdown source={text} /></div>;
};
