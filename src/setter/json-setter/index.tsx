import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Button, Icon, Dialog } from '@alifd/next';
import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';
import CustomIcon from '../../components/custom-icon';
import { js_beautify } from 'js-beautify';
import { intl } from './locale';

const defaultEditorOption = {
  width: '100%',
  height: '400px',
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
  throttle: 0,
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
  },
};

interface JsonSetterProps {
  value: string;
  type: string;
  defaultValue: string;
  placeholder: string;
  hasClear: boolean;
  onChange: (icon: string) => undefined;
  icons: string[];
}
export default class JsonSetter extends PureComponent<JsonSetterProps> {
  static displayName = 'JsonSetter';

  private datasourceCode = '';

  state = {
    isShowDialog: false,
    value: JSON.stringify(this.props.value),
  };

  openDialog = () => {
    const { value } = this.state;
    this.setState({
      isShowDialog: true,
    });

    this.datasourceCode = value;
  };

  componentWillReceiveProps(nextProps) {
    const nextValue = JSON.stringify(nextProps.value);
    if (nextValue !== this.state.value) {
      this.setState({
        value: nextValue,
      });
    }
  }

  closeDialog = () => {
    this.setState({
      isShowDialog: false,
    });
  };

  /**
   * 渲染按钮
   */
  renderButton = (value) => {
    return !value ? (
      <Button size="small" type="normal" onClick={this.openDialog}>
        { intl('BindingData') }
      </Button>
    ) : (
      <Button size="small" type="primary" onClick={this.openDialog}>
        <Icon type="edit" />
        { intl('EditData') }
      </Button>
    );
  };

  updateCode = (newCode) => {
    this.datasourceCode = newCode;
  };

  onDialogOk = () => {
    const { onChange, removeProp } = this.props;
    if (this.datasourceCode && this.datasourceCode != '') {
      try {
        onChange(JSON.parse(this.datasourceCode));
        this.closeDialog();
      } catch (e) {
        Dialog.alert({
          title: intl('FailedToSaveData'),
          content: e.message,
        });
      }
    } else {
      onChange(undefined);
      // removeProp();
      this.closeDialog();
    }
  };

  /**
   * 渲染编辑函数按钮(可直接编辑函数内容)
   */
  renderEditFunctionButton = () => {
    return (
      <div>
        <Button size="small" type="primary" onClick={this.openDialog}>
          <CustomIcon type="icon-ic_edit" />
          { intl('EditData') }
        </Button>
      </div>
    );
  };

  render() {
    const { value } = this.state;
    const { isShowDialog } = this.state;
    return (
      <div>
        {this.renderButton(value)}
        {
          <Dialog
            visible={isShowDialog}
            closeable={'close'}
            title={intl('EditData')}
            onCancel={this.closeDialog}
            onOk={this.onDialogOk}
            onClose={() => {
              this.closeDialog();
            }}
            cancelProps={{
              children: intl('Cancel')
            }}
            okProps={{
              children: intl('Confirm')
            }}
          >
            <div style={{ width: '500px', height: '400px' }}>
              <MonacoEditor
                value={js_beautify(value)}
                {...defaultEditorOption}
                {...{ language: 'json' }}
                onChange={(newCode) => this.updateCode(newCode)}
              />
            </div>
          </Dialog>
        }
      </div>
    );
  }
}
