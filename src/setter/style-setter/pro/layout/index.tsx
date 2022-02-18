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
}

export default (props: layoutProps) => {
  const { display, flexDirection, justifyContent, alignItems, flexWrap } = layoutConfig;

  // const onExpand = (expandedKeys: Array<any>) => {
  //   getVariableValue;
  // };

  const { onStyleChange, styleData } = props;
  return (
    <Collapse defaultExpandedKeys={['0']}>
      <Panel title="布局" className="layout-style-container">
        <Row title={display.title} dataList={display.dataList} styleKey="display" {...props}></Row>

        {styleData['display'] === 'flex' && (
          <>
            <Row
              title={flexDirection.title}
              dataList={flexDirection.dataList}
              styleKey="flexDirection"
              {...props}
            />
            <Row
              title={justifyContent.title}
              dataList={justifyContent.dataList}
              styleKey="justifyContent"
              {...props}
            />
            <Row
              title={alignItems.title}
              dataList={alignItems.dataList}
              styleKey="alignItems"
              {...props}
            />
            <Row
              title={flexWrap.title}
              dataList={flexWrap.dataList}
              styleKey="flexWrap"
              {...props}
            />
          </>
        )}

        <LayoutBox styleData={styleData} onStyleChange={onStyleChange} />

        <div className="inner-row-contaienr">
          <div className="row-item">
            <span className="row-item-title">宽度</span>
            <Number
              style={{ marginRight: '10px', width: '100%' }}
              min={0}
              styleKey="width"
              {...props}
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
              useComputedStyle={true}
            />
          </div>
        </div>
      </Panel>
    </Collapse>
  );
};
