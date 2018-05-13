import React from 'react';
import classNames from 'classnames';
import { ShortcutKeys } from '../../shorty/react';

export { Back } from './Back';
export { FullWidth } from './FullWidth';
export { Popup, PopupItem } from './Popup';
export { Square } from './Square';

import styles from './index.css';

// TODO: try and get rid of some of these 'any' types
export function StylishComponent(name: string, Component: any) {
    const styleClass = styles[name];

    return function (props: any) {
        const { className: newClassName, otherProps } = props;
        const className = classNames(styleClass, newClassName);
        return <Component className={className} {...otherProps} />;
    };
}

export const StylishShortcutKeys = StylishComponent('shortcut', ShortcutKeys);
