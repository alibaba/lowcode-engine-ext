import * as React from 'react';
import Layout from './pro/layout';
import Position from './pro/position';
import Font from './pro/font';
import Border from './pro/border';
import Background from './pro/background';
import CssCode from './components/css-code';
import { StyleData } from './utils/types';
import { ConfigProvider } from '@alifd/next';
import './index.less';
interface StyleSetterProps {
  value: StyleData;
  defaultValue: string;
  placeholder: string;
  field: any;
  onChange: (val: any) => void;
  isShowCssCode: boolean;
  showModuleList: string[];
}

export default class StyleSetterV2 extends React.PureComponent<StyleSetterProps> {
  static defaultProps = {
    // 默认单位
    unit: 'px',
    // 默认计算尺寸缩放
    placeholderScale: 1,
    // 展示板块
    showModuleList: ['background', 'border', 'font', 'layout', 'position'],
    // 是否展示css源码编辑面板
    isShowCssCode: true,
    // layout 配置面板
    layoutPropsConfig: {
      // display 展示列表
      showDisPlayList: ['inline', 'flex', 'block', 'inline-block', 'none'],
      isShowPadding: true,
      isShowMargin: true,
      isShowWidthHeight: true,
    },

    fontPropsConfig: {
      // fontFamily列表
      fontFamilyList: [
        { value: 'Helvetica', label: 'Helvetica' },
        { value: 'Arial', label: 'Arial' },
        { value: 'serif', label: 'serif' },
      ],
    },

    // position 配置面板
    positionPropsConfig: {
      isShowFloat: true,
      isShowClear: true,
    },
  };

  state = { styleData: {}, cssCodeVisiable: false, initFlag: false };

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setState({
        styleData: value,
      });
    }

    this.setState({
      initFlag: true,
    });
  }

  changeCssCodeVisiable = (visible: boolean) => {
    this.setState({
      cssCodeVisiable: !visible,
    });
  };

  /**
   * style更改
   * @param styleKey
   * @param value
   */
  onStyleChange = (styleDataList: Array<StyleData>) => {
    const { onChange } = this.props;
    let styleData: StyleData | any = Object.assign({}, this.state.styleData);
    styleDataList &&
      styleDataList.map((item) => {
        if (item.value == undefined || item.value == null) {
          delete styleData[item.styleKey];
        } else {
          styleData[item.styleKey] = item.value;
        }
      });

    this.setState({
      styleData,
    });

    onChange && onChange(styleData);
    console.log(styleData);
  };

  onStyleDataChange = (styleData: StyleData) => {
    this.setState({
      styleData,
    });
    const { onChange } = this.props;

    onChange && onChange(styleData);
  };

  render() {
    const { isShowCssCode, showModuleList } = this.props;
    const { styleData, cssCodeVisiable, initFlag } = this.state;
    console.log('styleData', styleData);

    return (
      <ConfigProvider>
        <div className="lowcode-setter-style-v2">
          {isShowCssCode && (
            <div className="top-bar">
              {/* <div
                onClick={() => this.changeCssCodeVisiable(false)}
                className={cssCodeVisiable ? 'top-icon-active' : 'top-icon'}
              >
                <Icon type="icon-CSS"></Icon>
              </div> */}

              <CssCode styleData={styleData} onStyleDataChange={this.onStyleDataChange}></CssCode>
            </div>
          )}

          {showModuleList.filter((item) => item == 'layout').length > 0 && (
            <Layout
              onStyleChange={this.onStyleChange}
              styleData={styleData}
              {...this.props}
            ></Layout>
          )}

          {showModuleList.filter((item) => item == 'font').length > 0 && (
            <Font onStyleChange={this.onStyleChange} styleData={styleData} {...this.props}></Font>
          )}

          {showModuleList.filter((item) => item == 'background').length > 0 && (
            <Background
              onStyleChange={this.onStyleChange}
              styleData={styleData}
              {...this.props}
            ></Background>
          )}

          {showModuleList.filter((item) => item == 'position').length > 0 && (
            <Position
              onStyleChange={this.onStyleChange}
              styleData={styleData}
              {...this.props}
            ></Position>
          )}

          {showModuleList.filter((item) => item == 'border').length > 0 && (
            <Border
              onStyleChange={this.onStyleChange}
              styleData={styleData}
              {...this.props}
            ></Border>
          )}

          {/* {initFlag && (
            <CssCode
              visible={cssCodeVisiable}
              styleData={styleData}
              onStyleDataChange={this.onStyleDataChange}
              changeCssCodeVisiable={this.changeCssCodeVisiable}
            ></CssCode>
          )} */}
        </div>
      </ConfigProvider>
    );
  }
}
