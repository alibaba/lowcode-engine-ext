import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { NumberPicker, Select } from '@alifd/next';
import { StyleData, onStyleChange } from '../../utils/types';
import {
  addUnit,
  removeUnit,
  isEmptyValue,
  getPlaceholderPropertyValue,
  unifyStyle,
  getUnit,
} from '../../utils';
import './index.less';
interface numberProps {
  styleKey: string;
  styleData: StyleData | any;
  onStyleChange?: onStyleChange;
  unit?: string | Array<string>;
  min?: number;
  max?: number;
  style?: any;
  className?: string;
  field?: any;
  placeholderScale?: number;
  defaultPlaceholder?: string;
  useComputedStyle?: boolean;
  onChangeFunction?: any;
  multiProp?: any; //属性值包含多项是的项序号
}

export default (props: numberProps) => {
  const {
    styleData,
    styleKey,
    unit,
    onStyleChange,
    min,
    max,
    style = {},
    className = '',
    placeholderScale,
    onChangeFunction,
    multiProp,
    defaultPlaceholder,
  } = props;

  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
  const onNumberChange = (styleKey: string, value: number, unit?: string) => {
    onStyleChange([
      {
        styleKey,
        value: unit ? addUnit(value, unit) : String(value),
      },
    ]);
  };

  const initData = (props: numberProps) => {
    const { field, styleKey, useComputedStyle } = props;
    if (useComputedStyle) {
      const placeholder = getPlaceholderPropertyValue(field, styleKey);

      if (placeholder && !isNaN(placeholder)) {
        setPlaceholder(placeholder * (1 / placeholderScale));
      } else {
        setPlaceholder('auto');
      }
    }
  };

  useEffect(() => {
    initData(props);
  }, []);
  let value = unit ? removeUnit(styleData[styleKey]) : styleData[styleKey];
  let curUnit = unit ? getUnit(styleData[styleKey]) || 'px' : '';
  // 不加multiprop一样，加了单独处理
  if (typeof multiProp === 'number') {
    value = unifyStyle(styleData[styleKey])?.split(' ')?.[multiProp];
    if (value === null || value === undefined || value === 'auto') {
      value = null;
      curUnit = 'px';
    } else {
      curUnit = unit ? getUnit(value) || 'px' : '';
      value = unit ? removeUnit(value) : value;
    }
  }
  if (isNaN(value)) {
    value = 0;
  }
  const getInnerAfter = useMemo(() => {
    if (typeof unit === 'string') {
      return unit;
    }
    if (!unit) {
      return '';
    }
    const options = unit?.map((item) => {
      return {
        value: item,
        label: item,
      };
    });
    return (
        <Select
          defaultValue="px"
          style={{ width: '24px' }}
          value={curUnit || 'px'}
          autoWidth={false}
          hasBorder={false}
          hasArrow={false}
          onChange={(val) =>
            onChangeFunction
              ? onChangeFunction(styleKey, value, val)
              : onNumberChange(styleKey, value, val)
          }
          dataSource={options}
        />
    );
  }, [unit]);
  return (
    <NumberPicker
      style={style}
      className={className}
      value={value}
      min={isEmptyValue(min) ? Number.MIN_SAFE_INTEGER : min}
      max={isEmptyValue(max) ? Number.MAX_SAFE_INTEGER : max}
      onChange={(val) =>
        onChangeFunction
          ? onChangeFunction(styleKey, val, curUnit)
          : onNumberChange(styleKey, val, curUnit)
      }
      innerAfter={getInnerAfter}
      placeholder={placeholder}
    ></NumberPicker>
  );
};
