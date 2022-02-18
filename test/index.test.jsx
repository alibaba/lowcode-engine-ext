import React from 'react';
import { shallow } from 'enzyme';
import LowcodeEngineExt from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<LowcodeEngineExt />);
  expect(wrapper.find('.lowcode-engine-ext').length).toBe(1);
});
