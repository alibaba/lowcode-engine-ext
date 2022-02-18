import React, { PureComponent } from 'react';
import { event } from '@alilc/lowcode-engine';
import './index.less';

export default class SetterVariable extends PureComponent {
  static displayName = 'SetterVariable';
  static isPopup = true;

  static show({ prop: field }) {
    event.emit('variableBindDialog.openDialog', { field });
  }

  render() {
    return <div className="lowcode-setter-variable">Hello LowcodeSetterVariable</div>;
  }
}
