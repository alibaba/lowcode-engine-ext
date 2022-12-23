import * as React from 'react';
import { useState, useEffect } from 'react';
import Row from '../../components/row';
import Icon from '../../components/icon';
import Number from '../../components/number';
import ColorInput from '../../components/color-input';
import { StyleData, onStyleChange } from '../../utils/types';
import { Collapse, Range, Select } from '@alifd/next';
import fontConfig from './config.json';
import { addUnit, removeUnit } from '../../utils';
import './index.less';
const Option = Select.Option;
const Panel = Collapse.Panel;

const BORDER_MAX = 30;

enum BorderRadiusType {
  fixedBorder = "fixedBorder",
  partBorder = "partBorder",
}

const BorderDirectionMap = {
  borderLeft: 'borderLeft',
  borderRight: 'borderRight',
  borderTop: 'borderTop',
  borderBottom: 'borderBottom',
  // border:'border'
};

const borderRadiusMap = {
  borderRadius:'borderRadius',
  borderTopLeftRadius:'borderTopLeftRadius',
  borderTopRightRadius:'borderTopRightRadius',
  borderBottomLeftRadius:'borderBottomLeftRadius',
  borderBottomRightRadius:'borderBottomRightRadius',
}

interface fontProps {
  styleData: StyleData | any;
  onStyleChange?: onStyleChange;
  unit?: string;
}
export default (props: fontProps) => {
  const { styleData, onStyleChange, unit } = props;
  const { borderType, borderStyle } = fontConfig;
  const [selBorderType, setSelBorderType] = useState(null);
  const [borderDirection, setBorderDirection] = useState(null);

  useEffect(() => {
    if (!borderDirection) {
      for (let key in styleData) {
        for (let borderDirectionKey in BorderDirectionMap) {
          if (key.indexOf(borderDirectionKey) >= 0) {
            setBorderDirection(borderDirectionKey);
            break;
          }
          if (styleData['border']){
            setBorderDirection('border');
            break;
          }
        }
      }
    }

    // 判断圆角类型
    if (styleData[borderRadiusMap.borderRadius]){
      setSelBorderType(BorderRadiusType.fixedBorder);
    }else if (styleData[borderRadiusMap.borderBottomLeftRadius] || styleData[borderRadiusMap.borderBottomRightRadius] || styleData[borderRadiusMap.borderTopLeftRadius] || styleData[borderRadiusMap.borderTopRightRadius]){
      setSelBorderType(BorderRadiusType.partBorder);
    }

  }, [styleData]);

  const onChangeBorderType = (styleDataList: Array<StyleData>) => {
    
    if (styleDataList) {
      const styleKey = styleDataList[0].value;
      setSelBorderType(styleKey);
    }
  };

  const onRangeChange = (styleKey: string, value: string, unit?: string) => {

    // It is necessary to clear the fillet setting of the part border, otherwise it will conflict and it is easy to miss

    onStyleChange([
      {
        styleKey,
        value: unit ? addUnit(value, unit) : value,
      },
      {
        styleKey:borderRadiusMap.borderBottomLeftRadius,
        value: null
      },
      {
        styleKey:borderRadiusMap.borderBottomRightRadius,
        value: null
      },
      {
        styleKey:borderRadiusMap.borderTopLeftRadius,
        value: null
      },
      {
        styleKey:borderRadiusMap.borderTopRightRadius,
        value: null
      },
    ]);
  };

  const onIconClick = (styleKey: string) => {
    setBorderDirection(styleKey);
  };

  const onPartBorderRadiusChange = (styleKey: string, value: number, unit: string,styleData:any) => {
    let styleDataList = [
      {
        styleKey,
        value: unit ? addUnit(value, unit) : value,
      },
    ];
    if (styleData['borderRadius']){
      styleDataList.push({
        styleKey:'borderRadius',
        value:null
      })
    }
    onStyleChange(styleDataList);
  }


  const onBorderTypeChange = (styleKey: string, value: string) => {
    onStyleChange([
      {
        styleKey,
        value,
      },
    ]);
  };

  return (
    <Collapse defaultExpandedKeys={['0']}>
      <Panel title="Border" className="border-style-container">
        <Row
          title={borderType.title}
          dataList={borderType.dataList}
          styleKey={'borderType'}
          {...props}
          onStyleChange={onChangeBorderType}
          value={selBorderType}
        />

        {selBorderType == 'fixedBorder' && (
          <Row title={' '} styleKey="borderRadius" {...props}>
            <div className="radius-container">
              <Range
                max={BORDER_MAX}
                value={removeUnit(styleData.borderRadius)}
                onChange={(val) => onRangeChange('borderRadius', val, unit)}
              />

              <Number
                styleKey="borderRadius"
                style={{ minWidth: '80px', marginLeft: '5px' }}
                {...props}
                max={BORDER_MAX}
              />
            </div>
          </Row>
        )}

        {selBorderType == 'partBorder' && (
          <>
            <Row
              title={' '}
              styleKey="borderRadius"
              {...props}
              contentStyle={{ justifyContent: 'space-between' }}
            >
              <div className="row-item">
                <Icon type="icon-radius-upleft" className="radius-icon" />
                <Number
                  max={BORDER_MAX}
                  min={0}
                  styleKey={borderRadiusMap.borderTopLeftRadius}
                  {...props}
                  style={{ width: '68px' }}
                  onChangeFunction = {(styleKey, val, unit)=>onPartBorderRadiusChange(styleKey, val, unit,styleData)}
                />
              </div>
              <div className="row-item">
                <Icon type="icon-radius-upright" className="radius-icon" />
                <Number
                  max={BORDER_MAX}
                  styleKey={borderRadiusMap.borderTopRightRadius}
                  {...props}
                  style={{ width: '68px' }}
                  onChangeFunction = {(styleKey, val, unit)=>onPartBorderRadiusChange(styleKey, val, unit,styleData)}
                />
              </div>
            </Row>
            <Row
              title={' '}
              styleKey="borderRadius"
              {...props}
              contentStyle={{ justifyContent: 'space-between' }}
            >
              <div className="row-item">
                <Icon type="icon-radius-bottomleft" className="radius-icon" />
                <Number
                  max={BORDER_MAX}
                  styleKey={borderRadiusMap.borderBottomLeftRadius}
                  {...props}
                  style={{ width: '68px' }}
                  onChangeFunction = {(styleKey, val, unit)=>onPartBorderRadiusChange(styleKey, val, unit,styleData)}
                />
              </div>
              <div className="row-item">
                <Icon type="icon-radius-bottomright" className="radius-icon" />
                <Number
                  max={BORDER_MAX}
                  styleKey={borderRadiusMap.borderBottomRightRadius}
                  {...props}
                  onChangeFunction = {(styleKey:string, val:number, unit:string)=>onPartBorderRadiusChange(styleKey, val, unit,styleData)}
                  style={{ width: '68px' }}
                />
              </div>
            </Row>
          </>
        )}

        <Row title={'Sides'} styleKey="border" {...props}>
          <div className="border-container">
            <div className="border-icon-container">
              <div className="top-icon-container">
                <div
                  className={
                    borderDirection === BorderDirectionMap.borderTop
                      ? 'sel-icon icon-container'
                      : 'icon-container'
                  }
                  onClick={() => onIconClick('borderTop')}
                >
                  <Icon type="icon--shangbiankuang" />
                </div>
              </div>
              <div className="center-icon-container">
                <div
                  className={
                    borderDirection === BorderDirectionMap.borderLeft
                      ? 'sel-icon icon-container'
                      : 'icon-container'
                  }
                  onClick={() => onIconClick('borderLeft')}
                >
                  <Icon type="icon--zuobiankuang" />
                </div>

                <div
                  className={
                    borderDirection === 'border'
                      ? 'sel-icon icon-container'
                      : 'icon-container'
                  }
                  onClick={() => onIconClick('border')}
                >
                  <Icon type="icon--quanbubiankuang" />
                </div>
                <div
                  className={
                    borderDirection === BorderDirectionMap.borderRight
                      ? 'sel-icon icon-container'
                      : 'icon-container'
                  }
                  onClick={() => onIconClick('borderRight')}
                >
                  <Icon type="icon--youbiankuang" />
                </div>
              </div>
              <div className="bottom-icon-container">
                <div
                  className={
                    borderDirection === BorderDirectionMap.borderBottom
                      ? 'sel-icon icon-container'
                      : 'icon-container'
                  }
                  onClick={() => onIconClick('borderBottom')}
                >
                  <Icon type="icon--xiabiankuang" />
                </div>
              </div>
            </div>

            <div className="border-right-container">
              {borderDirection && (
                <>
                  <Number
                    min={0}
                    max={30}
                    className="border-width"
                    styleKey={borderDirection + 'Width'}
                    {...props}
                  />
                  <ColorInput styleKey={borderDirection + 'Color'} {...props} />
                  <Select
                    hasClear
                    style={{ marginTop: '10px' }}
                    value={styleData[borderDirection + 'Style']}
                    placeholder="Please select"
                    onChange={(value) => {
                      onBorderTypeChange(borderDirection + 'Style', value);
                    }}
                  >
                    <Option value="solid">solid</Option>
                    <Option value="dashed">dashed</Option>
                    <Option value="dotted">dotted</Option>
                  </Select>
                </>
              )}
            </div>
          </div>
        </Row>
      </Panel>
    </Collapse>
  );
};
