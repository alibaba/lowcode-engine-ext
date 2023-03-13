import { Icon } from '@alifd/next';
import * as React from 'react';
import { useEffect } from 'react';

const ICON_URL = '//at.alicdn.com/t/a/font_2761185_ccl8ob63gmj.js';

let CustomIcon: any;

document.addEventListener('DOMContentLoaded', function () {
  // console.log('3 seconds passed');
  CustomIcon = Icon.createFromIconfontCN({
    scriptUrl: ICON_URL,
  });
});

interface IconProps {
  type: string;
  size?: number | 'small' | 'xxs' | 'xs' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl' | 'inherit';
  className?: string;
  style?: any;
}



export default (props: IconProps) => {
  const { type, size, className = '', style = {} } = props;
  useEffect(() => {
    if(!CustomIcon){
      CustomIcon = Icon.createFromIconfontCN({
        scriptUrl: ICON_URL,
      });
    }
   
  }, []);
  return (
    <>{CustomIcon && <CustomIcon type={type} size={size} className={className} style={style} />}</>
  );
};
