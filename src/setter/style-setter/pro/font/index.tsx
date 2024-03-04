import * as React from 'react';
import Row from '../../components/row';
import Number from '../../components/number';
import { StyleData, onStyleChange } from '../../utils/types';
import { Collapse, NumberPicker, Select, Range } from '@alifd/next';
import ColorInput from '../../components/color-input';
import { intlLocal } from './locale';
import { addUnit, isEmptyValue } from '../../utils';
import './index.less';
const Panel = Collapse.Panel;

const fontConfig = intlLocal();

interface fontProps {
  styleData: StyleData | any;
  onStyleChange?: onStyleChange;
  fontPropsConfig?: any;
  unit?: string;
}
export default (props: fontProps) => {
  const { styleData, onStyleChange, fontPropsConfig } = props;
  const defaultFontPropsConfig = {
    // display 展示列表
    fontFamilyList: [
      { value: 'Helvetica', label: 'Helvetica' },
      { value: 'Arial', label: 'Arial' },
      { value: 'serif', label: 'serif' },
    ],
  };

  // 配置合并
  const propsConfig = { ...defaultFontPropsConfig, ...fontPropsConfig };

  const { fontWeight, textAlign } = fontConfig;

  const onNumberChange = (styleKey: string, value: number, unit?: string) => {
    onStyleChange([
      {
        styleKey,
        value: unit ? addUnit(value, unit) : value,
      },
    ]);
  };

  return (
    <Collapse defaultExpandedKeys={['0']}>
      <Panel title={fontConfig.title} className="font-style-container">
        <div className="inner-row-contaienr">
          <div className="row-item">
            <span className="row-item-title">{fontConfig.fontSize}</span>
            <Number
              max={100}
              min={0}
              styleKey="fontSize"
              {...props}
              style={{ marginRight: '10px', width: '100%' }}
              useComputedStyle={true}
            />
          </div>
          <div className="row-item">
            <span className="row-item-title">{fontConfig.lineHeight}</span>
            <Number
              min={0}
              styleKey="lineHeight"
              {...props}
              style={{ width: '100%' }}
              useComputedStyle={true}
            />
          </div>
        </div>

        <Row title={fontConfig.fontWeight.title} styleData={styleData} styleKey="">
          <Select
            dataSource={fontWeight.dataList}
            style={{ width: '100%' }}
            value={styleData.fontWeight}
            hasClear={true}
            onChange={(val) => onStyleChange([{ styleKey: 'fontWeight', value: val }])}
          />
        </Row>
        <Row title={fontConfig.fontFamily} styleData={styleData} styleKey="">
          <Select
            dataSource={propsConfig.fontFamilyList}
            style={{ width: '100%' }}
            value={styleData.fontFamily}
            hasClear={true}
            onChange={(val) => onStyleChange([{ styleKey: 'fontFamily', value: val }])}
          />
        </Row>

        <Row title={fontConfig.color} styleKey="" {...props}>
          <ColorInput styleKey={'color'} {...props} inputWidth="100%"></ColorInput>
        </Row>

        <Row
          title={textAlign.title}
          dataList={textAlign.dataList}
          styleKey="textAlign"
          {...props}
        />

        <Row title={fontConfig.opacity} styleKey="opacity" {...props}>
          <div className="opacity-container">
            <Range
              style={{ marginRight: '7px' }}
              value={!isEmptyValue(styleData.opacity) ? styleData.opacity * 100 : 0}
              onChange={(val) => onNumberChange('opacity', parseInt(val) / 100)}
            />
            <NumberPicker
              value={
                !isEmptyValue(styleData.opacity) ? Math.floor(styleData.opacity * 100) : undefined
              }
              max={100}
              min={0}
              onChange={(val) => onNumberChange('opacity', isEmptyValue(val) ? null : val / 100)}
            />
          </div>
        </Row>
      </Panel>
    </Collapse>
  );
};
