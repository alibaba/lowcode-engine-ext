import * as React from 'react';
import { Radio, Select, Box, Input } from '@alifd/next';
import { BehaviorActionProps, BehaviorAction } from '../types';

const fetchLinkList = async (url: string) => (url ? (await fetch(url)).json() : []);

interface LinkActionValue {
  type?: 'internal' | 'external';
  target?: string;
  url?: string;
}
interface LinkActionOptions {
  url?: string;
  responseFormatter: (dataSource: any[]) => any[];
}

function fillDefaultValue(value: LinkActionValue) {
  if (typeof value !== 'object') {
    console.warn('value passed to fillDefaultValue should be an object');
    return;
  }
  if (!value.target) {
    value.target = '_self';
  }
  if (!value.type) {
    value.type = 'internal';
  }
}

const LinkContent: React.FC<BehaviorActionProps<LinkActionValue, LinkActionOptions>> = ({
  value = {}, onChange, options = {},
}) => {
  fillDefaultValue(value);
  const { url, responseFormatter } = options;
  const formatter = responseFormatter;
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    let ignore = false;

    fetchLinkList(url).then((result) => {
      if (!ignore) {
        setData(formatter ? formatter(result) : result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [url, formatter]);

  return (
    <Box>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>跳转方式</Box>
        <Box className="behavior-radio">
          <Radio.Group
            size="small"
            dataSource={[
              { label: '当前窗口打开', value: '_self' },
              { label: '新窗口打开', value: '_blank' },
            ]}
            defaultValue="_self"
            shape="button"
            value={value.target || '_self'}
            onChange={(target: any) => {
              onChange({
                ...value,
                target,
              });
            }}
          />
        </Box>
      </Box>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>跳转类型</Box>
        <Box className="behavior-radio">
          <Radio.Group
            size="small"
            dataSource={[
              { label: '内部页面', value: 'internal' },
              { label: '外部链接', value: 'external' },
            ]}
            defaultValue="internal"
            shape="button"
            value={value.type || 'internal'}
            onChange={(type: any) => {
              onChange({
                ...value,
                type,
              });
            }}
          />
        </Box>
      </Box>
      <Box direction="row" align="center" className="behavior-item">
        <Box style={{ width: 70 }}>跳转页面</Box>
        <Box className="behavior-radio">
          {value?.type === 'external' ? (
            <Input
              size="small"
              hasClear
              placeholder="请输入链接"
              value={value.url}
              onChange={(val) => {
                onChange({
                  type: value.type || 'internal',
                  url: val,
                });
              }}
            />
          ) : (
            <Select
              size="small"
              hasClear
              showSearch
              dataSource={data}
              value={value?.url}
              onChange={(val) => {
                onChange({
                  ...value,
                  url: val,
                });
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const linkBehaviorAction: BehaviorAction<LinkActionValue, LinkActionOptions> = {
  name: 'link',
  title: '链接',
  render: (props) => <LinkContent {...props} />,
  toActionValue: (link) => (link.url ? {
    type: 'JSExpression',
    value: `function() {window.open('${link.url}', '${link.target}');}`,
  } : null),
};
