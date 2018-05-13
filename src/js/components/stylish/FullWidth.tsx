import React, { MouseEvent } from 'react';
import classNames from 'classnames';

import { Children, childrenise, Callback, Optional, ClassName } from '../../utils/jsx-props';

import styles from './FullWidth.css';

type Props = Children
    & Optional<ClassName>
    & Optional<Callback<'onClick', MouseEvent<HTMLDivElement>>>;

export function FullWidth(props: Props) {
    const { children, className, ...rest } = props;

    const mergedClass = classNames(styles.fullWidth, className);

    return <div className={mergedClass} {...rest}>{
        childrenise(children)
    }</div>;
}
