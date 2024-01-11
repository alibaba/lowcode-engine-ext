import React, { PureComponent } from 'react';
import { intlNode } from '../mixed-setter/locale';

export default class SetterReset extends PureComponent {
  static displayName = 'ResetSetter';
  static isPopup = true;

  render() {
    const tipContext = intlNode('Reset Attribute');
    return <a > {tipContext} </a>;
  }
}