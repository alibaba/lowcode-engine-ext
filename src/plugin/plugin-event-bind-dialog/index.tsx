import { Component } from 'react';
import * as React from 'react';
import { event, project, skeleton } from '@alilc/lowcode-engine';
import { Dialog, Search, Input, Balloon, Icon, Switch, Message } from '@alifd/next';
import { PluginProps } from '@alilc/lowcode-types';
import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';
import './index.less';

const defaultParams = '{\n \t "testKey":123 \n}';
// 模板变量占位
const tempPlaceHolder = '${extParams}';
const tempPlaceHolderReg = /\$\{extParams\}/g;

const propEventsReg = /(this\.)?props\.[a-zA-Z0-9\-_]+/;

const defaultEditorOption = {
  height:'319px',
  width:'100%',
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
};

const SystemEventNameMap: any = {
  componentDidMount: true,
  constructor: true,
  componentWillMount: true,
  shouldComponentUpdate: true,
  componentDidUpdate: true,
  render: true,
  componentWillUnmount: true,
};

const HelpTip = (props) => {
  const { children, className, align = 't', style = {}, iconStyle = {}, size = 'xs' } = props;
  const icon = <Icon style={iconStyle} size={size} type="help" />;
  const bConfig = {
    align,
    className,
    style,
    closable: false,
    needAdjust: true,
    shouldUpdatePosition: true,
    trigger: icon,
  };

  return <Balloon {...bConfig}>{children}</Balloon>;
};

export default class EventBindDialog extends Component<PluginProps> {
  private eventList: any[] = [
    // {
    //   name: 'getData',
    // },
    // {
    //   name: 'deleteData',
    // },
    // {
    //   name: 'initData',
    // },
    // {
    //   name: 'editData',
    // },
    // {
    //   name: 'submitData',
    // },
  ];

  private relatedEventName = '';
  private bindEventName = '';

  state: any = {
    visiable: false,
    setterName: 'event-setter',
    selectedEventName: '',
    eventName: '',
    paramStr: '',
    configEventData: null,
    useParams: false,
  };

  openDialog = (bindEventName: string, relatedEventName: string, isEdit: boolean) => {
    this.relatedEventName = relatedEventName;
    this.bindEventName = bindEventName;
    this.initEventName(isEdit);
  };

  closeDialog = () => {
    this.setState({
      visiable: false,
    });
  };

  componentDidMount() {
    const { config } = this.props;
    event.on(
      `common:${config.pluginKey}.openDialog`,
      (
        relatedEventName: string,
        setterName: string,
        paramStr: string,
        isEdit: boolean,
        bindEventName: string,
        configEventData: object,
      ) => {
        this.setState({
          setterName,
          paramStr: this.formatParmaStr(paramStr),
          configEventData,
          useParams: !!paramStr,
        });

        const schema = project.exportSchema();

        const pageNode = schema.componentsTree[0];
        if (pageNode.methods) {
          this.eventList = [];
          for (const key in pageNode.methods) {
            this.eventList.push({
              name: key,
            });
          }
        }

        this.openDialog(bindEventName, relatedEventName, isEdit);
      },
    );
  }

  initEventName = (isEdit?: boolean) => {
    let eventName = this.relatedEventName;

    if (!isEdit) {
      this.eventList.forEach((item) => {
        if (item.name === eventName) {
          eventName = `${eventName}_new`;
        }
      });
    }

    this.setState({
      eventName,
      selectedEventName: isEdit ? eventName : '',
      visiable: true,
    });
  };

  onInputChange = (eventName: string) => {
    this.setState({
      eventName,
    });
  };

  onSelectItem = (eventName: string) => {
    this.setState({
      selectedEventName: eventName,
    });

    // 为空是新建事件
    if (eventName === '') {
      this.initEventName();
    } else {
      this.setState({
        selectedEventName: eventName,
        eventName,
      });
    }
  };

  onSearchEvent = () => {};

  onChange = (checked: boolean) => {
    this.setState({
      useParams: checked,
    });
  };

  /**
   * 将paramStr包装成一个js对象，防止monaco格式报错
   */
  formatParmaStr = (paramStr: string) => {
    if (!paramStr) {
      return defaultParams;
    } else {
      return paramStr;
    }
  };

  pickupFunctionName = (codeStr: string) => {
    return codeStr.substr(0, codeStr.indexOf('('));
  };

  removeSpace = (str: string) => {
    return str.replace(/\s*/g, '');
  };

