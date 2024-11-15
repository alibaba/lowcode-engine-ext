import * as React from 'react';
import cls from 'classnames';
import './index.less';
import { StyleData, onStyleChange } from '../../utils/types';
import { addUnit, isCssVarBind, removeUnit as originRemoveUnit } from '../../utils';
import LayoutInput from './LayoutInput';

const KEY_ARROW_DOWN = 'ArrowDown';
const KEY_ARROW_UP = 'ArrowUp';

interface layoutBoxProps {
  styleData: StyleData | any;
  onStyleChange: onStyleChange;
  unit?: string;
  layoutPropsConfig: any;
}

const removeUnit = (value: any) => {
  if (isCssVarBind(value)) {
    return value;
  }
  return originRemoveUnit(value);
}

export default (props: layoutBoxProps) => {
  const { onStyleChange, unit = 'px', styleData, layoutPropsConfig } = props;

  const onInputChange = (styleKey: string, value: string) => {
    if (value != '') {
      // 判断是否是数字
      if (!isNaN(parseInt(value))) {
        onStyleChange([
          {
            styleKey,
            value: addUnit(value, unit),
          },
        ]);
      }
    } else {
      onStyleChange([
        {
          styleKey,
          value: null,
        },
      ]);
    }
  };

  const onInputKeyDown = (key: string, styleKey: string) => {
    const { onStyleChange, unit = 'px', styleData } = props;
    const value = styleData[styleKey] || 0;
    if (key == KEY_ARROW_DOWN) {
      onStyleChange([
        {
          styleKey,
          value: addUnit(parseInt(value) - 1, unit),
        },
      ]);
    } else if (key == KEY_ARROW_UP) {
      onStyleChange([
        {
          styleKey,
          value: addUnit(parseInt(value) + 1, unit),
        },
      ]);
    }
  };

  return (
    <div className="layout-box-container">
      {layoutPropsConfig.isShowMargin && (
        <>
          <div className={cls("margin-top-div", isCssVarBind(styleData.marginTop) && 'css-var-bind')}>
            <LayoutInput
              className="next-noborder"
              placeholder="0"
              maxLength={3}
              value={removeUnit(styleData.marginTop)}
              onChange={(val) => onInputChange('marginTop', val)}
              onKeyDown={(e) => onInputKeyDown(e.key, 'marginTop')}
             />
          </div>
          <div className={cls("margin-right-div", isCssVarBind(styleData.marginBottom) && 'css-var-bind')}>
            <LayoutInput
              className="next-noborder"
              placeholder="0"
              maxLength={3}
              value={removeUnit(styleData.marginRight)}
              onChange={(val) => onInputChange('marginRight', val)}
              onKeyDown={(e) => onInputKeyDown(e.key, 'marginRight')}
             />
          </div>
          <div className={cls("margin-bottom-div", isCssVarBind(styleData.marginBottom) && 'css-var-bind')}>
            <span className="help-txt">MARGIN</span>
            <LayoutInput
              className="next-noborder"
              placeholder="0"
              maxLength={3}
              value={removeUnit(styleData.marginBottom)}
              onChange={(val) => onInputChange('marginBottom', val)}
              onKeyDown={(e) => onInputKeyDown(e.key, 'marginBottom')}
             />
          </div>
          <div className={cls("margin-left-div", isCssVarBind(styleData.marginLeft) && 'css-var-bind')}>
            <LayoutInput
              className="next-noborder"
              placeholder="0"
              maxLength={3}
              value={removeUnit(styleData.marginLeft)}
              onChange={(val) => onInputChange('marginLeft', val)}
              onKeyDown={(e) => onInputKeyDown(e.key, 'marginLeft')}
             />
          </div>
        </>
      )}

      {layoutPropsConfig.isShowPadding && (
        <>
          <div className={cls("padding-top-div", isCssVarBind(styleData.paddingTop) && 'css-var-bind')}>
            <LayoutInput
              className="next-noborder"
              placeholder="0"
              maxLength={3}
              value={removeUnit(styleData.paddingTop)}
              onChange={(val) => onInputChange('paddingTop', val)}
              onKeyDown={(e) => onInputKeyDown(e.key, 'paddingTop')}
             />
          </div>
          <div className={cls("padding-right-div", isCssVarBind(styleData.paddingRight) && 'css-var-bind')}>
            <LayoutInput
              className="next-noborder"
              placeholder="0"
              maxLength={3}
              value={removeUnit(styleData.paddingRight)}
              onChange={(val) => onInputChange('paddingRight', val)}
              onKeyDown={(e) => onInputKeyDown(e.key, 'paddingRight')}
             />
          </div>
          <div className={cls("padding-bottom-div", isCssVarBind(styleData.paddingBottom) && 'css-var-bind')}>
            <span className="help-txt">PADDING</span>
            <LayoutInput
              className="next-noborder"
              placeholder="0"
              maxLength={3}
              value={removeUnit(styleData.paddingBottom)}
              onChange={(val) => onInputChange('paddingBottom', val)}
              onKeyDown={(e) => onInputKeyDown(e.key, 'paddingBottom')}
             />
          </div>
          <div className={cls("padding-left-div", isCssVarBind(styleData.paddingLeft) && 'css-var-bind')}>
            <LayoutInput
              className="next-noborder"
              placeholder="0"
              maxLength={3}
              value={removeUnit(styleData.paddingLeft)}
              onChange={(val) => onInputChange('paddingLeft', val)}
              onKeyDown={(e) => onInputKeyDown(e.key, 'paddingLeft')}
             />
          </div>
        </>
      )}
    </div>
  );
};
