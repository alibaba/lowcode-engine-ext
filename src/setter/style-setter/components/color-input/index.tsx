import * as React from 'react';
import { Input, Balloon } from '@alifd/next';
import { StyleData, onStyleChange } from '../../utils/types';
import { SketchPicker } from 'react-color';

import './index.less';
interface ColorInputProps {
  styleKey: string;
  styleData: StyleData | any;
  onStyleChange?: onStyleChange;
  inputWidth?: string;
  color?:any
}

interface state {
  width: number;
}
export default class ColorSetter extends React.Component<ColorInputProps, state> {
  constructor(props: ColorInputProps) {
    super(props);
    this.state = {
      width: 50,
    };
  }
  componentDidMount() {
    this.screenChange();
    this.changeWidth();
    // const { onChange, value, defaultValue } = this.props;
    // if (value == undefined && defaultValue) {
    //   onChange(defaultValue);
    // }
  }
  /**
   * 屏幕分辨率监听
   */
  screenChange = () => {
    window.addEventListener('resize', this.changeWidth);
  };
  /**
   * 屏幕分辨率 变换 =>  改变冒泡框的位置
   */
  changeWidth = () => {
    this.setState({ width: document.body.clientWidth < 1860 ? -92 : -138 });
  };
  componentWillUnmount() {
    window.removeEventListener('resize', this.changeWidth);
  }

  inputChange = (color: string) => {
    const { onStyleChange, styleKey } = this.props;
    if (color == '') {
      onStyleChange([
        {
          styleKey,
          value: null,
        },
      ]);
    }
  };

  handleChange = (color: any) => {
    const { onStyleChange, styleKey } = this.props;
    const { rgb, hex } = color;
    const { r, g, b, a } = rgb;
    if (a === 1) {
      onStyleChange([
        {
          styleKey,
          value: hex,
        },
      ]);
    } else {
      onStyleChange([
        {
          styleKey,
          value: `rgba(${r},${g},${b},${a})`,
        },
      ]);
    }
  };

  render() {
    const { styleKey, styleData, inputWidth = '108px',color } = this.props;
    const InputTarget = (
      <Input
        className="lowcode-setter-color"
        style={{ width: inputWidth }}
        hasClear
        innerBefore={<div className="color-box" style={{ backgroundColor: color?color:styleData[styleKey] }} />}
        onChange={this.inputChange}
        value={color?color:styleData[styleKey]}
      />
    );
    return (
      <Balloon
        needAdjust
        align="tr"
        offset={[-30, 0]}
        style={{ padding: 0 }}
        trigger={InputTarget}
        triggerType="click"
        closable={false}
      >
        <SketchPicker width={250} color={color?color:styleData[styleKey]} onChange={this.handleChange} />
      </Balloon>
    );
  }
}
