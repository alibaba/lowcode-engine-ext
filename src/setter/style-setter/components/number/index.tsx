import * as React from 'react';
import { useEffect, useState } from 'react';
import { NumberPicker } from '@alifd/next';
import { StyleData, onStyleChange } from '../../utils/types';
import { addUnit, removeUnit, isEmptyValue, getPlaceholderPropertyValue } from '../../utils';
interface numberProps {
  styleKey: string;
  styleData: StyleData | any;
  onStyleChange?: onStyleChange;
  unit?: string;
  min?: number;
  max?: number;
  style?: any;
  className?: string;
  field?: any;
  placeholderScale?: number;
  useComputedStyle?: boolean;
  onChangeFunction?:any;
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
  } = props;

  console.log('props',props);
  

  const [placeholder, setPlaceholder] = useState(null);

  const onNumberChange = (styleKey: string, value: number, unit?: string) => {
    onStyleChange([
      {
        styleKey,
        value: unit ? addUnit(value, unit) : value,
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

  return (
    <NumberPicker
      style={style}
      className={className}
      value={unit ? removeUnit(styleData[styleKey]) : styleData[styleKey]}
      min={isEmptyValue(min) ? Number.MIN_SAFE_INTEGER : min}
      max={isEmptyValue(max) ? Number.MAX_SAFE_INTEGER : max}
      onChange={(val) => onChangeFunction ? onChangeFunction(styleKey, val, unit):onNumberChange(styleKey, val, unit)}
      innerAfter={unit ? unit : ''}
      placeholder={placeholder}
    ></NumberPicker>
  );
};
