import React, { Component } from 'react';
import { Button, Overlay } from '@alifd/next';
import { PluginProps } from '@alilc/lowcode-types';
import { event } from '@alilc/lowcode-engine';
import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';
import './index.less';
import { adjustOverlayPosition } from './utils';


const defaultEditorProps = {
  width: '100%',
  height: '150px',
};

const defaultEditorOption = {
  options:{
    readOnly: false,
    automaticLayout: true,
    folding: false, // 默认开启折叠代码功能
    lineNumbers: 'off',
    wordWrap: 'on',
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
      verticalScrollbarSize:0
    },
  }
};

export default class SimpleVariableBindPopup extends Component<PluginProps> {
  state = {
    visiable: false,
    isOverFlowMaxSize:false,
    jsCode: '',
    field: {}, // 编辑器全局变量
    treeList: [],
    minimize: false, // 是否最小化
    autoExpandParent: true,
    maxTextSize:0, // 绑定变量最大字符数
    node: null as any as HTMLElement, // 触发的节点
  };

  private editorJsRef = React.createRef();
  private nodeRef: HTMLDivElement | null = null;
  private overlayRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    event.on('common:variableBindDialog.openDialog', ({ field, node, maxTextSize }) => {
      const finalMaxTextSize = maxTextSize && typeof maxTextSize === 'number' ? maxTextSize : this.props.config?.props?.maxTextSize;
      this.setState({
        field,
        node: node || this.nodeRef,
        maxTextSize: finalMaxTextSize,
      }, () => {
        this.initCode();
        this.openDialog();
      });
    });
  }

  initCode = () => {
    const { field } = this.state;
    const fieldValue = field.getValue();
    const jsCode = fieldValue?.value;

    this.setState({
      jsCode,
      // fullScreenStatus: false,
      minimize: false, // 是否最小化
      isOverFlowMaxSize:false,
    });
  };

  openDialog = () => {
    this.setState({ visiable: true });
  };

  closeDialog = () => {
    this.setState({
      visiable: false,
      minimize: false,
    });
  };

  updateCode = (newCode) => {
    let isOverFlowMaxSize = false;
    if (this.state.maxTextSize){
      isOverFlowMaxSize = newCode?.length > this.state.maxTextSize
    }

    this.setState(
      {
        jsCode: newCode,
        isOverFlowMaxSize
      },
      this.autoSave,
    );
  };

  autoSave = () => {
    const { autoSave } = this.props;
    if (autoSave) {
      this.onOk(true);
    }
  };

  editorDidMount = () => {
    setTimeout(() => {
      this.editorNode = this.editorJsRef.current; // 记录当前dom节点；
    }, 0);
  };

  onOk = (autoSave) => {
    const { field, jsCode } = this.state;
    if(jsCode === undefined || jsCode?.length == 0) {
      return this.removeTheBinding()
    }

    const fieldValue = field.getValue();
    field.setValue({
      type: 'JSExpression',
      value: jsCode,
      mock:
        Object.prototype.toString.call(fieldValue) === '[object Object]'
          ? fieldValue.mock
          : fieldValue,
    });
    if (autoSave !== true) {
      this.closeDialog();
    }
  };

  removeTheBinding = () => {
    const { field } = this.state;
    const fieldValue = field.getValue();
    const value =
      Object.prototype.toString.call(fieldValue) === '[object Object]'
        ? fieldValue.mock
        : fieldValue;
    console.debug('value', value, 'fieldValue', fieldValue, field)
    field.setValue(value);
    this.closeDialog();
  };

  renderBottom = () => {
    const { jsCode } = this.state;
    return (
      <div className="simple-bind-dialog-bottom">
        <div className="bottom-left-container">
          {jsCode && jsCode.length > 0 && (
            <Button type="normal" warning onClick={this.removeTheBinding}>
              移除绑定
            </Button>
          )}
        </div>

        <div className="bottom-right-container">
          <Button type="primary" onClick={this.onOk} disabled={this.isBtnDisable()}>
            确定
          </Button>
          &nbsp;&nbsp;
          <Button type="normal" onClick={this.closeDialog}>
            取消
          </Button>
        </div>
      </div>
    );
  };

  minimizeClick = (state) => {
    this.setState({
      minimize: state,
      visiable: !state,
    });
  };

  renderErrorMessage = () => {
    const {isOverFlowMaxSize,maxTextSize} = this.state;
    return (
      isOverFlowMaxSize ? <span className='error-message'>表达式文本不能超过{maxTextSize}个字符，请换成函数调用</span> :null
    )
  }

  isBtnDisable = () => {
    const { isOverFlowMaxSize } = this.state;
    return isOverFlowMaxSize;
  }


  render() {
    const {
      visiable,
      jsCode,
      minimize,
      isOverFlowMaxSize,
    } = this.state;

    return (
      <div>
        {minimize ? (
          <div className="vs-variable-minimize">
            <img
              onClick={() => this.minimizeClick(false)}
              src="https://img.alicdn.com/imgextra/i2/O1CN01HzeCND1vl948xPEWm_!!6000000006212-55-tps-200-200.svg"
            />
            <span onClick={() => this.minimizeClick(false)} className="vs-variable-minimize-title">
              变量绑定
            </span>
            <img
              onClick={this.closeDialog}
              src="https://img.alicdn.com/imgextra/i2/O1CN017cO64O1DzwlxwDSKW_!!6000000000288-55-tps-200-200.svg"
            />
          </div>
        ) : (
          ''
        )}
        <div style={{ position: 'absolute', top: 0, right: 100 }} ref={ref => this.nodeRef = ref} />
        {this.state.node &&
          <Overlay
            v2
            key={this.state.field?.id}
            visible={!minimize && visiable}
            onRequestClose={this.closeDialog}
            safeNode={[document.querySelector('.lc-left-area'), document.querySelector('.lc-left-fixed-pane')]}
            target={() => this.state.node}
            offset={[-380, 0]}
            onPosition={() => {
              adjustOverlayPosition(this.overlayRef.current!, [20])
            }}
          >
            <div className="simple-dialog-body" ref={this.overlayRef}>
              <div className="dialog-right-container">
                <div className="dialog-small-title">绑定 {this.renderErrorMessage()}</div>
                <div id="jsEditorDom" className={isOverFlowMaxSize?"editor-context editor-context-error":"editor-context"} ref={this.editorJsRef}>
                  <div className="editor-type-tag">=</div>
                  <MonacoEditor
                    value={jsCode}
                    {...defaultEditorProps}
                    {...defaultEditorOption}
                    {...{ language: 'javascript' }}
                    onChange={(newCode) => this.updateCode(newCode)}
                    editorDidMount={(useMonaco, editor) => {
                      this.editorDidMount.call(this, editor, useMonaco);
                    }}
                  />
                </div>
              </div>
              {this.renderBottom()}
          </div>
          </Overlay>
        }
      </div>
    );
  }
}
