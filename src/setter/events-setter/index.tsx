import { Component } from 'react';
import { Radio, Menu, Table, Icon } from '@alifd/next';
import { event, project, skeleton } from '@alilc/lowcode-engine';
import nativeEvents from './native-events';

import './index.less';

const { Item, Group } = Menu;
const RadioGroup = Radio.Group;
const EVENT_CONTENTS = {
  COMPONENT_EVENT: 'componentEvent',
  NATIVE_EVENT: 'nativeEvent',
  LIFE_CYCLE_EVENT: 'lifeCycleEvent',
};

const DEFINITION_EVENT_TYPE = {
  EVENTS: 'events',
  NATIVE_EVENTS: 'nativeEvents',
  LIFE_CYCLE_EVENT: 'lifeCycleEvent',
};

const SETTER_NAME = 'event-setter';

export default class EventsSetter extends Component<{
  value: any[];
  onChange: (eventList: any[]) => void;
}> {
  state = {
    eventBtns: [],
    eventList: [],
    selectType: null,
    nativeEventList: [],
    lifeCycleEventList: [],
    isRoot: false,
    eventDataList:
      (this.props?.value?.eventDataList ? this.props.value.eventDataList : this.props?.value) || [],
  };

  // constructor (){
  //   super();
  //   debugger;
  //   // if (!this.props || !this.props.value){
  //   //   this.setState({
  //   //     eventDataList:[]
  //   //   })
  //   // }
  // }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   debugger;
  //   // const { value } = nextProps;
  //   // debugger;
  //   // if (value !== prevState.eventDataList) {
  //   //   return {
  //   //     value,
  //   //   };
  //   // }
  //   return null;
  // }

  componentDidMount() {
    // console.log(this.state.eventDataList);
    this.initEventBtns();

    this.initEventList();
    event.on(`common:${SETTER_NAME}.bindEvent`, this.bindEvent);
  }

  componentWillUnmount() {
    event.off(`common:${SETTER_NAME}.bindEvent`, this.bindEvent);
  }

  initLifeCycleEventDataList = () => {
    const { isRoot } = this.state;
    if (isRoot && !this.props.value) {
      const schema = project.exportSchema();

      const lifeCycles = schema.componentsTree[0].lifeCycles;
      const eventDataList = [];
      if (lifeCycles) {
        for (const key in lifeCycles) {
          eventDataList.push({
            name: key,
            relatedEventName: key,
            type: EVENT_CONTENTS.LIFE_CYCLE_EVENT,
          });
        }

        this.setState({
          eventDataList,
        });
      }
    }
  };

  /**
   * 初始化事件按钮
   */
  initEventBtns() {
    const { definition } = this.props;
    let isRoot = false;
    let isCustom = false;
    let eventBtns = [];
    definition.map((item) => {
      if (item.type === DEFINITION_EVENT_TYPE.LIFE_CYCLE_EVENT) {
        isRoot = true;
      }

      if (item.type === DEFINITION_EVENT_TYPE.EVENTS) {
        isCustom = true;
      }

      return item;
    });

    if (isRoot) {
      eventBtns = [
        {
          value: EVENT_CONTENTS.LIFE_CYCLE_EVENT,
          label: '生命周期',
        },
      ];
    } else if (isCustom) {
      eventBtns = [
        {
          value: EVENT_CONTENTS.COMPONENT_EVENT,
          label: '组件自带事件',
        },
      ];
    } else {
      eventBtns = [
        {
          value: EVENT_CONTENTS.NATIVE_EVENT,
          label: '原生事件',
        },
      ];
    }

    this.setState(
      {
        eventBtns,
        isRoot,
      },
      this.initLifeCycleEventDataList,
    );
  }

  initEventList() {
    const { definition } = this.props;
    let nativeEventList = [];
    definition.map((item) => {
      if (item.type === DEFINITION_EVENT_TYPE.EVENTS) {
        this.checkEventListStatus(item.list, DEFINITION_EVENT_TYPE.EVENTS);
        this.setState({
          eventList: item.list,
        });
      }

      if (item.type === DEFINITION_EVENT_TYPE.NATIVE_EVENTS) {
        this.checkEventListStatus(item.list, DEFINITION_EVENT_TYPE.NATIVE_EVENTS);
        nativeEventList = item.list;
      }

      if (item.type === DEFINITION_EVENT_TYPE.LIFE_CYCLE_EVENT) {
        this.checkEventListStatus(item.list, DEFINITION_EVENT_TYPE.LIFE_CYCLE_EVENT);
        this.setState({
          lifeCycleEventList: item.list,
        });
      }

      return item;
    });

    if (nativeEventList.length == 0) {
      nativeEventList = nativeEvents;
      this.setState({
        nativeEventList,
      });
    }
  }

  checkEventListStatus = (eventList: any[], eventType: string) => {
    const { eventDataList } = this.state;
    if (
      eventType === DEFINITION_EVENT_TYPE.EVENTS ||
      eventType === DEFINITION_EVENT_TYPE.LIFE_CYCLE_EVENT
    ) {
      eventList.map((item) => {
        item.disabled = false;
        eventDataList.map((eventDataItem) => {
          if (item.name === eventDataItem.name) {
            item.disabled = true;
          }

          return eventDataItem;
        });

        return item;
      });
    } else if (eventType === DEFINITION_EVENT_TYPE.NATIVE_EVENTS) {
      eventDataList.map((eventDataItem) => {
        eventList.map((item) => {
          item.eventList.map((eventItem) => {
            if (eventItem.name === eventDataItem.name) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
            return eventItem;
          });
          return item;
        });

        return eventDataItem;
      });
    }
  };

  /**
   * 渲染事件信息
   */
  renderEventInfoCell = (value, index, record) => {
    let eventTagText = '';
    if (record.type === EVENT_CONTENTS.NATIVE_EVENT) {
      eventTagText = '原';
    } else if (record.type === EVENT_CONTENTS.COMPONENT_EVENT) {
      eventTagText = '组';
    } else if (record.type === EVENT_CONTENTS.LIFE_CYCLE_EVENT) {
      eventTagText = '生';
    }
    return (
      <div>
        <div className="event-cell">
          <div className="event-type-tag">{eventTagText}</div>
          {record.name}
        </div>
        <div className="event-cell" style={{ marginTop: '8px' }}>
          <Icon type="attachment" size="small" className="related-icon" />
          <span
            className="related-event-name"
            onClick={() => this.onRelatedEventNameClick(record.relatedEventName)}
          >
            {record.relatedEventName || ''}
          </span>
        </div>
      </div>
    );
  };

  /**
   * 渲染事件操作项
   */
  renderEventOperateCell = (rowIndex, colIndex, record) => {
    return (
      <div>
        <Icon
          type="set"
          className="event-operate-icon"
          style={{ marginLeft: '3px', marginRight: '4px' }}
          onClick={() => this.openDialog(record.relatedEventName, record.name, true)}
        />
        <Icon
          type="ashbin"
          className="event-operate-icon"
          onClick={() => this.openDeleteEventDialog(record.name)}
        />
      </div>
    );
  };

  updateEventListStatus = (eventName: string, unDisabled: boolean) => {
    const { eventList, nativeEventList, lifeCycleEventList } = this.state;
    eventList.map((item) => {
      if (item.name === eventName) {
        item.disabled = !unDisabled;
      }
      return item;
    });

    lifeCycleEventList.map((item) => {
      if (item.name === eventName) {
        item.disabled = !unDisabled;
      }
      return item;
    });

    nativeEventList.map((item) => {
      item.eventList.map((itemData) => {
        if (itemData.name === eventName) {
          itemData.disabled = !unDisabled;
        }
        return itemData;
      });

      return item;
    });
  };

  onRadioChange = (value) => {
    this.setState({
      selectType: value,
    });
  };

  onEventMenuClick = (eventName: string) => {
    const { selectType, eventDataList } = this.state;
    eventDataList.push({
      type: selectType,
      name: eventName,
    });

    this.setState({
      eventDataList,
    });

    this.updateEventListStatus(eventName);
    this.closeEventMenu();
    this.openDialog(eventName, eventName);
  };

  onRelatedEventNameClick = (eventName: string) => {
    // props 事件，不需要跳转
    if (/(this\.)?props\./.test(eventName)) {
      return;
    }
    skeleton.showPanel('codeEditor');
    setTimeout(() => {
      event.emit('codeEditor.focusByFunction', {
        functionName: eventName,
      });
    });
    // editor.emit('sourceEditor.focusByFunction',{
    //   functionName:eventName
    // })
  };

  closeEventMenu = () => {
    if (this.state.selectType !== null) {
      this.setState({
        selectType: null,
      });
    }
  };

  openDeleteEventDialog = (eventName: string) => {
    this.deleteEvent(eventName);
    // Dialog.confirm({
    //   title: '删除事件',
    //   content: '确定删除当前事件吗',
    //   onOk: () => this.deleteEvent(eventName),
    // });
  };

  deleteEvent = (eventName: string) => {
    const { eventDataList, eventList } = this.state;
    eventDataList.map((item, index) => {
      if (item.name === eventName) {
        eventDataList.splice(index, 1);
      }

      return item;
    });

    this.setState({
      eventDataList,
    });
    this.props.onChange({ eventDataList, eventList });
    this.updateEventListStatus(eventName, true);
  };

  openDialog = (relatedEventName: string, eventName: String, isEdit: boolean) => {
    const { eventDataList, eventList } = this.state;
    let paramStr;
    let configEventData; // 配置的event信息
    eventDataList.map((item) => {
      if (item.name == eventName) {
        paramStr = item.paramStr;
      }
      return item;
    });

    eventList.map((item) => {
      if (item.name == eventName) {
        configEventData = item;
      }
      return item;
    });
    // this.setBindEventName(bindEventName);
    event.emit(
      'eventBindDialog.openDialog',

      relatedEventName,
      SETTER_NAME,
      paramStr,
      isEdit,
      eventName,
      configEventData,
    );
  };

  bindEvent = (relatedEventName: string, paramStr: string, bindEventName: String) => {
    const { eventDataList, eventList } = this.state;
    eventDataList.map((item) => {
      if (item.name === bindEventName) {
        item.relatedEventName = relatedEventName;
        // if (paramStr) {
        item.paramStr = paramStr;
        // }
      }

      return item;
    });

    this.setState({
      eventDataList,
    });

    this.props.onChange({ eventDataList, eventList });

    // this.closeDialog();
  };

  render() {
    const { eventBtns, eventList, nativeEventList, lifeCycleEventList, selectType, eventDataList } =
      this.state;
    const showEventList = lifeCycleEventList.length > 0 ? lifeCycleEventList : eventList;

    // console.log('eventDataList', eventDataList);

    return (
      <div className="lc-block-setter event-body" onClick={this.closeEventMenu}>
        <div className="event-title">
          {eventBtns.length > 1 ? <span>点击选择事件类型</span> : <span>点击绑定事件</span>}
        </div>

        <RadioGroup
          dataSource={eventBtns}
          shape="button"
          size="medium"
          value={selectType}
          onChange={this.onRadioChange}
          style={{ width: '100%' }}
        />
        {selectType && selectType != EVENT_CONTENTS.NATIVE_EVENT && (
          <Menu
            defaultOpenKeys="sub-menu"
            className="event-menu"
            onItemClick={this.onEventMenuClick}
            style={{ width: document.body.clientWidth < 1860 ? '256px' : '357px' }}
          >
            {showEventList.map((item) => (
              <Item key={item.name} helper={item.description} disabled={item.disabled}>
                {item.name}
              </Item>
            ))}
          </Menu>
        )}

        {selectType && selectType === EVENT_CONTENTS.NATIVE_EVENT && (
          <Menu
            defaultOpenKeys="sub-menu"
            className="event-menu"
            onItemClick={this.onEventMenuClick}
          >
            {nativeEventList.map((item, index) => (
              <Group label={item.name} key={index}>
                {item.eventList.map((groupItem) => (
                  <Item key={groupItem.name} disabled={groupItem.disabled}>
                    {groupItem.name}
                  </Item>
                ))}
              </Group>
            ))}
          </Menu>
        )}

        <div className="event-table">
          <Table dataSource={eventDataList} size="small">
            <Table.Column title="已有事件" cell={this.renderEventInfoCell} />
            <Table.Column title="操作" cell={this.renderEventOperateCell} width={70} />
          </Table>
        </div>
      </div>
    );
  }
}
