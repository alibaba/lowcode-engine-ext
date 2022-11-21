import { Component } from 'react';
import { Button, Input, Icon, Switch, Select } from '@alifd/next';
import './index.less';

interface Template {
  // 模板标签
  label: string;
  // 模板ID
  value: string;
  // 模板内容
  content: object;
}

export default class SlotSetter extends Component<{
  value: any;
  defaultValue: any;
  checkedText?: string;
  unCheckedText?: string;
  hideParams?: boolean;
  onChange?: (value: any) => void;
  onInitial?: () => void;
  // 是否支持设置入参
  supportParams?: boolean;
  templates: Template[];
}> {
  onChangeSwitch = (checked: boolean) => {
    const { onChange } = this.props;
    if (checked) {
      this.handleInitial();
    } else {
      onChange && onChange(null);
    }
  };

  private handleInitial = () => {
    const { onChange, onInitial } = this.props;
    if (onInitial) {
      onInitial();
      return;
    }
    if (!onChange) {
      return;
    }

    onChange({
      type: 'JSSlot',
      value: null,
    });
  };

  // 模板选择事件
  private onTemplateChange = (value: any) => {
    const { onChange, templates } = this.props;
    if (value === 'jsslot') {
      this.handleInitial();
    } else if (value === 'disable') {
      onChange && onChange(null);
    } else {
      const template = templates.find((item) => item.value === value);
      if (template) {
        onChange &&
          onChange({
            ...template.content,
            name: template.value,
          });
      }
    }
  };

  private slotIsOpen = (initialValue: any) => {
    if (initialValue) {
      const { value, visible } = initialValue;
      if (value) {
        if (visible == undefined) {
          if (Array.isArray(value) && value.length == 0) {
            return false;
          } else if (value?.length > 0) {
            return true;
          }
        } else {
          return visible;
        }
      }
    }

    return false;
  };

  render() {
    const {
      value,
      onChange,
      supportParams,
      hideParams,
      checkedText = '启用',
      unCheckedText = '关闭',
      templates,
    } = this.props;

    const isOpenSlot = this.slotIsOpen(value);

    let switchComponent = null;
    if (templates) {
      // 模板场景下，使用下拉列表切换
      const templateName = value?.name || (isOpenSlot ? 'jsslot' : 'disable');
      switchComponent = (
        <Select
          dataSource={templates}
          defaultValue={templateName}
          onChange={this.onTemplateChange}
          autoWidth={false}
        />
      );
    } else {
      // 标准场景下，使用开关进行切换
      switchComponent = (
        <Switch
          autoWidth
          checked={!!value}
          defaultChecked={isOpenSlot}
          onChange={(checked) => this.onChangeSwitch(checked)}
          size="small"
          checkedChildren={checkedText}
          unCheckedChildren={unCheckedText}
        />
      );
    }

    const hasParams = value && value.params && Array.isArray(value.params);
    return (
      <div className="lc-setter-slot lc-setter-slot-column">
        {switchComponent}
        {!hideParams && hasParams ? (
          <Input
            className="lc-slot-params"
            addonTextBefore="入参"
            placeholder="插槽入参，以逗号风格"
            value={value.params!.join(',')}
            onChange={(val) => {
              val = val.trim();
              const params = val ? val.split(/ *, */) : [];
              onChange &&
                onChange({
                  ...value,
                  params: params.length == 0 ? [''] : params,
                });
            }}
            addonAfter={
              <Button
                type="secondary"
                onClick={() => {
                  onChange &&
                    onChange({
                      ...value,
                      params: [''],
                    });
                }}
              >
                <Icon type="close" />
              </Button>
            }
          />
        ) : supportParams ? (
          <Button
            className="lc-slot-params"
            type="primary"
            onClick={() => {
              onChange &&
                onChange({
                  ...value,
                  params: [],
                });
            }}
          >
            添加入参
          </Button>
        ) : null}
      </div>
    );
  }
}
