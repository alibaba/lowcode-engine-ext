import * as React from 'react';
import Row from '../../components/row';
import LayoutBox from './layoutBox';
import { Collapse } from '@alifd/next';
import Number from '../../components/number';
import { StyleData, onStyleChange } from '../../utils/types';
import layoutConfig from './config.json';
const Panel = Collapse.Panel;

interface layoutProps {
  styleData: StyleData | any;
  onStyleChange?: onStyleChange;
  layoutPropsConfig?: any;
  unit?: string
}

const defaultLayoutPropsConfig = {
  // display 展示列表
  showDisPlayList: ['inline', 'flex', 'block', 'inline-block', 'none'],
  isShowPadding: true,
  isShowMargin: true,
  isShowWidthHeight: true,
};

export default (props: layoutProps) => {
  const { onStyleChange, styleData, layoutPropsConfig, unit } = props;

  // 配置合并
  const propsConfig = { ...defaultLayoutPropsConfig, ...layoutPropsConfig };

  // 传入配置
  const { showDisPlayList, isShowWidthHeight } = propsConfig;
  // 静态配置
  const { display, flexDirection, justifyContent, alignItems, flexWrap } = layoutConfig;

  const displayDataList = display.dataList.filter(
    (item) => showDisPlayList.indexOf(item.value) >= 0,
  );

  return (
    <Collapse defaultExpandedKeys={['0']}>
      <Panel title="布局" className="layout-style-container">
        <Row title={display.title} dataList={displayDataList} styleKey="display" {...props} longTitle={true}></Row>

        {styleData['display'] === 'flex' && (
          <>
            <Row
              title={flexDirection.title}
              dataList={flexDirection.dataList}
              styleKey="flexDirection"
              longTitle={true}
              {...props}
            />
            <Row
              title={justifyContent.title}
              dataList={justifyContent.dataList}
              styleKey="justifyContent"
              longTitle={true}
              {...props}
            />
            <Row
              title={alignItems.title}
              dataList={alignItems.dataList}
              styleKey="alignItems"
              longTitle={true}
              {...props}
            />
            <Row
              title={flexWrap.title}
              dataList={flexWrap.dataList}
              styleKey="flexWrap"
              longTitle={true}
              {...props}
            />
          </>
        )}

        <LayoutBox
          styleData={styleData}
          onStyleChange={onStyleChange}
          layoutPropsConfig={propsConfig}
          unit={unit}
        />

        {isShowWidthHeight && (
          <div className="inner-row-contaienr">
            <div className="row-item">
              <span className="row-item-title">宽度</span>
              <Number
                style={{ marginRight: '10px', width: '100%' }}
                min={0}
                styleKey="width"
                {...props}
                unit = {['px','%']}
                useComputedStyle={true}
              />
            </div>
            <div className="row-item">
              <span className="row-item-title">高度</span>
              <Number
                styleKey="height"
                min={0}
                {...props}
                style={{ width: '100%' }}
                unit = {['px','%']}
                useComputedStyle={true}
              />
            </div>
          </div>
        )}
      </Panel>
    </Collapse>
  );
};
