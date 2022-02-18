import * as React from 'react';
import { Input, Balloon } from '@alifd/next';
import { SketchPicker } from 'react-color';
import './index.less';
interface ColorSetterProps {
  value: string;
  onChange: (val: any) => void;
  defaultValue: string;
}
interface ColorSetterState {
  width: number;
  setterValue: string;
}
export default class ColorSetter extends React.Component<ColorSetterProps, ColorSetterState> {
  static displayName = 'ColorSetter';
  constructor(props: ColorSetterProps) {
    super(props);
    this.state = {
      width: -92,
      setterValue: null,
    };
  }
  componentDidMount() {
    this.screenChange();
    this.changeWidth();
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
  static getDerivedStateFromProps(nextProps: ColorSetterProps, prevState: ColorSetterState): any {
    const { value, defaultValue } = nextProps;
    if (prevState.setterValue == null) {
      if (value == undefined && defaultValue) {
        return {
          setterValue: defaultValue,
        };
      }
    }
    return {
      setterValue: value,
    };
  }
  handleChange = (color: any) => {
    const { onChange } = this.props;
    const { rgb, hex } = color;
    const { r, g, b, a } = rgb;
    if (a === 1) {
      onChange(hex);
    } else {
      onChange(`rgba(${r},${g},${b},${a})`);
    }
  };

  render() {
    const { width, setterValue } = this.state;
    const { onChange } = this.props;
    const InputTarget = (
      <Input
        size="small"
        className="lowcode-setter-color"
        style={{ width: '100%' }}
        innerBefore={<div className="color-box" style={{ backgroundColor: setterValue }} />}
        value={setterValue}
        onChange={onChange}
      />
    );
    return (
      <Balloon
        needAdjust
        align="tr"
        offset={[width, 0]}
        style={{ padding: 0 }}
        trigger={InputTarget}
        triggerType="click"
        closable={false}
      >
        <SketchPicker color={setterValue} onChange={this.handleChange} />
      </Balloon>
    );
  }
}
