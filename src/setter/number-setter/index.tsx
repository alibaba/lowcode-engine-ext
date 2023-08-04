import * as React from 'react';
import { NumberPicker } from '@alifd/next';
import './index.less';
interface NumberSetterProps {
  value: number;
  min: number;
  max: number;
  defaultValue: number;
  step: number | string;
  units: string;
  onChange: (val: number | null) => void;
  precision: number;
}

interface NumberSetterState {
  setterValue: number | null;
}

export default class NumberSetter extends React.PureComponent<
  NumberSetterProps,
  NumberSetterState
> {
  static displayName = 'NumberSetter';

  render() {
    const {
      onChange,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      step = 1,
      units = '',
      precision = 0,
      value,
    } = this.props;

    return (
      <NumberPicker
        size="small"
        style={{ width: '100%' }}
        className="lowcode-setter-number"
        value={value}
        min={min}
        max={max}
        precision={precision}
        step={step}
        innerAfter={units}
        onChange={(val: number) => {
          onChange(!val ? 0 : val);
        }}
      />
    );
  }
}
