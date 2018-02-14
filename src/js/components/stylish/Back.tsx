import React from 'react';
import { NoArgCallback } from '../../utils/jsx-props';
import { Square } from './Square';

type Props = NoArgCallback<'onBack'>;

export function Back({onBack}: Props) {
    return <Square onClick={onBack}>Back Button</Square>;
}