  formatTemplate = (template: string, eventName: string, useParams: boolean) => {
    let formatTemp;
    if (template) {
      const functionName = this.pickupFunctionName(template);

      formatTemp = template.replace(new RegExp(`^s*${  functionName}`), eventName);
      if (useParams) {
        formatTemp = formatTemp.replace(tempPlaceHolderReg, 'extParams');

      } else {
        const leftIndex = formatTemp.indexOf('(');
        const rightIndex = formatTemp.indexOf(')');
        // 提取括号中的参数列表
        const paramList = formatTemp.substr(leftIndex + 1, rightIndex - (leftIndex + 1)).split(',');

        paramList.map((item, index) => {
          if (this.removeSpace(item) === tempPlaceHolder) {
            paramList.splice(index, 1);
          }
          return item;
        });

        // 重新join进去

        formatTemp =
          `${formatTemp.substr(0, leftIndex)
          }(${
          paramList.join(',')
          })${
          formatTemp.substr(rightIndex + 1, formatTemp.length)}`;
      }
    }

    return formatTemp;
  };

  formatEventName = (eventName: string) => {
    // 支持绑定this.props.xxxx
    if (propEventsReg.test(eventName)) {
      return eventName.replace(/(this\.)|(\s+)/, '');
    }
    const newEventNameArr = eventName.split('');
    const index = eventName.indexOf('.');
    if (index >= 0) {
      newEventNameArr[index + 1] = newEventNameArr[index + 1].toUpperCase();
    }
    return newEventNameArr.join('').replace(/\./, '');
  };

  onOk = () => {
    const { editor } = this.props;
    const { setterName, eventName, paramStr, configEventData = {}, useParams } = this.state;

    const formatEventName = this.formatEventName(eventName);

    if (SystemEventNameMap[formatEventName]) {
      Message.error('不可以绑定到系统内置函数,请修改函数名以后重新绑定');
      return;
    }

    event.emit(
      `${setterName}.bindEvent`,
      formatEventName,
      useParams ? paramStr : undefined,
      this.bindEventName,
    );

    // 选中的是新建事件 && 注册了sourceEditor面板
    if (this.state.selectedEventName == '' && !propEventsReg.test(formatEventName)) {
      // 判断面板是否处于激活状态
      skeleton.showPanel('codeEditor');
      const formatTemp = this.formatTemplate(configEventData.template, formatEventName, useParams);
      setTimeout(() => {
        event.emit('codeEditor.addFunction', {
          functionName: formatEventName,
          template: formatTemp,
        });
      }, 200);
    }

    this.closeDialog();
  };

  onChangeEditor = (paramStr: string) => {
    this.setState({
      paramStr,
    });
  };

  render() {
    const { selectedEventName, eventName, visiable, paramStr, useParams } = this.state;
    // console.log('selectedEventName:' + selectedEventName);
    return (
      <Dialog
        visible={visiable}
        title="事件绑定"
        onClose={this.closeDialog}
        onCancel={this.closeDialog}
        onOk={() => this.onOk()}
      >
        <div className="event-dialog-body">
          <div className="dialog-left-container">
            <div className="dialog-small-title">事件选择</div>

            <div className="dialog-left-context">
              <ul className="event-type-container">
                <li className="select-item">内置函数</li>
                <li className="select-item select-item-active">组件事件</li>
              </ul>

              <div className="event-select-container">
                <div>
                  <Search className="event-search-box" shape="simple" />

                  <ul className="event-list">
                    <li
                      className={
                        selectedEventName == '' ? 'select-item select-item-active' : 'select-item'
                      }
                      onClick={() => this.onSelectItem('')}
                    >
                      新建事件
                    </li>
                    {this.eventList.map((item, index) => (
                      <li
                        key={index}
                        className={
                          selectedEventName == item.name
                            ? 'select-item select-item-active'
                            : 'select-item'
                        }
                        onClick={() => this.onSelectItem(item.name)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="dialog-right-container">
            <div className="dialog-small-title">
              事件名称
              {(window as any).lowcodeSetterSwitch?.enablePropsEvents && (
                <HelpTip iconStyle={{marginLeft: 4}}>
                  如需绑定 props 属性，可通过 props.xxx 进行绑定
                </HelpTip>
              )}
            </div>
            <div className="event-input-container">
              <Input style={{ width: '100%' }} value={eventName} onChange={this.onInputChange} />
            </div>

            <div className="dialog-small-title">
              扩展参数设置{' '}
              <HelpTip>
                扩展参数做为单独的一个json格式入参追加在原有透传参数之后 如:onClick
                (event,extParams)
              </HelpTip>
              <Switch
                checked={useParams}
                size="small"
                style={{ marginLeft: '10px' }}
                autoWidth
                checkedChildren="启用"
                unCheckedChildren="关闭"
                onChange={this.onChange}
              />
            </div>
            <div className="editor-container">
              <MonacoEditor
                value={paramStr}
                {...defaultEditorOption}
                {...{ language: 'json' }}
                onChange={(newCode: string) => this.onChangeEditor(newCode)}
              />
              {!useParams && <div className="mask" />}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
