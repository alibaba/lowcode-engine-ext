import React, { PureComponent } from 'react';
import { Button, Icon, Dialog } from '@alifd/next';
import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';
import { event, skeleton } from '@alilc/lowcode-engine';
import { js_beautify } from 'js-beautify';
import './index.less';

const SETTER_NAME = 'function-setter';

const defaultEditorOption = {
  width:'100%',
  height:'95%',
  options: {
    readOnly: false,
    automaticLayout: true,
    folding: true, // 默认开启折叠代码功能
    lineNumbers: 'on',
    wordWrap: 'off',
    formatOnPaste: true,
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
  },
};

interface FunctionSetterProps {
  value: string;
  type: string;
  defaultValue: string;
  placeholder: string;
  hasClear: boolean;
  onChange: (icon: string) => undefined;
  icons: string[];
}
export default class FunctionSetter extends PureComponent<FunctionSetterProps> {
  static defaultProps = {
    value: undefined,
    type: 'string',
    defaultValue: '',
    hasClear: true,
    placeholder: '请点击选择 Icon',
    onChange: () => undefined,
  };

  private emitEventName = '';

  state = {
    isShowDialog: false,
  };

  componentDidMount() {
    this.emitEventName = `${SETTER_NAME}-${this.props.field.id}`;
    event.on(`common:${this.emitEventName}.bindEvent`, this.bindEvent);
  }

  bindEvent = (eventName, paramStr) => {
    this.bindEventCallback(eventName, paramStr);
  };

  componentWillUnmount() {
    event.off(`${this.emitEventName}.bindEvent`, this.bindEvent);
  }

  bindFunction = (isEdit) => {
    const { field, value, template } = this.props;

    let paramStr;
    let functionName;

    if (value) {
      paramStr = this.parseFunctionParam(value.value);
      functionName = this.parseFunctionName(value.value);
    }

    event.emit(
      'eventBindDialog.openDialog',
      functionName || field.name,
      this.emitEventName,
      paramStr,
      isEdit,
      functionName || field.name,
      { template },
    );
  };

  openDialog = () => {
    const { value = {} } = this.props;
    this.setState({
      isShowDialog: true,
    });

    this.functionCode = value.value;
  };

  closeDialog = () => {
    this.setState({
      isShowDialog: false,
    });
  };

  removeFunctionBind = () => {
    const { removeProp } = this.props;
    removeProp();
  };

  parseFunctionName = (functionString: string) => {
    // 因为函数格式是固定的，所以可以按照字符换去匹配获取函数名
    return functionString.split('this.')[1]?.split('.')[0];
  };

  parseFunctionParam = (functionString: string) => {
    // eslint-disable-next-line no-useless-escape
    const matchList = functionString.match(/\[([\s\S]*?)\]/g);
    if (matchList?.length) {
      const paramStr = matchList[0].substring(1, matchList[0].length - 1);
      if (paramStr == '') {
        return null;
      }
      return paramStr;
    }
  };

  /**
   * 渲染按钮(初始状态)
   */
  renderButton = () => {
    return (
      <Button size="small" type="normal" onClick={() => this.bindFunction()}>
        绑定函数
      </Button>
    );
  };

  updateCode = (newCode) => {
    this.functionCode = newCode;
  };

  onDialogOk = () => {
    const { onChange } = this.props;
    onChange({
      type: 'JSFunction',
      value: this.functionCode,
    });

    this.closeDialog();
  };

  focusFunctionName = (functionName) => {
    skeleton.showPanel('codeEditor');

    setTimeout(() => {
      event.emit('codeEditor.focusByFunction', {
        functionName,
      });
    }, 300);
  };

  /**
   * 渲染绑定函数
   */
  renderBindFunction = () => {
    const { value } = this.props;

    // 解析函数名
    const functionName = this.parseFunctionName(value.value);
    return (
      <div className="function-container">
        <img
          className="funtion-icon"
          src="https://gw.alicdn.com/tfs/TB1NXNhk639YK4jSZPcXXXrUFXa-200-200.png"
        />
        <span className="function-name" onClick={() => this.focusFunctionName(functionName)}>
          {functionName}
        </span>
        <Icon
          type="set"
          size="medium"
          className="funtion-operate-icon"
          onClick={() => this.bindFunction(true)}
        />
        <Icon
          type="ashbin"
          size="medium"
          className="funtion-operate-icon"
          onClick={this.removeFunctionBind}
        />
      </div>
    );
  };

  /**
   * 渲染编辑函数按钮(可直接编辑函数内容)
   */
  renderEditFunctionButton = () => {
    return (
      <div>
        <Button size="small" type="primary" onClick={this.openDialog}>
          <Icon type="edit" />
          编辑函数
        </Button>
      </div>
    );
  };

  bindEventCallback = (eventName: string, paramStr: string) => {
    const { onChange } = this.props;

    onChange({
      type: 'JSFunction',
      value: `function(){ return this.${eventName}.apply(this,Array.prototype.slice.call(arguments).concat([${
        paramStr || ''
      }])) }`,
    });
  };

  render() {
    const { value } = this.props;
    const { isShowDialog } = this.state;

    let functionName = '';
    if (value && value.value) {
      functionName = this.parseFunctionName(value.value);
    }

    let renderFunction;
    if (value) {
      if (functionName) {
        renderFunction = this.renderBindFunction;
      } else {
        renderFunction = this.renderEditFunctionButton;
      }
    } else {
      renderFunction = this.renderButton;
    }

    return (
      <div className="lc-function-setter">
        {renderFunction()}

        {value && value.value && (
          <Dialog
            visible={isShowDialog}
            closeable={'close'}
            title="函数编辑"
            onCancel={this.closeDialog}
            onOk={this.onDialogOk}
            onClose={() => {
              this.closeDialog();
            }}
          >
            <div style={{ width: '500px', height: '400px' }}>
              <MonacoEditor
                value={js_beautify(value.value)}
                {...defaultEditorOption}
                {...{ language: 'javascript' }}
                onChange={(newCode) => this.updateCode(newCode)}
              />
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}
