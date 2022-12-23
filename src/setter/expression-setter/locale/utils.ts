import IntlMessageFormat from 'intl-messageformat';

export const isJSExpression = (obj = '') => {
  if (obj && typeof obj === 'object' && obj.type === 'JSExpression') {
    return true;
  }
  return false;
};

/**
 * Used to construct internationalized string processing functions
 * @param {*} locale internationalization mark, such as zh-CN, en-US
 * @param {*} messages internationalization language pack
 */
export const generateI18n = (locale = 'zh-CN', messages = {}) => {
  return function (key, values = {}) {
    if (!messages || !messages[key]) return '';
    const formater = new IntlMessageFormat(messages[key], locale);
    return formater.format(values);
  };
};
