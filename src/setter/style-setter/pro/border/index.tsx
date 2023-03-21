import * as React from 'react';
import { useState, useEffect } from 'react';
import Row from '../../components/row';
import Icon from '../../components/icon';
import Number from '../../components/number';
import ColorInput from '../../components/color-input';
import { StyleData, onStyleChange } from '../../utils/types';
import { Collapse, Range, Select } from '@alifd/next';
import fontConfig from './config.json';
import { addUnit, removeUnit, unifyStyle } from '../../utils';
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
  const { borderType, borderStyle, shadowType} = fontConfig;
  const [selBorderType, setSelBorderType] = useState(null);
  const [borderDirection, setBorderDirection] = useState(null);
  const [shadow, setShadow] = useState('')
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
    // 初始绑定样式
    if(styleData['boxShadow']){
      const bgSizeArray = unifyStyle(styleData['boxShadow'])?.split(' ')
      if(bgSizeArray?.[0]==='inset'){
        setShadow('insetShadow')
      }else{
        setShadow('outerShadow')
      }
    }else{
      setShadow('')
    }
  }, [styleData]);

  const onChangeBorderType = (styleDataList: Array<StyleData>) => {
    if (styleDataList) {
      const styleKey = styleDataList[0].value;
      setSelBorderType(styleKey);
    }
  };

  const onRangeChange = (styleKey: string, value: string, unit?: string) => {

    // 需要清除partBorder的圆角设置，不然会冲突，容易遗漏

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
  const onBoxShadowChange = (styleKey: string, value: any, index?:number, unit?:string,shadowPosition?:string,isColor?:boolean) => {
    const bgSizeArray = styleData[styleKey]
      ? unifyStyle(styleData[styleKey])?.split(' ')
      : ['0', '0', '0', '0', '#000'];
      if(shadowPosition==='outerShadow'){
        if(bgSizeArray?.[0]==='inset'){
          bgSizeArray.shift()
        }
      }else if(shadowPosition==='insetShadow'){
        if(bgSizeArray?.[0]!=='inset'){
          bgSizeArray?.unshift('inset')
        }
      }
      if(bgSizeArray?.[0]==='inset'){
        setShadow('insetShadow')
      }else{
        setShadow('outerShadow')
      }
      let unifiedValue = value
      if(!value&&isColor){
        unifiedValue = '#000'
      }
      if(unifiedValue===null||unifiedValue===undefined||!bgSizeArray) return
      unifiedValue = unit? addUnit(unifiedValue,unit):  String(unifiedValue)
      if(index!==undefined&&index!==null){
        bgSizeArray[index] = unifiedValue
      }
      let curValue: String =''
      bgSizeArray.forEach((item)=>{
        curValue = curValue+item+' '
      })
      curValue=curValue.substring(0,curValue.length-1)
      const styleDataList = [
        {
          styleKey,
          value:curValue
        },
      ];
      onStyleChange(styleDataList);
  }
  //insetShadow会在第一位插入inset字符串，使所有阴影样式的序号+1
  const insetBoxShadowShift = shadow==='insetShadow' ? 1 : 0
  return (
    <Collapse defaultExpandedKeys={['0']}>
      <Panel title="边框" className="border-style-container">
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

        <Row title={'边框'} styleKey="border" {...props}>
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
        <Row
          title={shadowType.title}
          dataList={shadowType.dataList}
          styleKey={'shadowType'}
          {...props}
          onStyleChange={(type)=>{
            onBoxShadowChange('boxShadow', type?.[0].value, undefined, undefined ,type?.[0].value  )
          }}
          value={shadow}
        >
        </Row>
        <div className="shadow-container">
            <div className="shadow-color-container">
              <span className='shadow-color-title'>阴影颜色</span>
              <ColorInput
              {...props}
              color = {styleData['boxShadow']?.split(' ')?.[insetBoxShadowShift+4]}
              onStyleChange = {(color)=>{
                onBoxShadowChange('boxShadow', color?.[0].value, insetBoxShadowShift+4,undefined,undefined,true )
              }}
              />
            </div>
            <div className="shadow-size-container">
              <div className="shadow-size-x">
                <span className="shadow-size-x-title">x</span>
                <Number
                  style={{ marginRight: '4px' }}
                  styleKey="boxShadow"
                  {...props}
                  onChangeFunction={(styleKey: string, val: number, unit: string) =>
                    onBoxShadowChange(styleKey, val, insetBoxShadowShift+0, unit )
                  }
                  multiProp={insetBoxShadowShift+0}
                  defaultPlaceholder={'0'}
                />
              </div>
              <div className="shadow-size-y">
                <span className="shadow-size-y-title">y</span>
                <Number
                  styleKey="boxShadow"
                  {...props}
                  onChangeFunction={(styleKey: string, val: number, unit: string) =>
                    onBoxShadowChange(styleKey, val, insetBoxShadowShift+1, unit )
                  }
                  multiProp={insetBoxShadowShift+1}
                  defaultPlaceholder={'0'}
                />
              </div>
            </div>
            <div className="shadow-config-container">
              <div className="shadow-blur-container">
                <div className="shadow-blur-container-title">模糊</div>
                <Number
                  style={{ marginRight: '4px' }}
                  min={2}
                  styleKey="boxShadow"
                  {...props}
                  onChangeFunction={(styleKey: string, val: number, unit: string) =>
                    onBoxShadowChange(styleKey, val, insetBoxShadowShift+2, unit )
                  }
                  multiProp={insetBoxShadowShift+2}
                  defaultPlaceholder={'0'}
                />
              </div>
              <div className="shadow-extend-container">
                <div className="shadow-extend-container-title">扩展</div>
                <Number
                  styleKey="boxShadow"
                  min={3}
                  {...props}
                  onChangeFunction={(styleKey: string, val: number, unit: string) =>
                    onBoxShadowChange(styleKey, val, insetBoxShadowShift+3, unit )
                  }
                  multiProp={insetBoxShadowShift+3}
                  defaultPlaceholder={'0'}
                />
              </div>
            </div>
          </div>
      </Panel>
    </Collapse>
  );
};
