import { SettingTarget } from '@alilc/lowcode-types';

export interface BehaviorActionProps<Value = Record<string, any>, Options = any> {
  value: Value;
  onChange: (val: Value) => void;
  options?: Options;
  field: SettingTarget;
}
/** 自定义行为描述 */
export interface BehaviorAction<Value = Record<string, any>, Options = Record<string, any>> {
  /** 行为key */
  name: string;
  /** 行为名字，显示在RadioGroup选项 */
  title: string;
  /** 选项渲染 */
  render?: (props: BehaviorActionProps<Value, Options>) => React.ReactNode;
  /** 值序列化为低代码协议的值 */
  toActionValue: (value: Value, options?: Options) => any;
}
