import { common } from '@alilc/lowcode-engine';
import enUS from './en-US.json';
import zhCN from './zh-CN.json';

const intlLocal = () => {
  const { getLocale } = common.utils.createIntl?.() || {};
  const locale: string = getLocale?.() || 'zh-CN';
  const localeSource: any = {
    'en-US': enUS,
    'zh-CN': zhCN,
  };
  return localeSource[locale];
}


export { intlLocal };
