import React, { Component, ComponentClass, ReactNode } from 'react';
import classNames from 'classnames';
import { Dropdown, Menu } from '@alifd/next';
import { common, setters, SettingField, event } from '@alilc/lowcode-engine';
import {
  SetterConfig,
  CustomView,
  DynamicProps,
  DynamicSetter,
  TitleContent,
  isSetterConfig,
  isDynamicSetter,
} from '@alilc/lowcode-types';
import { IconConvert } from './icons/convert';
import { intlNode } from './locale';

import './index.less';
import { IconVariable } from './icons/variable';
import { ResetIcon } from './icons/reset';

const { editorCabin } = common;
const { computed, obx, Title, createSetterContent, observer, shallowIntl } = editorCabin;
const { getSetter, getSettersMap } = setters;
export interface SetterItem {
  name: string;
  title: TitleContent;
  setter: string | DynamicSetter | CustomView;
  props?: object | DynamicProps;
  condition?: (field: SettingField) => boolean;
  initialValue?: any | ((field: SettingField) => any);
  list: boolean;
  valueType: string[];
}

const dash = '_';
function getMixedSelect(field) {
  const path = field.path || [];
  if(path.length) {
    const key = `_unsafe_MixedSetter${dash}${path[path.length-1]}${dash}select`
    const newPath = [...path];
    newPath.splice(path.length - 1, 1, key);
    const newKey = field.node.getPropValue(newPath.join('.'))
    if(newKey) return newKey;
    // 兼容下以前的问题情况，如果捕获到，获取 oldUnsafeKey 取值并将其直接置空
    const oldUnsafeKey = `_unsafe_MixedSetter${dash}${path.join(dash)}${dash}select`;
    const oldUsedSetter = field.node.getPropValue(oldUnsafeKey);
    if(oldUsedSetter) {
      field.node.setPropValue(newPath.join('.'), oldUsedSetter);
      field.node.setPropValue(oldUnsafeKey, undefined);
    }
    return oldUsedSetter;
  }
  return undefined;
}
function setMixedSelect(field, usedSetter) {
  const path = field.path || [];
  if(path.length) {
    const key = `_unsafe_MixedSetter${dash}${path[path.length-1]}${dash}select`
    path.splice(path.length - 1, 1, key);
    field.node.setPropValue(path.join('.'), usedSetter)
  }
}

function nomalizeSetters(
  setters?: Array<string | SetterConfig | CustomView | DynamicSetter>,
): SetterItem[] {
  if (!setters) {
    const normalized: SetterItem[] = [];
    getSettersMap().forEach((setter, name) => {
      if (name === 'MixedSetter') {
        return;
      }
      normalized.push({
        name,
        title: setter.title || name,
        setter: name,
        condition: setter.condition,
        initialValue: setter.initialValue,
        list: setter.recommend || false,
        valueType: setter.valueType,
      });
    });

    return normalized;
  }
  const names: string[] = [];
  function generateName(n: string) {
    let idx = 1;
    let got = n;
    while (names.indexOf(got) > -1) {
      got = `${n}:${idx++}`;
    }
    names.push(got);
    return got;
  }
  const formattedSetters = setters.map((setter) => {
    const config: any = {
      setter,
      list: true,
    };
    if (isSetterConfig(setter)) {
      config.setter = setter.componentName;
      config.props = setter.props;
      config.condition = setter.condition;
      config.initialValue = setter.initialValue;
      config.title = setter.title;
      config.valueType = setter.valueType;
    }
    if (typeof config.setter === 'string') {
      config.name = config.setter;
      names.push(config.name);
      const info = getSetter(config.setter);
      if (!config.title) {
        config.title = info?.title || config.setter;
      }
      if (!config.valueType) {
        config.valueType = info?.valueType;
      }
      if (!config.condition) {
        config.condition = info?.condition;
      }
      if (!config.initialValue) {
        config.initialValue = info?.initialValue;
      }
    } else {
      config.name = generateName(
        (config.setter as any)?.displayName || (config.setter as any)?.name || 'CustomSetter',
      );
      if (!config.title) {
        config.title = config.name;
      }
    }
    return config;
  });
  const hasComplexSetter = formattedSetters.filter((item) =>
    ['ArraySetter', 'ObjectSetter'].includes(item.setter),
  ).length;
  return formattedSetters.map((item) => {
    if (item.setter === 'VariableSetter' && hasComplexSetter) {
      item.setter = 'ExpressionSetter';
      item.name = 'ExpressionSetter';
    }
    return item;
  });
}

