import * as React from 'react';
import { Radio } from '@alifd/next';
import './index.less';
const RadioGroup = Radio.Group;
interface RadioGroupSetterProps {
  value: boolean;
  disabled: boolean;
  options: any;
  defaultValue: any;
  onChange: (val: number) => void;
}
interface RadioGroupSetterState {
  setterValue: string | null;
}
export default class RadioGroupSetter extends React.PureComponent<
  RadioGroupSetterProps,
  RadioGroupSetterState
> {
  static displayName = 'RadioGroupSetter';

  state: RadioGroupSetterState = {
    setterValue: null,
  };

  renderLabel = (dataSource: any): any[] => {
    const { onChange } = this.props;
    const { setterValue } = this.state;

    const labelList = dataSource.map((item: any, index: number) => {
      return item.img ? (
        <span
          key={index}
          className={`setter-choose-option ${
            (setterValue === item.value && 'setter-choose-checked') || ''
          }`}
          onClick={() => {
            return onChange(item.value);
          }}
        >
          <span style={{ backgroundImage: `url("${item.img}")` }} className="setter-choose-img" />
        </span>
      ) : (
        <span
          key={index}
          className={`setter-choose-label ${
            (setterValue === (item.value === undefined ? item : item.value) &&
              'setter-choose-checked') ||
            ''
          }`}
          onClick={() => {
            return onChange(item.value === undefined ? item : item.value);
          }}
        >
          {item.label || item}
        </span>
      );
    });
    return labelList || [];
  };
  render() {
    const { onChange, disabled = false, options, value } = this.props;
    let hasImg = false;
    const dataSource = options.map((item: any) => {
      if (typeof item == 'string') {
        return item;
      } else {
        if (item.img) {
          hasImg = true;
        }
        return {
          img: item.img,
          label: item.title || item.label,
          value: item.value,
        };
      }
    });
    const otherProps = {};
    if (hasImg) {
      otherProps.children = this.renderLabel(dataSource);
    }
    return (
      <div className="radiogroup-style">
        <RadioGroup
          size="small"
          dataSource={dataSource}
          shape="button"
          value={value}
          disabled={disabled}
          onChange={(val: any) => onChange(val)}
          {...otherProps}
        />
      </div>
    );
  }
}
