import * as React from 'react';
import RadioGroup from '../radio-group';
import { RadioItem, StyleData, onStyleChange } from '../../utils/types';

import './index.less';
interface rowProps {
  title?: string;
  children?: any;
  // 如果不传styleData的话，radiogroup就变成非受控组件
  styleData?: StyleData | any;
  dataList?: Array<RadioItem>;
  styleKey: string;
  onStyleChange?: onStyleChange;
  value?: string;
  contentStyle?: any;
}

export default (props: rowProps) => {
  const { title, dataList, styleKey, children, styleData, contentStyle = {}, value } = props;
  return (
    <div className="row-container">
      {title && (
        <div
          className={
            styleData[styleKey]
              ? 'title-contaienr title-text title-text-active'
              : 'title-contaienr title-text'
          }
        >
          {title}
        </div>
      )}

      <div className="content-container" style={contentStyle}>
        {children ? (
          children
        ) : (
          <RadioGroup
            dataList={dataList}
            {...props}
            // 区分是style类型的值还是其他普通的值，从styleData获取的是对象
            value={typeof value != 'string' ? styleData && styleData[styleKey] : value}
          ></RadioGroup>
        )}
      </div>
    </div>
  );
};
