import React, { PureComponent } from 'react';
import { Select } from '@alifd/next';
import { project } from '@alilc/lowcode-engine';
import './index.less';

export interface PluginProps {
  value: string;
  onChange: any;
}

export default class ClassNameView extends PureComponent<PluginProps> {
  static display = 'ClassName';

  static defaultProps = {};

  state = {
    dataSource: [],
    selectValue: '',
  };

  getClassNameList = () => {
    const schema = ClassNameView?.defaultProps?.getSchema?.() || project.exportSchema();

    const css = schema.componentsTree[0].css;
    return css?.match(/(?<=\.)\w+(?=\s*[{,])/g) || [];
  };

  setClassNameSetterData = () => {
    const { value } = this.props;
    const classNameList = this.getClassNameList();
    const dataSource: { label: string; value : string}[] = [];
    classNameList.map((item: string) => {
      dataSource.push({
        value: item,
        label: item,
      });

      return item;
    });

    const selectValue = value?.split?.(' ') || [];
    selectValue.forEach(current => {
      if(!classNameList.some((cls: string) => cls === current)) {
        dataSource.push({
          value: current,
          label: current,
        });
      }
    })

    this.setState({
      dataSource,
      selectValue,
    });
  };

  handleChange = (value: string[]) => {
    const { onChange } = this.props;
    onChange(value.join(' '));
    this.setState({
      selectValue: value,
    });
  };

  componentWillMount() {
    this.setClassNameSetterData();
  }

  render() {
    const { dataSource, selectValue } = this.state;
    return (
      <Select
        className='ClassNameSetter_Select'
        style={{ width: '100%' }}
        mode="multiple"
        dataSource={dataSource}
        onFocus={this.setClassNameSetterData}
        onChange={this.handleChange}
        value={selectValue}
      />
    );
  }
}
