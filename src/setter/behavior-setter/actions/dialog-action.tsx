import * as React from 'react';
import { useEffect, useState } from 'react';
import { SettingTarget } from '@alilc/lowcode-types';
import { Select, Box } from '@alifd/next';
import { BehaviorActionProps, BehaviorAction } from '../types';

interface DialogActionValue {
  id?: string;
}

const getDialogList = (field: SettingTarget) => {
  const node = (field as any).getNode();
  const nodeDocument = node.document || node.page;
  let nodeList = nodeDocument?.modalNodesManager?.getModalNodes?.();
  if (!nodeList || !nodeList.length) {
    nodeDocument?.modalNodesManager?.setNodes?.();
    nodeList = nodeDocument?.modalNodesManager?.getModalNodes?.();
  }

  return (nodeList || [])
    .filter((x: any) => x && x.propsData)
    .map((x: any) => ({
      label:
        x.propsData && x.propsData.title
          ? `${x.propsData.title}(${x.id})`
          : `${x.id}(${x.componentName})`,
      value: x.propsData.ref,
    }));
};

const DialogContent: React.FC<BehaviorActionProps> = ({ value = {}, onChange, field }) => {
  const [dialogList, setDialogList] = useState([]);
  useEffect(() => {
    setDialogList(getDialogList(field));
  }, [field]);
  return (
    <Box direction="row" align="center" className="behavior-item">
      <Box style={{ width: 70 }}>绑定弹窗</Box>
      <Box className="behavior-radio">
        <Select
          size="small"
          hasClear
          value={value.id}
          onChange={(val) => onChange({ id: val })}
          dataSource={dialogList}
          style={{ width: '100%', marginRight: 8 }}
        />
      </Box>
    </Box>
  );
};


export const dialogBehaviorAction: BehaviorAction<DialogActionValue> = {
  name: 'dialog',
  title: '弹窗',
  render: (props) => <DialogContent {...props} />,
  toActionValue: (value) => (value.id ? {
    type: 'JSExpression',
    value: `function() {
      const dialog = this.$('${value.id}');
      dialog.show();
    }`,
  } : null),
};
