import { Input } from '@alifd/next';
import { InputProps } from '@alifd/next/types/input';
import React, { FC } from 'react';
import { isCssVarBind } from '../../utils';

const LayoutInput: FC<InputProps> = (props) => {
  const { value } = props;
  if (isCssVarBind(value)) {
    return null
  }
  return <Input {...props} />;
};

export default LayoutInput;
