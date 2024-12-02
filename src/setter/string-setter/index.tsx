import * as React from 'react';
import { Input } from '@alifd/next';
import './index.less';

interface StringSetterProps {
  isPreview?: boolean;
  hasBorder?: boolean;
  value: string;
  defaultValue: string;
  placeholder: string;
  onChange: (val: string) => void;
}

export default class StringSetter extends React.PureComponent<StringSetterProps, any> {
  static displayName = 'StringSetter';

  render() {
    const { onChange, placeholder, value, isPreview = false, hasBorder = true } = this.props;
    return (
      <Input
        isPreview={isPreview}
        hasBorder={hasBorder}
        size="small"
        value={value}
        placeholder={placeholder || ''}
        onChange={(val: any) => onChange(val)}
        style={{ width: '100%' }}
      />
    );
  }
}
