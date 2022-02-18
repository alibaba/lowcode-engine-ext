import * as React from 'react';

import { Radio, Balloon } from '@alifd/next';
import { RadioItem, StyleData, onStyleChange } from '../../utils/types';
import Icon from '../icon';
import './index.less';
const RadioGroup = Radio.Group;

interface radioProps {
  dataList: Array<RadioItem>;
  styleKey: string;
  // styleData?: StyleData | any;
  onStyleChange?: onStyleChange;
  // 某些时候值并不是直接从StyleData中获取的，value值提供了外部定义的扩展
  value: string;
}

export default (props: radioProps) => {
  const { dataList, styleKey, onStyleChange, value } = props;

  const onRadioChange = (key: string, val: string | number | boolean) => {
    onStyleChange([
      {
        styleKey: key,
        value: val,
      },
    ]);
  };

  return (
    <div className="radiogroup-style">
      {value ? (
        <RadioGroup
          value={value}
          shape="button"
          onChange={(val) => onRadioChange(styleKey, val)}
          aria-labelledby="groupId"
        >
          {dataList &&
            dataList.map((item: RadioItem) => (
              <Balloon
                trigger={
                  <Radio id={item.value} value={item.value}>
                    {item.icon ? <Icon type={item.icon} size="small"></Icon> : item.title}
                  </Radio>
                }
                triggerType="hover"
                closable={false}
                align="t"
              >
                {item.tips}
              </Balloon>
            ))}
        </RadioGroup>
      ) : (
        <RadioGroup
          shape="button"
          onChange={(val) => onRadioChange(styleKey, val)}
          aria-labelledby="groupId"
        >
          {dataList &&
            dataList.map((item: RadioItem) => (
              <Balloon
                trigger={
                  <Radio id={item.value} value={item.value}>
                    {item.icon ? <Icon type={item.icon} size="small"></Icon> : item.title}
                  </Radio>
                }
                triggerType="hover"
                closable={false}
                align="t"
              >
                {item.tips}
              </Balloon>
            ))}
        </RadioGroup>
      )}
    </div>
  );
};
