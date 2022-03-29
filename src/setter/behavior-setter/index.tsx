import * as React from 'react';
import { useState, ErrorInfo, useMemo } from 'react';
import { Radio, Select, Box } from '@alifd/next';
import { SettingTarget, CustomView } from '@alilc/lowcode-types';

import './index.scss';
import { BehaviorAction } from './types';
import { linkBehaviorAction } from './actions/link-action';
import { dialogBehaviorAction } from './actions/dialog-action';
import { messageBehaviorAction } from './actions/message-action';
import { tooltipBehaviorAction } from './actions/tooltip-action';

interface BehaviorSetterProps {
  field?: SettingTarget;
  // 兼容 vision engine
  prop?: SettingTarget;
  onChange: Function;
  actions: string[];
  type?: 'dialog' | 'link' | undefined;
  value: Record<string, any>;
  url?: 'string';
  responseFormatter?: Function;
  extraBehaviorActions?: BehaviorAction[];
  extendedOptions?: Record<string, any>;
  enableMessageAction?: boolean;
  enableTooltipAction?: boolean;
}

const defaultActionMap = {
  dialog: dialogBehaviorAction,
  link: linkBehaviorAction,
  tooltip: tooltipBehaviorAction,
  message: messageBehaviorAction,
};
const BehaviorSetter: CustomView = ({
  value: behaviors = {},
  onChange,
  field: propsField,
  prop,
  actions,
  type: propsType,
  extraBehaviorActions: propsBehaviorActions = [],
  extendedOptions = {},
  url,
  responseFormatter,
  enableMessageAction,
  enableTooltipAction,
}: BehaviorSetterProps) => {
  const field = propsField || prop;

  const [currentEvent, setCurrentEvent] = useState(actions[0]);
  /** 当前的行为集合 */

  const currentBehavior = behaviors[currentEvent] || {};
  const currentBehaviorType = currentBehavior.type || propsType || 'dialog';
  const defaultActions: any = [];
  defaultActions.push(defaultActionMap.dialog, defaultActionMap.link);
  if (enableMessageAction) {
    defaultActions.push(defaultActionMap.message);
  }
  if (enableTooltipAction) {
    defaultActions.push(defaultActionMap.tooltip);
  }
  const behaviorActions = useMemo(() => [
    ...defaultActions,
    ...propsBehaviorActions,
  ], [propsBehaviorActions]);

  const updateCurrentEventBehavior = (type: string, newVal: any) => {
    onChange({
      ...behaviors,
      [currentEvent]: {
        type,
        [type]: newVal,
      },
    });
  };
  const behaviorOption = behaviorActions.find((vo) => vo.name === currentBehaviorType);

  return (
    <div>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>事件列表</Box>
        <Box className="behavior-radio">
          <Select
            size="small"
            dataSource={actions.map((action) => ({
              label: action,
              value: action,
            }))}
            value={currentEvent}
            onChange={(eventName) => setCurrentEvent(eventName)}
          />
        </Box>
      </Box>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>操作类型</Box>
        <Box className="behavior-radio">
          <Radio.Group
            size="small"
            dataSource={behaviorActions.map((vo) => ({
              value: vo.name,
              label: vo.title,
              disabled: propsType && vo.name !== propsType,
            }))}
            value={currentBehaviorType}
            shape="button"
            onChange={(behaviorType: string) => updateCurrentEventBehavior(behaviorType, undefined)}
          />
        </Box>
      </Box>
      <ErrorBoundary>
        {behaviorOption && behaviorOption.render({
          field,
          value: currentBehavior[currentBehaviorType],
          onChange: (behaviorValue: Record<string, any>) => {
            field.parent.setPropValue(currentEvent, behaviorOption.toActionValue(behaviorValue, extendedOptions[currentBehaviorType]));
            updateCurrentEventBehavior(currentBehaviorType, behaviorValue);
          },
          options: currentBehaviorType === 'link' ? {
            ...extendedOptions[currentBehaviorType],
            url,
            responseFormatter,
          } : extendedOptions[currentBehaviorType],
        })}
      </ErrorBoundary>
    </div>
  );
};

export default BehaviorSetter;


// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
class ErrorBoundary extends React.Component {
  // 更新 state 使下一次渲染能够显示降级后的 UI
  static getDerivedStateFromError = (error: any) => ({ hasError: true, error });

  state = { hasError: false, error: undefined as Error };
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <div>渲染异常: {this.state.error?.message || this.state.error || ''}</div>;
    }

    return this.props.children;
  }
}
