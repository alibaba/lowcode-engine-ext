import React, { PureComponent } from 'react';
import { Input } from '@alifd/next';
import './index.less';

interface TextAreaSetterProps {
  onChange: (value: string) => undefined;
  value: string;
  defaultValue: string;
  placeholder: string;
}
interface TextAreaSetterState {
  setterValue: string | null;
}

export default class TextAreaSetter extends PureComponent<
  TextAreaSetterProps,
  TextAreaSetterState
> {
  static defaultPorps = {
    onChange: () => undefined,
    value: undefined,
    defaultValue: null as any,
    placeholder: '请输入',
  };
  static displayName = 'TextAreaSetter';

  state: TextAreaSetterState = {
    setterValue: null,
  };

  render() {
    const { onChange, placeholder, value } = this.props;
    return (
      <Input.TextArea
        value={value || ''}
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        style={{ width: '100%' }}
      />
    );
  }
}
