import lipsum from 'lorem-ipsum';
import React, { StatelessComponent } from 'react';
import { Children, noBubble, noop, Callback } from '../../utils/jsx-props';

import styles from './Modal.scss';

export type Response =
    | number
    | null

type ModalProps =
    & Callback<'onClose', Response>
    & { open: boolean }
    & Children

export const Modal: StatelessComponent<ModalProps> = ({ open, children, onClose }: ModalProps) => {
    if (!open) return null;

    const cancelCallback = () => onClose(null);

    return <>
        <div className={styles.modal} onClick={noBubble(noop)}>{children}
            {lipsum({ count: 5, units: 'paragraphs' }).split('\n\n').map((p, id) => <p key={id}>{p}</p>)}
        </div>
        <div className={styles.modalBackground} onClick={cancelCallback}/>
    </>;
};
