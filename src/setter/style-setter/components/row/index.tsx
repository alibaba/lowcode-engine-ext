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
  const { title, dataList, styleKey, children, styleData, contentStyle = {} } = props;

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
            value={styleData ? styleData[styleKey] : null}
          ></RadioGroup>
        )}
      </div>
    </div>
  );
};
