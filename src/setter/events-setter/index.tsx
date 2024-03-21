import { Component } from 'react';
import { Radio, Menu, Table, Icon } from '@alifd/next';
import { event, skeleton } from '@alilc/lowcode-engine';
import nativeEvents from './native-events';
import { cloneDeep } from 'lodash';
import './index.less';
import { create } from 'src/services/api';

const { Item, Group } = Menu;
const RadioGroup = Radio.Group;

const DEFINITION_EVENT_TYPE = {
  events: { label: '组件事件' },
  nativeEvents: { label: '原生事件' },
  lifeCycleEvent: { label: '生命周期' },
};

const SETTER_NAME = 'event-setter';

export default class EventsSetter extends Component<{
  value: any;
  definition: any;
  onChange: (eventList: any[]) => void;
}> {
  state = {
    eventBtns: [],
    selectType: null,
    eventListMap: cloneDeep(DEFINITION_EVENT_TYPE),
    eventDataList:
      (this.props?.value?.eventDataList
        ? this.props.value.eventDataList
        : this.props?.value) || [],
  };

  componentDidMount() {
    this.initEventList();
    event.on(`common:${SETTER_NAME}.bindEvent`, this.bindEvent);
  }

  componentWillUnmount() {
    event.off(`common:${SETTER_NAME}.bindEvent`, this.bindEvent);
  }

  initEventList() {
    const { eventListMap } = this.state;
    const { definition } = this.props;
    const eventBtns: { value: any; label: any }[] = [];
    definition.forEach((item: any) => {
      let list;
      if (item.type === 'nativeEvents') {
        list = item.list || cloneDeep(nativeEvents);
      } else {
        list = item.list || [];
      }
      this.checkEventListStatus(list);
      const obj = {
        ...(eventListMap[item.type] || {}),
        ...item,
        list,
      };
      eventListMap[item.type] = obj;
      if (list.length)
        eventBtns.push({ value: item.type, label: obj.label || item.type });
    });
    this.setState({ eventListMap, eventBtns });
  }

  checkEventListStatus = (eventList: any[]) => {
    const { eventDataList } = this.state;
    const func1 = (item: any) => {
      item.disabled = false;
      eventDataList.forEach((eventDataItem: any) => {
        if (item.name === eventDataItem.name) {
          item.disabled = true;
        }
      });
    };
    eventList.forEach((item) => {
      if (item.eventList) item.eventList.forEach(func1);
      else func1(item);
    });
  };

  /**
   * 渲染事件信息
   */
  renderEventInfoCell = (value, index, record) => {
    const { eventListMap } = this.state;
    let eventTagText = (eventListMap[record.type]?.label || '').substring(0, 1);
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
            onClick={() =>
              this.onRelatedEventNameClick(record.relatedEventName)
            }
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
          onClick={() =>
            this.openDialog(
              record.relatedEventName,
              record.name,
              true,
              record.type,
            )
          }
        />
        <Icon
          type="ashbin"
          className="event-operate-icon"
          onClick={() => this.openDeleteEventDialog(record.name)}
        />
      </div>
    );
  };

  updateEventListStatus = (eventName: string, unDisabled: boolean = false) => {
    const { eventListMap } = this.state;
    const func1 = (item: any) => {
      if (item.name === eventName) {
        item.disabled = !unDisabled;
      }
    };
    Object.values(eventListMap).forEach((item: any) => {
      item.list?.forEach((v: any) => {
        if (v.eventList) v.eventList.forEach(func1);
        else func1(v);
      });
    });
  };

  onRadioChange = (value: string) => {
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
    this.openDialog(eventName, eventName, false, selectType);
  };

  onRelatedEventNameClick = (eventName: string) => {
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
    const { eventDataList } = this.state;
    eventDataList.map((item, index) => {
      if (item.name === eventName) {
        eventDataList.splice(index, 1);
      }

      return item;
    });

    this.setState({
      eventDataList,
    });
    this.props.onChange({ eventDataList });
    this.updateEventListStatus(eventName, true);
  };

  openDialog = (
    relatedEventName: string,
    eventName: String,
    isEdit: boolean,
    type: string,
  ) => {
    const { eventDataList, eventListMap } = this.state;
    let paramStr;
    let configEventData; // 配置的event信息
    eventDataList.map((item) => {
      if (item.name == eventName) {
        paramStr = item.paramStr;
      }
      return item;
    });

    const func1 = (item: any) => {
      if (item.name == eventName) {
        configEventData = item;
      }
    };
    eventListMap[type]?.list.forEach((v: any) => {
      if (v.eventList) v.eventList.forEach(func1);
      else func1(v);
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

  bindEvent = (
    relatedEventName: string,
    paramStr: string,
    bindEventName: String,
  ) => {
    const { eventDataList } = this.state;
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

    this.props.onChange({ eventDataList });

    // this.closeDialog();
  };

  render() {
    const { eventBtns, selectType, eventDataList, eventListMap } = this.state;

    const eventList = selectType ? eventListMap[selectType]?.list : null;
    const createItem = (item) => (
      <Item key={item.name} disabled={item.disabled}>
        {item.name}
      </Item>
    );
    return (
      <div className="lc-block-setter event-body" onClick={this.closeEventMenu}>
        <RadioGroup
          dataSource={eventBtns}
          shape="button"
          size="medium"
          value={selectType}
          onChange={this.onRadioChange}
          style={{ width: '100%' }}
        />
        {eventList && (
          <Menu
            defaultOpenKeys="sub-menu"
            className="event-menu"
            onItemClick={this.onEventMenuClick}
          >
            {eventList.map((item, index) =>
              item.eventList ? (
                <Group label={item.name} key={index}>
                  {item.eventList.map(createItem)}
                </Group>
              ) : (
                createItem(item)
              ),
            )}
          </Menu>
        )}

        <div className="event-table">
          <Table dataSource={eventDataList} size="small">
            <Table.Column title="已有事件" cell={this.renderEventInfoCell} />
            <Table.Column
              title="操作"
              cell={this.renderEventOperateCell}
              width={70}
            />
          </Table>
        </div>
      </div>
    );
  }
}
