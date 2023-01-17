import * as React from 'react';
import { useEffect, useState } from 'react';
import { NumberPicker } from '@alifd/next';
import { StyleData, onStyleChange } from '../../utils/types';
import { addUnit, removeUnit, isEmptyValue, getPlaceholderPropertyValue, unifyStyle } from '../../utils';
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
  defaultPlaceholder?: string
  useComputedStyle?: boolean;
  onChangeFunction?:any;
  multiProp?:any //属性值包含多项是的项序号
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

  console.log('props',props);
  

  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);

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
  let value = unit ? removeUnit(styleData[styleKey]) : styleData[styleKey]
  // 不加multiprop一样，加了单独处理
  if(typeof multiProp ==='number'){
    value = unifyStyle[styleData[styleKey]]?.split(' ')?.[multiProp]
    if(value===null||value===undefined||value==="auto"){
      value = null
    }else{
      value = unit ? removeUnit(value) : value
    }
  }
  return (
    <NumberPicker
      style={style}
      className={className}
      value={value}
      min={isEmptyValue(min) ? Number.MIN_SAFE_INTEGER : min}
      max={isEmptyValue(max) ? Number.MAX_SAFE_INTEGER : max}
      onChange={(val) => onChangeFunction ? onChangeFunction(styleKey, val, unit):onNumberChange(styleKey, val, unit)}
      innerAfter={unit ? unit : ''}
      placeholder={placeholder}
    ></NumberPicker>
  );
};
