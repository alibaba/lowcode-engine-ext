import React, { useState } from 'react';
import { Switch, Input, Box } from '@alifd/next';
import { SettingTarget } from '@alilc/lowcode-types';

import './index.scss';

interface TitleSetterProps {
  field?: SettingTarget;
  prop?: SettingTarget;
  value: string;
  defaultValue: string;
  defaultChecked?: boolean;
  onChange: Function;
}

const TitleSetter = (props: TitleSetterProps) => {
  const { value, defaultValue, defaultChecked, onChange, field, prop } = props;
  const [checked, setChecked] = useState(defaultChecked);
  const target = field || prop;
  const theVal = target?.getHotValue?.() || defaultValue || value;

  const handleToggle = (vis: boolean) => {
    onChange?.(vis ? theVal : '');
    setChecked(vis);
  };
  const handleChangeText = (text: string) => {
    onChange?.(text);
  };

  return (
    <Box className="setter-title" direction="row" align="center" spacing={10}>
      <Switch size="small" checked={checked} onChange={handleToggle} />
      {checked && <Input size="small" value={theVal} onChange={handleChangeText} />}
    </Box>
  );
};

export default TitleSetter;
