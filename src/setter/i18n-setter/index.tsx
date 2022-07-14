import React, { Component } from 'react';
import { Input, Search, Button, Icon } from '@alifd/next';
import { project } from '@alilc/lowcode-engine';
import './index.less';
import lang from './lang.json';
class I18nSetter extends Component {
  state = {
    isShowSearchPopUp: false,
    isShowBindDataPopUp: false,
    i18nValue: {},
  };

  componentDidMount() {
    // 获取schema
    const { value } = this.props;

    const schema = project.exportSchema();
    const i18nSchema = schema.i18n;
    const i18nPageDataList = this.transfromI18nData(i18nSchema);
    let i18nValue = {};
    if (value && value.key) {
      i18nValue = this.setI18nValue(value.key, i18nPageDataList);
    }
    // 对原始的i18n数据结构进行转化，方便页面输出
    this.setState({
      i18nPageDataList: i18nPageDataList,
      i18nValue,
      i18nSchema,
    });
  }

  transfromI18nData = (i18nSchema) => {
    let i18nPageDataList = [];
    for (let langKey in i18nSchema) {
      let i18nMap = i18nSchema[langKey];
      for (let key2 in i18nMap) {
        let matchFlag = false;
        i18nPageDataList.length > 0 &&
          i18nPageDataList.map((i18nItem) => {
            if (i18nItem.i18nkey == key2) {
              matchFlag = true;
              i18nItem.i18nDataList.push({
                langKey,
                i18nData: i18nMap[key2],
              });
            }
          });

        if (!matchFlag) {
          let i18nItem = {
            i18nkey: key2,
            i18nDataList: [],
          };
          i18nItem.i18nDataList.push({
            langKey,
            i18nData: i18nMap[key2],
          });

          //i18nItem.i18nData[langKey] = i18nMap[key2]
          i18nPageDataList.push(i18nItem);
        }
      }
    }
    return i18nPageDataList;
  };

  onSearch(value, filterValue) {
    // console.log('onSearch', value, filterValue);
  }

  showSearchPopUp = () => {
    this.setState({
      isShowSearchPopUp: true,
    });
  };

  showBindDataPopUp = () => {
    this.setState({
      isShowBindDataPopUp: !this.state.isShowBindDataPopUp,
    });
  };

  showBindData = () => {
    this.setState({
      isShowBindDataPopUp: true,
    });
  };

  clearI18n = () => {
    const { onChange } = this.props;
    this.setState({
      i18nValue: {},
      isShowBindDataPopUp: false,
    });

    onChange({});
  };

  setI18nValue = (i18nkey, i18nPageDataList) => {
    i18nPageDataList = i18nPageDataList || this.state.i18nPageDataList;
    let i18nDataList;
    i18nPageDataList.map((item) => {
      if (item.i18nkey == i18nkey) {
        i18nDataList = item.i18nDataList;
      }
    });
    let inputValue;
    // 中文用于input展示
    i18nDataList.map((item) => {
      if (item.langKey == 'zh-CN') {
        inputValue = item.i18nData;
      }
    });
    return {
      type: 'i18n',
      key: i18nkey,
      i18nDataList,
      inputValue,
    };
  };

  createNewI18nItemData = () => {
    const { onChange } = this.props;
    const { editor } = this.props.field;
    const schema = project.exportSchema();
    let i18nSchema = schema.i18n;
    let newI18nKey = this.uniqueId('i18n');
    // 将新的key添加到i18nSchema中
    for (let langKey in i18nSchema) {
      i18nSchema[langKey][newI18nKey] = '';
    }

    if (JSON.stringify(i18nSchema) == '{}') {
      // i18n结构为空的话，默认建中文和英文
      i18nSchema['zh-CN'] = {};
      i18nSchema['zh-CN'][newI18nKey] = '你好';
      i18nSchema['en-US'] = {};
      i18nSchema['en-US'][newI18nKey] = 'Hello';
    }

    const i18nPageDataList = this.transfromI18nData(i18nSchema);
    let i18nValue = this.setI18nValue(newI18nKey, i18nPageDataList);

    onChange(this.parseI18nValue2PropsValue(i18nValue));

    this.updateI18nSchema(i18nValue);

    this.setState({
      i18nValue,
      isShowBindDataPopUp: true,
      isShowSearchPopUp: false,
    });
  };

  uniqueId = (prefix = '') => {
    let guid = Date.now();
    return `${prefix}-${(guid++).toString(36).toLowerCase()}`;
  };

  onClickI18nItem = (i18nItem) => {
    const { onChange } = this.props;
    let i18nValue = this.setI18nValue(i18nItem.i18nkey);
    this.setState({
      i18nValue,
      isShowSearchPopUp: false,
      isShowBindDataPopUp: true,
    });
    onChange(this.parseI18nValue2PropsValue(i18nValue));
  };

