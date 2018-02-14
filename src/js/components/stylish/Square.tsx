import React, { MouseEvent } from 'react';

import { Children, childrenise, Callback, Optional, ClassName } from '../../utils/jsx-props';

import styles from './Square.css';
import classNames from 'classnames';

type Props = Children
    & Optional<ClassName>
    & Optional<Callback<'onClick', MouseEvent<HTMLDivElement>>>;

export function Square(props: Props) {
    const { children, className, ...rest } = props;

    const mergedClass = classNames(styles.square, className);

    return <div className={mergedClass} {...rest}>{
        childrenise(children)
    }</div>;
}
