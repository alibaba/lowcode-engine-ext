import * as React from 'react';
import { useState, useEffect } from 'react';
import Row from '../../components/row';
import Icon from '../../components/icon';
import ColorInput from '../../components/color-input';
import { StyleData, onStyleChange } from '../../utils/types';
import { Collapse, Input } from '@alifd/next';
import borderConfig from './config.json';
// import "./index.scss";
const Panel = Collapse.Panel;

interface fontProps {
  styleData: StyleData | any;
  onStyleChange?: onStyleChange;
  unit?: string;
}
export default (props: fontProps) => {
  const { onStyleChange, styleData } = props;
  const { backgroundType } = borderConfig;
  const [bgType, setBgType] = useState(null);

  const onBgTypeChange = (styleDataList: Array<StyleData>) => {
    if (styleDataList) {
      setBgType(styleDataList[0].value);
    }
  };

  const formatBgImgUrl = (url: string) => {
    if (url && url != '') {
      return 'url(' + url + ')';
    } else {
      return null;
    }
  };

  const backToBgImgUrl = (styleUrl: string) => {
    if (styleUrl) {
      // const reg = /^url\(.*\)/;
      // var result = styleUrl.match(reg);
      let newUrl = styleUrl.substring(styleUrl.indexOf('(') + 1, styleUrl.indexOf(')'));

      return newUrl;
      // return styleUrl.substring(
      //   styleUrl.indexOf("(") + 1,
      //   styleUrl.indexOf(")") - 1
      // );
    } else {
      return '';
    }
  };

  const initData = () => {
    if (styleData.backgroundColor) {
      setBgType('backgroundColor');
    } else if (styleData.backgroundImage) {
      setBgType('backgroundImage');
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onInputChange = (value: string) => {
    onStyleChange([
      {
        styleKey: 'backgroundImage',
        value: formatBgImgUrl(value),
      },
    ]);
  };

  return (
    <Collapse defaultExpandedKeys={['0']}>
      <Panel title="背景" className="font-style-container">
        <Row
          title={backgroundType.title}
          dataList={backgroundType.dataList}
          styleKey=""
          {...props}
          onStyleChange={onBgTypeChange}
          value={bgType}
        ></Row>

        {bgType == 'color' && (
          <Row title={' '} styleKey="" {...props}>
            <ColorInput styleKey={'backgroundColor'} {...props} inputWidth="100%"></ColorInput>
          </Row>
        )}

        {bgType == 'bgImg' && (
          <Row title={' '} styleKey="" {...props}>
            <Input
              innerBefore={<Icon type="icon-suffix-url" style={{ margin: 4 }} />}
              placeholder="输入图片url"
              style={{ width: '100%' }}
              value={backToBgImgUrl(styleData['backgroundImage'])}
              onChange={onInputChange}
            />
          </Row>
        )}

        {/* <Row title={"透明度"} styleKey="opacity" {...props}>
          <div className="opacity-container">
            <Range
              style={{ marginRight: "7px" }}
              value={
                !isEmptyValue(styleData.opacity) ? styleData.opacity * 100 : 0
              }
              onChange={(val) => onNumberChange("opacity", parseInt(val) / 100)}
            />
            <NumberPicker
              value={
                !isEmptyValue(styleData.opacity)
                  ? Math.floor(styleData.opacity * 100)
                  : undefined
              }
              max={100}
              min={0}
              onChange={(val) =>
                onNumberChange("opacity", isEmptyValue(val) ? null : val / 100)
              }
            ></NumberPicker>
          </div>
        </Row> */}
      </Panel>
    </Collapse>
  );
};
