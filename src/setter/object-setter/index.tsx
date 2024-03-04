import * as React from 'react';
import { Component, Fragment } from 'react';
import { Button } from '@alifd/next';
import { common } from '@alilc/lowcode-engine';
import { IPublicTypeSetterType, IPublicModelSettingField, IPublicTypeFieldConfig, IPublicTypeCustomView, IPublicTypeTitleContent } from '@alilc/lowcode-types';
import CustomIcon from '../../components/custom-icon';
import './index.less';

const { editorCabin, skeletonCabin, designerCabin } = common;
const { Title } = editorCabin;
const { isSettingField } = designerCabin;
const { createSettingFieldView, PopupContext } = skeletonCabin;

export default class ObjectSetter extends Component<{
  field: IPublicModelSettingField;
  descriptor?: IPublicTypeTitleContent;
  config: ObjectSetterConfig;
  mode?: 'popup' | 'form';
  // 1: in tablerow  2: in listrow 3: in column-cell
  forceInline?: number;
}> {
  render() {
    const { mode, forceInline = 0, ...props } = this.props;
    if (forceInline || mode === 'popup') {
      if (forceInline > 2 || mode === 'popup') {
        // popup
        return <RowSetter {...props} primaryButton={!forceInline} />;
      } else {
        return <RowSetter columns={forceInline > 1 ? 2 : 4} {...props} />;
      }
    } else {
      // form
      return <FormSetter {...props} />;
    }
  }
}

interface ObjectSetterConfig {
  items?: IPublicTypeFieldConfig[];
  extraSetter?: IPublicTypeSetterType;
  canCloseByOutSideClick: boolean;
}

interface RowSetterProps {
  value: any;
  field: IPublicModelSettingField;
  descriptor?: IPublicTypeTitleContent;
  config: ObjectSetterConfig;
  columns?: number;
  primaryButton?: boolean;
}

interface RowSetterState {
  items: IPublicModelSettingField[];
  descriptor?: IPublicTypeTitleContent;
}

function getItemsFromProps(props: RowSetterProps, state?: RowSetterState) {
  const { config, field, columns } = props;
  const { extraProps } = field;
  const items: IPublicModelSettingField[] = [];
  if (columns && config?.items) {
    const l = Math.min(config.items.length, columns);
    for (let i = 0; i < config.items.length; i++) {
      const conf = config.items[i];
      if (conf.isRequired || conf.important || (conf.setter as any)?.isRequired) {
        const item = state?.items?.filter(d => d.name === conf.name)?.[0] || field.createField({
          ...conf,
          // in column-cell
          forceInline: 3,
        });
        const originalSetValue = item.extraProps.setValue;
        item.extraProps.setValue = (...args) => {
          // 调用子字段本身的 setValue
          originalSetValue?.apply(null, args);
          // 调用父字段本身的 setValue
          extraProps.setValue?.apply(null, args);
        };
        items.push(item);
      }
      if (items.length >= l) {
        break;
      }
    }
  }
  return items;
}

class RowSetter extends Component<RowSetterProps, RowSetterState> {
  static contextType = PopupContext;

  state: RowSetterState = {
    descriptor: '',
    items: [],
  };

  static getDerivedStateFromProps(props: RowSetterProps, state: RowSetterState) {
    return {
      items: getItemsFromProps(props, state),
    };
  }

  constructor(props: RowSetterProps) {
    super(props);
    const { descriptor, field } = props;
    const items: IPublicModelSettingField[] = getItemsFromProps(props);
    this.state = { items };

    let firstRun = true;
    field.onEffect(() => {
      const state: any = {};
      if (descriptor) {
        if (typeof descriptor === 'function') {
          state.descriptor = descriptor(field);
        } else {
          state.descriptor = field.getPropValue(descriptor);
        }
      } else {
        state.descriptor = field.title;
      }

      if (firstRun) {
        firstRun = false;
        this.state = state;
      } else {
        this.setState(state);
      }
    });
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if (this.state.descriptor !== nextState.descriptor) {
      return true;
    }
    if (this.props.value !== nextProps.value) {
      return true;
    }
    return false;
  }

  private pipe: any;

  render() {
    const { items } = this.state;
    const { field, config } = this.props;

    if (!this.pipe) {
      this.pipe = (this.context as PopupPipe).create({
        width: 320,
        canCloseByOutSideClick: config.canCloseByOutSideClick
      });
    }

    const title = (
      <Fragment>
        <Title title={this.state.descriptor} />
      </Fragment>
    );

    this.pipe.send(<FormSetter key={field.id} field={field} config={config} />, title);

    if (items && items.length) {
      return (
        <div className="lc-setter-object-row">
          <Button
            className="lc-setter-object-row-edit"
            size="small"
            ghost="light"
            onClick={(e) => {
              this.pipe.show((e as any).target, field.id);
            }}
          >
            <CustomIcon type="icon-ic_edit" />
          </Button>
          <div className="lc-setter-object-row-body">
            {items.map((item) => createSettingFieldView(item, field))}
          </div>
        </div>
      );
    }

    return (
      <div className="lc-setter-object-row">
        <Button
          className="lc-setter-object-row-edit"
          size="small"
          ghost="light"
          onClick={(e) => {
            this.pipe.show((e as any).target, field.id);
          }}
        >
          <CustomIcon type="icon-ic_edit" />
        </Button>
        <div className="lc-setter-object-row-body">{this.state.descriptor}：未配置快捷编辑项</div>
      </div>
    );
  }
}

interface FormSetterProps {
  field: IPublicModelSettingField;
  config: ObjectSetterConfig;
}
class FormSetter extends Component<FormSetterProps> {
  private items: (IPublicModelSettingField | IPublicTypeCustomView)[];

  constructor(props: RowSetterProps) {
    super(props);
    const { config, field } = props;
    const { extraProps } = field;

    if (Array.isArray(field.items) && field.items.length > 0) {
      field.items.forEach((item: IPublicModelSettingField | IPublicTypeCustomView) => {
        if (isSettingField(item)) {
          const originalSetValue = item.extraProps.setValue;
          item.extraProps.setValue = (...args) => {
            // 调用子字段本身的 setValue
            originalSetValue?.apply(null, args);
            // 调用父字段本身的 setValue
            extraProps.setValue?.apply(null, args);
          };
        }
      });
      this.items = field.items;
    } else {
      this.items = (config?.items || []).map((conf) =>
        field.createField({
          ...conf,
          setValue: extraProps?.setValue,
        }),
      );
    }
    // TODO: extraConfig for custom fields
  }

  render() {
    const { field } = this.props;
    return (
      <div className="lc-setter-object lc-block-setter">
        {this.items.map((item, index) => createSettingFieldView(item, field, index))}
      </div>
    );
  }
}
