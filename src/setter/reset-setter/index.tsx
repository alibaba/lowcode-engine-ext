import React, { PureComponent } from 'react';
import './index.less';
import { intlNode } from '../mixed-setter/locale';

export default class SetterReset extends PureComponent {
  static displayName = 'ResetSetter';
  static isPopup = true;

  render() {
    const tipContext = intlNode('Reset Attribute');
    
    // return <a onClick={ this.resetIconClickHandler }> {tipContext} </a>;
    return <a > {tipContext} </a>;
  }
}