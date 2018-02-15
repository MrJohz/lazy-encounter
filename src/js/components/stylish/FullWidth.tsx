import React, { MouseEvent } from 'react';
import classNames from 'classnames';

import { Children, childrenise, Callback, Optional, ClassName, NoArgCallback } from '../../utils/jsx-props';

import styles from './FullWidth.css';

type Props = Children
    & Optional<NoArgCallback<'onBack'>>
    & Optional<ClassName>
    & Optional<Callback<'onClick', MouseEvent<HTMLDivElement>>>;

export function FullWidth(props: Props) {
    const { children, className, onBack, ...rest } = props;

    const mergedClass = classNames(styles.fullWidth, className);

    return <div className={mergedClass} {...rest}>{
        onBack
            ? <div onClick={onBack} className={styles.backButton}>&lt;- BACK &lt;-</div>
            : undefined
    }{
        childrenise(children)
    }</div>;
}
