import * as React from 'react';
import { Drawer } from '@alifd/next';
import { StyleData } from '../../utils/types';
import { parseToCssCode, parseToStyleData } from '../../utils';
import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';

interface CodeProps {
  visible: boolean;
  styleData: StyleData | any;
  onStyleDataChange: (val: any) => void;
  changeCssCodeVisiable: {
    (visable: boolean): void;
  };
}

const defaultEditorOption = {
  readOnly: false,
  automaticLayout: true,
  folding: true, // 默认开启折叠代码功能
  lineNumbers: 'on',
  wordWrap: 'off',
  formatOnPaste: true,
  height:'100%',
  fontSize: 12,
  tabSize: 2,
  scrollBeyondLastLine: false,
  fixedOverflowWidgets: false,
  snippetSuggestions: 'top',
  minimap: {
    enabled: false,
  },
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
  },
};

export default class CssCode extends React.Component<CodeProps> {
  state = {
    offsetX: -300,
    defaultEditorProps: {},
    cssCode: '',
  };

  shouldComponentUpdate(nextProps: CodeProps, nextState: any) {
    if (
      nextProps.visible != this.props.visible ||
      (this.state.cssCode == '' && nextState.cssCode != '')
    ) {
      return true;
    }

    return false;
  }

  componentWillReceiveProps(nextProps: CodeProps) {
    const cssCode = parseToCssCode(nextProps.styleData);
    this.setState({
      cssCode,
    });
  }

  componentDidMount() {
    const { styleData } = this.props;

    if (document.body.clientWidth >= 1860) {
      this.setState({
        offsetX: -400,
      });
    }

    const cssCode = parseToCssCode(styleData);
    console.log('cssCode', cssCode);

    this.setState({
      defaultEditorProps: {
        style: {
          width: '100%',
          height: document.body.clientHeight - 90 + 'px',
        },
      },
      cssCode,
    });
  }

  updateCode = (newCode: string) => {
    const { onStyleDataChange } = this.props;
    this.setState({
      cssCode: newCode,
    });
    const newStyleData = parseToStyleData(newCode);
    // 检查是否和原来的styleData完全相同
    newStyleData && onStyleDataChange(newStyleData);
  };

  render() {
    const { offsetX, cssCode, defaultEditorProps } = this.state;
    const { visible, changeCssCodeVisiable } = this.props;

    return (
      <Drawer
        width={360}
        visible={visible}
        offset={[offsetX, 0]}
        hasMask={false}
        title="css源码编辑"
        onClose={() => {
          changeCssCodeVisiable(true);
        }}
      >
        <MonacoEditor
          value={cssCode}
          {...defaultEditorProps}
          {...defaultEditorOption}
          {...{ language: 'css' }}
          onChange={(newCode: string) => this.updateCode(newCode)}
        />
      </Drawer>
    );
  }
}
