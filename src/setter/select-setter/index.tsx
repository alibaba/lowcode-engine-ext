import React, { PureComponent } from 'react';
import { Select } from '@alifd/next';

interface SelectSetterProps {
  onChange: (value: string) => undefined;
  value?: any;
  mode?: 'single' | 'multiple' | 'tag';
  defaultValue?: any;
  options: any[] | Function;
  /**
   * 展开后是否能搜索
   */
  showSearch?: boolean;
  // 是否可以清除
  hasClear?: boolean
}

interface SelectSetterState {
  setterValue: string | null;
}

const formateOptions = (options: any[] | Function) => {
  if (typeof options === 'function') {
    return options();
  }
  return options.map((item: any) => {
    if (item.children) {
      const children = item.children.map((child: any) => {
        return {
          label: child.title || child.label || '-',
          value: child.value,
          disabled: child.disabled || false,
        };
      });
      return {
        label: item.title || item.label || '-',
        children,
      };
    } else {
      return {
        label: item.title || item.label || '-',
        value: item.value,
        disabled: item.disabled || false,
      };
    }
  });
};

export default class SelectSetter extends PureComponent<SelectSetterProps, SelectSetterState> {
  static defaultProps = {
    placeholder: '请选择',
    options: [{ label: '-', value: '' }],
    defaultValue: null as any,
    onChange: () => undefined as any,
  };

  static displayName = 'SelectSetter';

  state: SelectSetterState = {
    setterValue: null,
  };

  render() {
    const { options, onChange, mode, value, showSearch, hasClear } = this.props;
    return (
      <Select
        autoWidth={false}
        size="small"
        value={value}
        dataSource={formateOptions(options)}
        mode={mode}
        onChange={(val) => {
          onChange && onChange(val);
        }}
        style={{ width: '100%' }}
        showSearch={showSearch}
        hasClear={hasClear}
      />
    );
  }
}
