import * as React from 'react';
import { Box, Input, Radio } from '@alifd/next';
import { BehaviorActionProps, BehaviorAction } from '../types';

const findReact = (id: string, traverseUp = 0) => {
  const dom = document.querySelector(`#${id}`);
  if (!dom) return;
  const key = Object.keys(dom).find((item) => {
    return (
      item.startsWith('__reactFiber$') || // react 17+
      item.startsWith('__reactInternalInstance$')
    ); // react <17
  });
  const domFiber = dom[key];
  if (domFiber == null) return null;

  // react <16
  if (domFiber._currentElement) {
    let compFiber = domFiber._currentElement._owner;
    for (let i = 0; i < traverseUp; i++) {
      compFiber = compFiber._currentElement._owner;
    }
    return compFiber._instance;
  }

  // react 16+
  const GetCompFiber = (fiber) => {
    // return fiber._debugOwner; // this also works, but is __DEV__ only
    let parentFiber = fiber.return;
    while (typeof parentFiber.type === 'string') {
      parentFiber = parentFiber.return;
    }
    return parentFiber;
  };
  let compFiber = GetCompFiber(domFiber);
  for (let i = 0; i < traverseUp; i++) {
    compFiber = GetCompFiber(compFiber);
  }
  return compFiber.stateNode;
}

interface TooltipActionValue {
  content?: string;
  triggerType?: 'click' | 'hover';
}
interface TooltipActionOptions {
  id: string;
}

const TooltipActionContent: React.FC<BehaviorActionProps<TooltipActionValue, TooltipActionOptions>> = ({
  value = {}, onChange,
}) => {

  return (
    <Box>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>触发方式</Box>
        <Box className="behavior-radio">
          <Radio.Group
            size="small"
            dataSource={[
              'click',
              'hover',
            ]}
            defaultValue="click"
            shape="button"
            value={value.triggerType || 'click'}
            onChange={(triggerType: any) => {
              onChange({
                ...value,
                triggerType,
              });
            }}
          />
        </Box>
      </Box>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>通知内容</Box>
        <Box direction="row" className="behavior-radio" spacing={10}>
          <Input.TextArea
            size="small"
            placeholder="请输入内容"
            value={value.content}
            onChange={(content) => {
              onChange({
                ...value,
                content,
              });
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export const tooltipBehaviorAction: BehaviorAction<TooltipActionValue, TooltipActionOptions> = {
  name: 'tooltip',
  title: 'Tooltip',
  render: (props) => <TooltipActionContent {...props} />,
  toActionValue: (value, options) => ({
    type: 'JSExpression',
    value: `function() {
      const id = '${options.id}';
      const findReact = ${findReact};
      const node = findReact(id);
      if (!node) return;
      if (typeof node.enableTooltip === 'function') {
        node.enableTooltip('${value.triggerType}', '${value.content}');
      } else if (typeof node.toggleTip === 'function') {
        node.toggleTip('${value.content}');
      }
    }`,
  }),
};
