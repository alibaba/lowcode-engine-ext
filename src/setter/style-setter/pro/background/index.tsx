import React, { useState, useEffect } from 'react';
import Row from '../../components/row';
import Icon from '../../components/icon';
import Number from '../../components/number';
import ColorInput from '../../components/color-input';
import { StyleData, onStyleChange } from '../../utils/types';
import { Collapse, Input, NumberPicker, Range } from '@alifd/next';
import { addUnit, isCssVarBind, isEmptyValue, parseValue, unifyStyle } from '../../utils';
import { intlLocal } from './locale';
import './index.less';
import { backgroundSizeMap } from './constant';

const backgroundConfig = intlLocal();

const {Panel} = Collapse;
interface fontProps {
  styleData: StyleData | any;
  onStyleChange?: onStyleChange;
  unit?: string;
}
export default (props: fontProps) => {
  const { onStyleChange, styleData } = props;
  const { backgroundType, backgroundSize, backgroundPosition, backgroundRepeat } = backgroundConfig;
  const [bgType, setBgType] = useState(null);
  const [bgSizeType, setBgSizeType] = useState(null);
  const [bgRepeatType, setBgRepeatType] = useState(null);
  const [bgPositionType, setBgPositionType] = useState<string>('');
  // 背景类型切换
  const onBgTypeChange = (styleDataList: StyleData[]) => {
    if (styleDataList) {
      setBgType(styleDataList[0].value);
    }
  };
  // 背景图片切换
  const onBgImageChange = (value: string) => {
    onStyleChange([
      {
        styleKey: 'backgroundImage',
        value: formatBgImgUrl(value),
      },
    ]);
  };
  // backgroundSize类型切换
  const onBgSizeTypeChange = (styleDataList: StyleData[]) => {
    const backgroundSize = 'backgroundSize';
    onStyleChange([
      {
        styleKey: backgroundSize,
        value: null,
      },
    ]);
    if (styleDataList) {
      const value = styleDataList[0]?.value;
      setBgSizeType(value);
      if (value != backgroundSizeMap.default) {
        onStyleChange([
          {
            styleKey: backgroundSize,
            value,
          },
        ]);
      }
    }
  };
  // backgroundSize值切换
  const onBgSizeChange = (
    styleKey: string,
    value: number,
    unit: string,
    styleData: any,
    direction: string,
  ) => {
    const bgSizeArray = styleData[styleKey]
      ? unifyStyle(styleData[styleKey])?.split(' ')
      : ['auto', 'auto'];
    const [width = 'auto', height = 'auto'] = bgSizeArray;
    let styleDataList;
    if (styleData) {
      let unifiedValue = unit ? addUnit(value, unit) : value;
      if (unifiedValue === null || unifiedValue === undefined) unifiedValue = 'auto'; // 空样式默认为auto
      if (direction === 'width') {
        styleDataList = [
          {
            styleKey,
            value:
              unifiedValue !== 'auto' || height !== 'auto' ? `${unifiedValue  } ${  height}` : null, // 都为auto则删除样式
          },
        ];
      } else {
        styleDataList = [
          {
            styleKey,
            value: unifiedValue !== 'auto' || width !== 'auto' ? `${width  } ${  unifiedValue}` : null,
          },
        ];
      }
      onStyleChange(styleDataList);
    }
  };
  // backgroundRepeat切换
  const onBgRepeatChange = (styleDataList: StyleData[]) => {
    if (styleDataList) {
      const value = styleDataList[0]?.value;
      setBgRepeatType(value);
      onStyleChange([
        {
          styleKey: 'backgroundRepeat',
          value,
        },
      ]);
    }
  };

  // backgroundPosition切换
  const onBgPositionChange = (
    styleKey: string,
    value: number,
    unit: string,
    styleData: any,
    direction: string,
  ) => {
    const bgSizeArray = styleData[styleKey]
      ? unifyStyle(styleData[styleKey]).split(' ')
      : ['auto', 'auto'];
    const [width = 'auto', height = 'auto'] = bgSizeArray;
    let styleDataList;
    if (styleData) {
      let unifiedValue = /^-?[0-9]\d*$/.test(value) ? value + unit : value; // 正则匹配非0数字并加单位
      if (
        unifiedValue === null ||
        unifiedValue === undefined ||
        unifiedValue.replace(/\s*/g, '') === '' // 空格和空字符串也为空值
      ){
        unifiedValue = 'auto';
      }
      if (direction === 'horizontal') {
        styleDataList = [
          {
            styleKey,
            value:
              unifiedValue !== 'auto' || height !== 'auto' ? `${unifiedValue  } ${  height}` : null,
          },
        ];
      } else {
        styleDataList = [
          {
            styleKey,
            value: unifiedValue !== 'auto' || width !== 'auto' ? `${width  } ${  unifiedValue}` : null,
          },
        ];
      }
      onStyleChange(styleDataList);
    }
  };
  // 透明度切换
  const onOpacityChange = (styleKey: string, value: number, unit?: string) => {
    onStyleChange([
      {
        styleKey,
        value: unit ? addUnit(value, unit) : value,
      },
    ]);
  };
  const initData = () => {
    if (styleData.backgroundColor) {
      setBgType('color');
    } else if (styleData.backgroundImage) {
      setBgType('bgImg');
    } else {
      setBgType(null);
    }
    setBgRepeatType(styleData.backgroundRepeat);
    const bgSizeType =
      styleData.backgroundSize === backgroundSizeMap.contain ||
      styleData.backgroundSize === backgroundSizeMap.cover
        ? styleData.backgroundSize
        : backgroundSizeMap.default;
    setBgSizeType(bgSizeType);
    const chosenItem = backgroundPosition.dataList.find((item) => {
      return item.position === styleData.backgroundPosition;
    });
    setBgPositionType(chosenItem?.title);
  };

  useEffect(() => {
    initData();
  }, [styleData]);
  const formatBgImgUrl = (url: string) => {
    if (url && url != '') {
      return `url(${  url  })`;
    } else {
      return null;
    }
  };

  const backToBgImgUrl = (styleUrl: string) => {
    if (styleUrl) {
      // const reg = /^url\(.*\)/;
      // var result = styleUrl.match(reg);
      const newUrl = styleUrl.substring(styleUrl.indexOf('(') + 1, styleUrl.indexOf(')'));

      return newUrl;
      // return styleUrl.substring(
      //   styleUrl.indexOf("(") + 1,
      //   styleUrl.indexOf(")") - 1
      // );
    } else {
      return '';
    }
  };
  return (
    <Collapse defaultExpandedKeys={['0']}>
      <Panel title={backgroundConfig.title} className="font-style-container">
        <Row
          title={backgroundType.title}
          dataList={backgroundType.dataList}
          styleKey=""
          {...props}
          onStyleChange={onBgTypeChange}
          value={bgType}
         />

        {bgType == 'color' && (
          <Row title={' '} styleKey="" {...props}>
            <ColorInput styleKey={'backgroundColor'} {...props} inputWidth="100%" />
          </Row>
        )}

        {bgType == 'bgImg' && (
          <Row title={' '} styleKey="" {...props}>
            <Input
              innerBefore={<Icon type="icon-suffix-url" style={{ margin: 4 }} />}
              placeholder={backgroundConfig.inputPlaceholder}
              style={{ width: '100%' }}
              value={backToBgImgUrl(styleData.backgroundImage)}
              onChange={onBgImageChange}
            />
          </Row>
        )}
        {bgType == 'bgImg' && (
          <>
            <Row
              title={backgroundSize.title}
              dataList={backgroundSize.dataList}
              {...props}
              onStyleChange={onBgSizeTypeChange}
              value={bgSizeType}
             />
            {bgSizeType == backgroundSizeMap.default && (
              <div className="inner-row-contaienr-bgsize">
                <div className="row-item">
                  <span className="row-item-title">{backgroundConfig.width}</span>
                  <Number
                    style={{ marginRight: '4px' }}
                    min={0}
                    styleKey="backgroundSize"
                    {...props}
                    unit = {['px','%']}
                    onChangeFunction={(styleKey: string, val: number, unit: string) =>
                      onBgSizeChange(styleKey, val, unit, styleData, 'width')
                    }
                    multiProp={0}
                    defaultPlaceholder={'auto'}
                  />
                </div>
                <div className="row-item">
                  <span className="row-item-title">{backgroundConfig.height}</span>
                  <Number
                    styleKey="backgroundSize"
                    min={0}
                    {...props}
                    unit = {['px','%']}
                    onChangeFunction={(styleKey: string, val: number, unit: string) =>
                      onBgSizeChange(styleKey, val, unit, styleData, 'height')
                    }
                    multiProp={1}
                    defaultPlaceholder={'auto'}
                  />
                </div>
              </div>
            )}
            <Row title={backgroundPosition.title} styleKey="border" {...props}>
              <div className="background-position-container">
                <div className="background-position-container-left">
                  {backgroundPosition.dataList.map((item) => {
                    return (
                      <div
                        className={bgPositionType === item.title ? 'sel-icon' : ''}
                        onClick={() => {
                          setBgPositionType(item.title);
                          onStyleChange([
                            {
                              styleKey: 'backgroundPosition',
                              value: item.position,
                            },
                          ]);
                        }}
                      >
                        <Icon className="background-position-icon" type={item.icon} />
                      </div>
                    );
                  })}
                </div>

                <div className="background-position-container-right">
                  <div className="background-position-left">
                    <span>{backgroundConfig.left}</span>
                    <Number
                    style={{ marginLeft: '10px' }}
                    styleKey="backgroundPosition"
                    {...props}
                    unit = {['px','%']}
                    onChangeFunction={(styleKey: string, val: number, unit: string) =>
                      onBgPositionChange(styleKey, val, unit, styleData, 'horizontal')
                    }
                    multiProp={0}
                    defaultPlaceholder={'auto'}
                  />
                  </div>
                  <div className="background-position-top">
                    <span>{backgroundConfig.top}</span>
                    <Number
                    style={{ marginLeft: '10px' }}
                    min={-10}
                    styleKey="backgroundPosition"
                    {...props}
                    unit = {['px','%']}
                    onChangeFunction={(styleKey: string, val: number, unit: string) =>
                      onBgPositionChange(styleKey, val, unit, styleData, 'verticle')
                    }
                    multiProp={1}
                    defaultPlaceholder={'auto'}
                  />

                  </div>
                </div>
              </div>
            </Row>
            <Row
              title={backgroundRepeat.title}
              dataList={backgroundRepeat.dataList}
              styleKey=""
              {...props}
              onStyleChange={onBgRepeatChange}
              value={bgRepeatType}
             />
          </>
        )}

        <Row title={backgroundConfig.opacity} styleKey="opacity" {...props}>
          <div className="opacity-container">
            <Range
              disabled={isCssVarBind(styleData.opacity)}
              style={{ marginLeft: '10px', marginRight: '10px', width: '104px' }}
              value={!isEmptyValue(styleData.opacity) ? styleData.opacity * 100 : 0}
              onChange={(val) => onOpacityChange('opacity', parseInt(val) / 100)}
            />
            <NumberPicker
              value={
                !isEmptyValue(styleData.opacity) && !isCssVarBind(styleData.opacity) ? Math.floor(styleData.opacity * 100) : undefined
              }
              disabled={isCssVarBind(styleData.opacity)}
              max={100}
              min={0}
              onChange={(val) => onOpacityChange('opacity', isEmptyValue(val) ? null : val / 100)}
              innerAfter={'%'}
             />
          </div>
        </Row>
      </Panel>
    </Collapse>
  );
};
