import * as React from 'react';
import { Component, Fragment } from 'react';
import { common } from '@alilc/lowcode-engine';
import { Button, Message } from '@alifd/next';
import { IPublicModelSettingField, IPublicTypeSetterType, IPublicTypeFieldConfig, IPublicTypeSetterConfig } from '@alilc/lowcode-types';
import CustomIcon from '../../components/custom-icon';
import Sortable from './sortable';
import './style.less';
const { editorCabin, skeletonCabin } = common;
const { Title } = editorCabin;
const { createSettingFieldView, PopupContext } = skeletonCabin;

interface ArraySetterState {
  items: IPublicModelSettingField[];
}

/**
 * onItemChange 用于 ArraySetter 的单个 index 下的数据发生变化，
 * 因此 target.path 的数据格式必定为 [propName1, propName2, arrayIndex, key?]。
 *
 * @param target
 * @param value
 */
function onItemChange (target: IPublicModelSettingField, index: number, item: IPublicModelSettingField, props: ArraySetterProps) {
  const targetPath: Array<string | number> = target?.path;
  if (!targetPath || targetPath.length < 2) {
    console.warn(
      `[ArraySetter] onItemChange 接收的 target.path <${
        targetPath || 'undefined'
      }> 格式非法需为 [propName, arrayIndex, key?]`,
    );
    return;
  }
  const { field } = props;
  const { path } = field;
  if (path[0] !== targetPath[0]) {
    console.warn(
      `[ArraySetter] field.path[0] !== target.path[0] <${path[0]} !== ${targetPath[0]}>`,
    );
    return;
  }
  try {
    const fieldValue = field.getValue();
    fieldValue[index] = item.getValue();
    field?.setValue(fieldValue);
  } catch (e) {
    console.warn('[ArraySetter] extraProps.setValue failed :', e);
  }
};

interface ArraySetterProps {
  value: any[];
  field: IPublicModelSettingField;
  itemSetter?: IPublicTypeSetterType;
  itemMaxLength?: number;
  variableBind?: boolean;
  columns?: IPublicTypeFieldConfig[];
  multiValue?: boolean;
  hideDescription?: boolean;
  onChange?: Function;
  extraProps: {renderFooter?: (options: ArraySetterProps & {onAdd: (val?: {}) => any}) => any}
}

export class ListSetter extends Component<ArraySetterProps, ArraySetterState> {
  state: ArraySetterState = {
    items: [],
  };

  private scrollToLast = false;

  constructor(props: ArraySetterProps) {
    super(props);
  }

  static getDerivedStateFromProps(props: ArraySetterProps, state: ArraySetterState) {
    const items: IPublicModelSettingField[] = [];
    const { value, field } = props;
    const valueLength = value && Array.isArray(value) ? value.length : 0;

    for (let i = 0; i < valueLength; i++) {
      let item = state.items[i];
      if (!item) {
        item = field.createField({
          name: i.toString(),
          setter: props.itemSetter,
          forceInline: 1,
          type: 'field',
          extraProps: {
            defaultValue: value[i],
            setValue: (target: IPublicModelSettingField) => {
              onItemChange(target, i, item, props);
            },
          },
        });
        item.setValue(value[i]);
      }
      items.push(item);
    }

    return {
      items,
    };
  }

  onSort(sortedIds: Array<string | number>) {
    const { onChange, value: oldValues } = this.props;
    const { items } = this.state;
    const values: any[] = [];
    const newItems: IPublicModelSettingField[] = [];
    sortedIds.map((id, index) => {
      const itemIndex = items.findIndex(item => item.id === id);
      values[index] = oldValues[itemIndex];
      newItems[index] = items[itemIndex];
      return id;
    });
    onChange?.(values);
  }

  onAdd(newValue?: {[key: string]: any}) {
    const { itemSetter, field, onChange, value = [] } = this.props;
    const values = value || [];
    const initialValue = (itemSetter as any)?.initialValue;
    const defaultValue = newValue ? newValue : (typeof initialValue === 'function' ? initialValue(field) : initialValue);
    values.push(defaultValue);
    this.scrollToLast = true;
    onChange?.(values);
  }

  onRemove(removed: IPublicModelSettingField) {
    const { onChange, value } = this.props;
    const { items } = this.state;
    const values = value || [];
    let i = items.indexOf(removed);
    items.splice(i, 1);
    values.splice(i, 1);
    const l = items.length;
    while (i < l) {
      items[i].setKey(i);
      i++;
    }
    removed.remove();
    const pureValues = values.map((item: any) => typeof(item) === 'object' ? Object.assign({}, item):item);
    onChange?.(pureValues);
  }

  componentWillUnmount() {
    this.state.items.forEach((field) => {
      field.purge();
    });
  }