interface VariableSetter extends ComponentClass {
  show(params: object): void;
}

@observer
export default class MixedSetter extends Component<{
  field: SettingField;
  setters?: Array<string | SetterConfig | CustomView | DynamicSetter>;
  onSetterChange?: (field: SettingField, name: string) => void;
  onChange?: (val: any) => void;
  value?: any;
  className?: string;
}> {
  private fromMixedSetterSelect = false;

  private setters = nomalizeSetters(this.props.setters);

  // set name ,used in setting Transducer
  static displayName = 'MixedSetter';

  @obx.ref private used?: string;

  @computed private getCurrentSetter() {
    const { field } = this.props;
    let firstMatched: SetterItem | undefined;
    let firstDefault: SetterItem | undefined;
    for (const setter of this.setters) {
      if (setter.name === this.used) {
        return setter;
      }
      if (!setter.condition) {
        if (!firstDefault) {
          firstDefault = setter;
        }
        continue;
      }
      if (!firstMatched && setter.condition(field)) {
        firstMatched = setter;
      }
    }
    this.used = (firstMatched || firstDefault || this.setters[0]).name;
    return firstMatched || firstDefault || this.setters[0];
  }

  constructor(props) {
    super(props);
    // TODO: use engine ext.props
    const usedSetter = getMixedSelect(this.props.field);
    if (usedSetter) {
      this.used = usedSetter;
    }
  }

  // dirty fix vision variable setter logic
  private hasVariableSetter = this.setters.some((item) => item.name === 'VariableSetter');

  private hasResetSetter = this.setters.some((item) => item.name === 'ResetSetter');

  private useSetter = (name: string, usedName: string) => {
    this.fromMixedSetterSelect = true;
    const { field } = this.props;
    if (name !== this.used) {
      // reset value
      field.setValue(undefined);
    }
    if (name === 'VariableSetter') {
      const setterComponent = getSetter('VariableSetter')?.component as any;
      if (name !== this.used) {
        field.setValue({
          type: 'JSExpression'
        });
      }
      if (setterComponent && setterComponent.isPopup) {
        setterComponent.show({ prop: field });
        this.syncSelectSetter(name);
        return;
      }
    }
    if (name === this.used) {
      return;
    }

    let fieldValue;
    const usedSetter = this.setters.find((item) => item.name === usedName);
    // 获取该setter的返回值类型
    const usedValueType = usedSetter.valueType || ['string'];

    const setter = this.setters.find((item) => item.name === name);

    const valueType = setter.valueType || ['string'];

    usedValueType.map((usedItem) => {
      valueType.map((item) => {
        if (item === usedItem) {
          fieldValue = field.getValue();
        }
        return item;
      });
      return usedItem;
    });

    this.syncSelectSetter(name);

    if (setter) {
      this.handleInitial(setter, fieldValue);
    }
  };

  private syncSelectSetter(name) {
    // TODO: sync into engine ext.props
    const { field } = this.props;
    this.used = name;
    setMixedSelect(field, name);
  }

  private handleInitial({ initialValue }: SetterItem, fieldValue: string) {
    const { field, onChange } = this.props;
    let newValue: any = initialValue;
    if (newValue && typeof newValue === 'function') {
      newValue = newValue(field);
    } else if (fieldValue) {
      newValue = fieldValue;
    }
    onChange && onChange(newValue);
  }

  private shell: HTMLDivElement | null = null;

  private checkIsBlockField() {
    if (this.shell) {
      const setter = this.shell.firstElementChild;
      if (setter && setter.classList.contains('lc-block-setter')) {
        this.shell.classList.add('lc-block-setter');
      } else {
        this.shell.classList.remove('lc-block-setter');
      }
    }
  }

  componentDidUpdate() {
    this.checkIsBlockField();
  }

  componentDidMount() {
    this.checkIsBlockField();
    event.on('common:variableSetter.selectVariableSetter',() => {
      this.used='VariableSetter'
    })
  }

  private renderCurrentSetter(currentSetter?: SetterItem, extraProps?: object) {
    const { className, field, setters, onSetterChange, ...restProps } = this.props;
    if (!currentSetter) {
      // TODO: use intl
      if (restProps.value == null) {
        return <span>NullValue</span>;
      } else {
        return <span>InvalidValue</span>;
      }
    }
    const { setter, props } = currentSetter;
    let setterProps: any = {};
    let setterType: any;
    let dynamicProps: any = {};
    if (isDynamicSetter(setter)) {
      setterType = setter.call(field, field);
      // { componentName: string; props: object }

      if (typeof setterType === 'object' && typeof setterType.componentName === 'string') {
        dynamicProps = setterType.props || {};
        setterType = setterType.componentName;
      }
    } else {
      setterType = setter;
    }
    if (props) {
      setterProps = props;
      if (typeof setterProps === 'function') {
        setterProps = setterProps(field);
      }
    }

    return createSetterContent(setterType, {
      fromMixedSetterSelect: this.fromMixedSetterSelect,
      ...shallowIntl(setterProps),
      field,
      ...restProps,
      ...extraProps,
      ...dynamicProps,
      onInitial: () => {
        this.handleInitial(currentSetter);
      },
    });
  }

  private contentsFromPolyfill(setterComponent: VariableSetter) {
    const { field } = this.props;

    const n = this.setters.length;

    let setterContent: any;
    let actions: any;
    if (n < 3) {
      const tipContent = field.isUseVariable()
        ? intlNode('Binded: {expr}', { expr: field.getValue()?.value })
        : intlNode('Variable Binding');
      if (n === 1) {
        // =1: 原地展示<当前绑定的值，点击调用 VariableSetter.show>，icon 高亮是否->isUseVaiable，点击 VariableSetter.show
        setterContent = (
          <a
            onClick={() => {
              setterComponent.show({ prop: field });
            }}
          >
            {tipContent}
          </a>
        );
      } else {
        // =2: 另外一个 Setter 原地展示，icon 高亮，点击弹出调用 VariableSetter.show
        // FIXME! use variable placeholder setter

        const otherSetter = this.setters.find((item) => item.name !== 'VariableSetter')!;
        setterContent = this.renderCurrentSetter(otherSetter, {
          value: field.getMockOrValue(),
        });
      }
      actions = (
        <Title
          className={field.isUseVariable() ? 'variable-binded' : ''}
          title={{
            icon: <IconVariable size={24} />,
            tip: tipContent,
          }}
          onClick={() => {
            setterComponent.show({ prop: field });
          }}
        />
      );
    } else {
      // >=3: 原地展示当前 setter<当前绑定的值，点击调用 VariableSetter.show>，icon tip 提示绑定的值，点击展示切换 Setter，点击其它 setter 直接切换，点击 Variable Setter-> VariableSetter.show
      const currentSetter =
        !this.used && field.isUseVariable()
          ? this.setters.find((item) => item.name === 'VariableSetter')
          : this.getCurrentSetter();
      if (currentSetter?.name === 'VariableSetter') {
        setterContent = (
          <a
            onClick={() => {
              setterComponent.show({ prop: field });
            }}
          >
            {intlNode('Binded: {expr}', { expr: field.getValue()?.value ?? '-' })}
          </a>
        );
      } else {
        setterContent = this.renderCurrentSetter(currentSetter);
      }
      actions = this.renderSwitchAction(currentSetter);
    }

    return {
      setterContent,
      actions,
    };
  }

  private contentsFromPolyfill2() {
    const { field } = this.props;

    const setterNum = this.setters.length;
    if (setterNum < 4) {
      return this.handleSettersLessThanFour(field, setterNum);
    } else {
      return this.handleSettersGreaterThanThree(field);
    }

  }
  handleSettersLessThanFour(field: SettingField, setterNum: number) {
    if (setterNum === 1) {
      // return { actions: this.handleResetSetterAction() }
    }
    if (setterNum === 2) {
      return this.handleTwoSetters(field);
    }
    if (setterNum === 3) {
      return this.handleThreeSetters(field)
    }
  }

  handleTwoSetters(field: SettingField) {
    const otherSetter = this.setters.find((item) => item.name !== 'ResetSetter')!;
    if (otherSetter.name === 'VariableSetter') {
      return {
        setterContent: this.renderVariableSetterContent(field),
        actions: this.handleResetSetterAction(),
      }
    }
    return {
      setterContent: this.renderCurrentSetter(otherSetter, {
        value: field.getMockOrValue(),
      }),
      actions: this.handleResetSetterAction(),
    }
  }

  renderVariableSetterContent(field: SettingField) {
    const tipContent = field.isUseVariable()
    ? intlNode('Binded: {expr}', { expr: field.getValue()?.value })
    : intlNode('Variable Binding');
    const variableSetterComponent = getSetter('VariableSetter')?.component as any;
    return  (
      <a
        onClick={() => {
          variableSetterComponent.show({ prop: field });
        }}
      >
        {tipContent}
      </a>
    )

  }
  // 最后一个放resetsetter，如果有variableSetter，则放在第二个位置，其他的放在第一个位置。如果没有variableSetter则使用swtich切换操作
  handleThreeSetters(field: SettingField) {
    if (this.setters.some(setter => setter.name === 'VariableSetter') && this.setters.some(setter => setter.name === 'ResetSetter')) {
      // 其他放第一个，VariableSetter放第二个，reset放到最后
      const otherSetter = this.setters.find((item) => (item.name !== 'VariableSetter') && (item.name !== 'ResetSetter'))
      const otherSetterContent = this.renderCurrentSetter(otherSetter, {
        value: field.getMockOrValue(),
      });
      // VariableSetter
      const variableSetterComponent = getSetter('VariableSetter')?.component as any;
      const tipContent = field.isUseVariable()
      ? intlNode('Binded: {expr}', { expr: field.getValue()?.value })
      : intlNode('Variable Binding');
      const variableSetterContent = (
          <Title
          className={field.isUseVariable() ? 'variable-binded' : ''}
          title={{
            icon: <IconVariable size={24} />,
            tip: tipContent,
          }}
          onClick={() => {
            variableSetterComponent.show({ prop: field });
          }}
        />
      );
      return {
        setterContent: otherSetterContent,
        actions: (<>{variableSetterContent}{this.handleResetSetterAction()}</>),
      }
    } else {
      // switch+reset
      const currentSetter =
        !this.used && field.isUseVariable()
          ? this.setters.find((item) => item.name === 'VariableSetter')
          : this.getCurrentSetter();
      return {
        setterContent: this.renderCurrentSetter(currentSetter),
        actions: (<>{this.renderSwitchAction(currentSetter)}{this.handleResetSetterAction()}</>)
      }
    }
  }

  handleSettersGreaterThanThree(field: SettingField) {
    let setterContent: ReactNode;
    const currentSetter =
    !this.used && field.isUseVariable()
      ? this.setters.find((item) => item.name === 'VariableSetter')
      : this.getCurrentSetter();
      if (currentSetter?.name === 'VariableSetter') {
        const variableSetterComponent = getSetter('VariableSetter')?.component as any;
        setterContent = (
          <a
            onClick={() => {
              variableSetterComponent.show({ prop: field });
            }}
          >
            {intlNode('Binded: {expr}', { expr: field.getValue()?.value })}
          </a>
        );
      } else {
        setterContent = this.renderCurrentSetter(currentSetter);
      }
      return {
        setterContent,
        actions: (<>{this.renderSwitchAction(currentSetter)}{this.handleResetSetterAction()}</>)
      }
  }

  private getClassName() {
    const n = this.setters.length;
    if (this.hasResetSetter && n > 2) {
      // 通过class来修改样式
      return 'lc-setter-mixeds';
    }
  }

  private renderSwitchAction(currentSetter?: SetterItem) {
    const usedName = currentSetter?.name || this.used;
    const triggerNode = (
      <Title
        title={{
          tip: intlNode('Switch Setter'),
          // FIXME: got a beautiful icon
          icon: <IconConvert size={24} />,
        }}
        className="lc-switch-trigger"
      />
    );
    return (
      <Dropdown trigger={triggerNode} triggerType="click" align="tr br">
        <Menu
          selectMode="single"
          hasSelectedIcon
          selectedKeys={usedName}
          onItemClick={(name) => this.useSetter(name, usedName)}
        >
          {this.setters
            .filter((setter) => (setter.list || setter.name === usedName) && setter.name!== 'ResetSetter')
            .map((setter) => {
              return (
                <Menu.Item key={setter.name}>
                  <Title title={setter.title} />
                </Menu.Item>
              );
            })}
        </Menu>
      </Dropdown>
    );
  }

  private handleResetSetterAction() {
    return (<Title
      title={{
        icon: <ResetIcon size={24} />,
        tip: intlNode('Reset Attribute'),
      }}
      onClick={() => this.resetClickHandler()}
    />)
  }

  resetClickHandler() {
    const { onChange, initialValue, field } = this.props;
    let newValue = initialValue;
    if (field.isUseVariable() || this.used === 'VariableSetter') {
      const fieldValue = field.getValue();
      const value =
        Object.prototype.toString.call(fieldValue) === '[object Object]'
          ? fieldValue.mock
          : fieldValue;
      // 清除变量绑定
      field.setValue(value);
      // 清除标记
      this.used = undefined;
      newValue = newValue??value;
    }
    // fixme 属性为children默认使用StringSetter并且不配置defaultValue时，onChange(null)画布不会更新，so做此处理。例如antd物料的button组件
    if (this.used === 'StringSetter') {
      newValue = newValue?? '';
    }
    this.used = undefined;
    onChange(newValue)
  }

  render() {
    const { className } = this.props;
    let contents:
      | {
          setterContent: ReactNode;
          actions: ReactNode;
        }
      | undefined;

    if (this.hasResetSetter) {
      contents = this.contentsFromPolyfill2();
    } else if (this.hasVariableSetter) {
      // polyfill vision variable setter logic
      const setterComponent = getSetter('VariableSetter')?.component as any;
      if (setterComponent && setterComponent.isPopup) {
        contents = this.contentsFromPolyfill(setterComponent);
      }
    }
    if (!contents) {
      const currentSetter = this.getCurrentSetter();
      contents = {
        setterContent: this.renderCurrentSetter(currentSetter),
        actions: this.renderSwitchAction(currentSetter),
      };
    }

    return (
      <div
        ref={(shell) => {
          this.shell = shell;
        }}
        className={classNames('lc-setter-mixed', className, this.getClassName())}
      >
        {contents.setterContent}
        <div className="lc-setter-actions">{contents.actions}</div>
      </div>
    );
  }
}
