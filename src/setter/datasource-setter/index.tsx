import React, { PureComponent } from 'react'; // import classNames from 'classnames';
import { project, } from '@alilc/lowcode-engine';
import { Select } from '@alifd/next'
const { Option } = Select

interface DataSourceItem {
  id: string;
  isInit?: boolean;
  type?: string;
  options?: {
      uri: string;
      params?: {};
      method?: string;
      shouldFetch?: string;
      willFetch?: string;
      fit?: string;
      didFetch?: string;
  };
  dataHandler?: () => void;
}

interface DataSourceValue {
  type: string;
  value: string;
}

interface DataSourceProps {
  value: DataSourceValue;
  field: any;
  onChange: (value: DataSourceValue) => void,
}

interface DataSourceState {
  list: Array<DataSourceItem>;
  value: string;
}

class DataSourceView extends PureComponent<DataSourceProps, DataSourceState> {

  state: DataSourceState = {
    list: [],
    value: ''
  }

  componentDidMount() {
    console.log('DataSourceProps', this.props)
    const { field } = this.props
    const target = field.getValue()  // props值
    console.log(target)
    const id = target?.value?.split('this.dataSourceMap.')[1]?.split(' ')[0] ?? ''  // 获取数据源id JSFunction方式

    const exportSchema = project?.exportSchema()
    this.setState({
      list: exportSchema?.componentsTree[0]?.dataSource?.list ?? []  // 数据源列表
    }, () => {
      this.onChange(id)
    })
  }
  onChange = (value: string) => {
    console.log('onChange', value)
    const { list } = this.state
    const { onChange } = this.props  

    if(!!value && !list.map(item => item.id).includes(value)) return  // 过滤传入的值不是数据源列表中
    const propValue = {
      type: 'JSFunction',  // js函数式类型 按容器组件内react写法写
      value: !!value ? `function () { return this.dataSourceMap.${value} }` : ''
    }
    // 传递props参数
    onChange(propValue)

    this.setState({value})
  }
  render() {
    const { value, list } = this.state
    
    return (
      <Select
        style={{width: '100%'}}
        onChange={this.onChange}
        value={value}
      >
        {list.map(item => <Option key={item.id} value={item.id}>{item.id}</Option>)}
      </Select>
    )
  }
}

const DataSourceSetter = {
  component: DataSourceView,
  valueType: ['JSFunction'],
  defaultProps: { placeholder: '请选择' },
  recommend: true,
};

export default DataSourceSetter