  render() {
    const { hideDescription, extraProps = {}, itemMaxLength, columns } = this.props;
    const { renderFooter } = extraProps;
    const { items } = this.state;
    const { scrollToLast } = this;
    this.scrollToLast = false;

    const lastIndex = items.length - 1;

    const content =
      items.length > 0 ? (
        <div className="lc-setter-list-scroll-body">
          <Sortable itemClassName="lc-setter-list-card" onSort={this.onSort.bind(this)}>
            {items.map((field, index) => (
              <ArrayItem
                key={field.id}
                scrollIntoView={scrollToLast && index === lastIndex}
                field={field}
                onRemove={this.onRemove.bind(this, field)}
              />
            ))}
          </Sortable>
        </div>
      ) : (
        <div className="lc-setter-list-notice">
          {this.props.multiValue ? (
            <Message type="warning">当前选择了多个节点，且值不一致，修改会覆盖所有值</Message>
          ) : (
            <Message type="notice" size="medium" shape="inline">
              暂时还没有添加内容
            </Message>
          )}
        </div>
      );

    return (
      <div className="lc-setter-list lc-block-setter">
        {!hideDescription && columns && items.length > 0 ? (
          <div className="lc-setter-list-columns">{
            columns.map((column) => (
              <Title key={column.name} title={column.title || (column.name as string)} />
            ))
          }</div>
        ) : null}
        {content}
        <div className="lc-setter-list-add">
          {
            !renderFooter 
              ? (itemMaxLength && items.length >= Number(itemMaxLength)
                ? null
                :(
                  <Button text type="primary" onClick={() => {
                    this.onAdd()
                  }}>
                    <span>添加一项 +</span>
                  </Button>
              )) 
              : renderFooter({...this.props, onAdd: this.onAdd.bind(this),})
          }
        </div>
      </div>
    );
  }
}
class ArrayItem extends Component<{
  field: IPublicModelSettingField;
  onRemove: () => void;
  scrollIntoView: boolean;
}> {
  private shell?: HTMLDivElement | null;

  componentDidMount() {
    if (this.props.scrollIntoView && this.shell) {
      this.shell.parentElement!.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  render() {
    const { onRemove, field } = this.props;
    return (
      <div
        className="lc-listitem"
        ref={(ref) => {
          this.shell = ref;
        }}
      >
        <div className="lc-listitem-body">{createSettingFieldView(field, field.parent)}</div>
        <div className="lc-listitem-actions">
          <Button size="small" ghost="light" onClick={onRemove} className="lc-listitem-action">
            <CustomIcon type="icon-ic_delete" />
          </Button>
          <Button draggable size="small" ghost="light" className="lc-listitem-handler">
            <CustomIcon type="icon-ic_drag" />
          </Button>
        </div>
      </div>
    );
  }
}

class TableSetter extends ListSetter {}

export default class ArraySetter extends Component<{
  value: any[];
  field: IPublicModelSettingField;
  itemSetter?: IPublicTypeSetterType;
  itemMaxLength?: number;
  variableBind?: boolean;
  mode?: 'popup' | 'list';
  forceInline?: boolean;
  multiValue?: boolean;
}> {
  static contextType = PopupContext;

  private pipe: any;

  render() {
    const { mode, forceInline, ...props } = this.props;
    const { field, itemSetter } = props;
    let columns: IPublicTypeFieldConfig[] | undefined;
    if ((itemSetter as IPublicTypeSetterConfig)?.componentName === 'ObjectSetter') {
      const items: IPublicTypeFieldConfig[] = (itemSetter as any).props?.config?.items;
      if (items && Array.isArray(items)) {
        columns = items.filter(
          (item) => item.isRequired || item.important || (item.setter as any)?.isRequired,
        )?.slice(0, 4);
      }
    }

    if (mode === 'popup' || forceInline) {
      const title = (
        <Fragment>
          编辑：
          <Title title={field.title} />
        </Fragment>
      );
      if (!this.pipe) {
        let width = 360;
        if (columns) {
          if (columns.length === 3) {
            width = 480;
          } else if (columns.length > 3) {
            width = 600;
          }
        }
        this.pipe = this.context.create({ width });
      }

      this.pipe.send(<TableSetter key={field.id} {...props} columns={columns} />, title);
      return (
        <Button
          type={forceInline ? 'normal' : 'primary'}
          onClick={(e) => {
            this.pipe.show((e as any).target, field.id);
          }}
        >
          <CustomIcon type="icon-bianji" size="small" />
          {forceInline ? title : '编辑数组'}
        </Button>
      );
    } else {
      return <ListSetter {...props} columns={columns} />;
    }
  }
}
