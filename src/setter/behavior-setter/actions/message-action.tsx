import * as React from 'react';
import { Select, Box, Input } from '@alifd/next';
import { BehaviorActionProps, BehaviorAction } from '../types';

interface MessageActionValue {
  type?: string;
  content?: string;
}
interface MessageActionOptions {
  defaultType?: string;
  types: string[];
  library: string;
  component: string;
}

function fillDefaultValue(value: MessageActionValue) {
  if (typeof value !== 'object') {
    console.warn('value passed to fillDefaultValue should be an object');
    return;
  }
  if (!value.type) {
    value.type = 'notice';
  }
}

const MessageActionContent: React.FC<BehaviorActionProps<MessageActionValue, MessageActionOptions>> = ({
  value = {}, onChange, options,
}) => {
  fillDefaultValue(value);
  const { types } = options;
  return (
    <Box>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>通知类型</Box>
        <Box className="behavior-radio">
          <Select
            size="small"
            dataSource={types}
            defaultValue="notice"
            value={value?.type || 'notice'}
            onChange={(val) => {
              onChange({
                ...value,
                type: val,
              });
            }}
          />
        </Box>
      </Box>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>通知内容</Box>
        <Box className="behavior-radio">
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

export const messageBehaviorAction: BehaviorAction<MessageActionValue, MessageActionOptions> = {
  name: 'message',
  title: '提示',
  render: (props) => <MessageActionContent {...props} />,
  toActionValue: (value, options) => {
    const { library, component, defaultType } = options;
    return {
      type: 'JSExpression',
      value: `function() {${library}.${component}.${value.type || defaultType}('${value.content}')}`,
    };
  },
};