  parseI18nValue2PropsValue = (i18nValue) => {
    let propsValue = {
      type: 'i18n',
      key: i18nValue.key,
    };

    const { i18nDataList } = i18nValue;
    i18nDataList.map((item) => {
      propsValue[item.langKey] = item.i18nData;
    });

    return propsValue;
  };

  renderI18nList = () => {
    const { i18nSearchDataList } = this.state;
    return (
      <div className="lowcode-setter-i18n-list">
        {i18nSearchDataList &&
          i18nSearchDataList.map((item) => {
            return (
              <div
                className="lowcode-setter-i18n-search-box-container"
                onClick={() => this.onClickI18nItem(item)}
              >
                {item.i18nDataList &&
                  item.i18nDataList.map((i18nItem) => {
                    return (
                      <div className="i18n-lang-item">
                        <div className="i18n-item-lang-type">
                          {lang[i18nItem.langKey].i18nLangCN}
                        </div>
                        <div className="item-lang-content">{i18nItem.i18nData}</div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    );
  };

  onChange(value, type, e) {
    //console.log('onChange', value, type, e);
    // 联想的数据

    const { i18nPageDataList } = this.state;
    let i18nSearchDataList = [];

    i18nPageDataList.map((item) => {
      let i18nDataList = item.i18nDataList;
      i18nDataList.map((itemData) => {
        if (value != '' && itemData.i18nData.indexOf(value) >= 0) {
          i18nSearchDataList.push(item);
        }
      });
    });

    this.setState({
      value,
      i18nSearchDataList,
    });
  }

  i18nItemOnChange = (value, langKey) => {
    const { i18nValue } = this.state;
    const { onChange } = this.props;
    i18nValue.i18nDataList.map((item) => {
      if (item.langKey == langKey) {
        item.i18nData = value;
        if (langKey == 'zh-CN') {
          i18nValue.inputValue = value;
        }
      }
    });

    this.setState({
      i18nValue,
    });

    onChange(this.parseI18nValue2PropsValue(i18nValue));

    this.updateI18nSchema(i18nValue);
  };

  updateI18nSchema = (i18nValue) => {
    const { editor } = this.props.field;
    const schema = project.exportSchema();
    let i18nSchema = schema.i18n;
    for (let schemaLangKey in i18nSchema) {
      let schemaLangData = i18nSchema[schemaLangKey];
      for (let schemaI18nKey in schemaLangData) {
        if (i18nValue.key == schemaI18nKey) {
          const { i18nDataList } = i18nValue;
          i18nDataList.map((i18nDataItem) => {
            if (i18nDataItem.langKey == schemaLangKey) {
              schemaLangData[schemaI18nKey] = i18nDataItem.i18nData;
            }
          });
        }
      }
    }

    editor.get('designer').project.set('i18n', i18nSchema);
  };

  render() {
    const { isShowSearchPopUp, i18nValue, isShowBindDataPopUp } = this.state;
    return (
      <div className="lowcode-setter-i18n">
        <Input size="small" value={i18nValue.inputValue} />

        {!i18nValue.key ? (
          <div className="i18n-icon" onClick={this.showSearchPopUp}>
            <img src="https://gw.alicdn.com/imgextra/i2/O1CN01kvqrSB22B9CKB4yVl_!!6000000007081-2-tps-200-200.png"></img>
          </div>
        ) : (
          <div className="i18n-icon i18n-icon-selected" onClick={this.showBindDataPopUp}>
            <img src="https://gw.alicdn.com/imgextra/i3/O1CN01VpNCcg1wfTjbdHK8I_!!6000000006335-2-tps-200-200.png"></img>
          </div>
        )}
        {isShowSearchPopUp && (
          <div className="popup-container">
            <Search
              onChange={this.onChange.bind(this)}
              popupContent={this.renderI18nList()}
              onSearch={this.onSearch.bind(this)}
              type="normal"
              shape="simple"
              style={{ width: '195px' }}
              placeholder="搜索已定义的文案"
            />
            <Button type="primary" className="new-i18n-button" onClick={this.createNewI18nItemData}>
              <Icon type="add" />
              创建新的多语言文案
            </Button>
          </div>
        )}
        {isShowBindDataPopUp && (
          <div className="binddata-popup-container">
            <div className="clear-i18n" onClick={this.clearI18n}>
              解除文案关联
            </div>
            {i18nValue.i18nDataList &&
              i18nValue.i18nDataList.map((i18nItem) => {
                return (
                  <div className="bind-item">
                    <p>{lang[i18nItem.langKey].i18nLangCN}</p>
                    <Input
                      size="small"
                      value={i18nItem.i18nData}
                      onChange={(value, type, e) =>
                        this.i18nItemOnChange(value, i18nItem.langKey, i18nValue.key)
                      }
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

export default I18nSetter;
