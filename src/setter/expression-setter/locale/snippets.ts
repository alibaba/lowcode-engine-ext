export default [
  {
    label: 'constants',
    kind: 'Class',
    insertText: 'constants',
    detail: '应用全局常量',
    documentation: '应用范围定义的通用常量',
  },
  {
    label: 'utils',
    kind: 'Class',
    insertText: 'utils',
    detail: '应用全局公共函数',
    documentation: '应用范围扩展的公共函数',
  },
  {
    label: 'state',
    kind: 'Enum',
    insertText: 'state',
    detail: '当前所在容器组件内部状态',
    documentation: 'React Class内部状态state',
  },
  {
    label: 'setState',
    kind: 'Function',
    insertText: 'setState({\n\t$0\n})',
    insertTextRules: 'InsertAsSnippet',
    detail: '设置当前所在容器组件的state数据',
    documentation: '原生React方法，会自动更新组件视图',
  },
  {
    label: 'reloadDataSource',
    kind: 'Function',
    insertText: 'reloadDataSource(${1:${2:namespace}, ${3:false}, ${4:callback}})',
    insertTextRules: 'InsertAsSnippet',
    detail: '刷新当前所在的容器组件',
    documentation: '触发当前所在的容器组件，重新发送异步请求，并用最新数据更新视图',
  },
  {
    label: 'location',
    kind: 'Class',
    insertText: 'location',
    detail: '路由解析对象',
  },
  {
    label: 'location.query',
    kind: 'Value',
    insertText: 'location.query.${1:xxxx}',
    insertTextRules: 'InsertAsSnippet',
    detail: '从路由解析对象中获取参数信息',
  },
  {
    label: 'history',
    kind: 'Class',
    insertText: 'history',
    detail: '路由历史对象',
  },
  {
    label: 'React',
    kind: 'Keyword',
    insertText: 'React',
    detail: 'React对象',
  },
  {
    label: 'ReactDOM',
    kind: 'Keyword',
    insertText: 'ReactDOM',
    detail: 'ReactDom对象',
  },
  {
    label: 'ReactDOM.findDOMNode',
    kind: 'Function',
    insertText: 'ReactDOM.findDOMNode(${1:this.refs.xxxx})',
    insertTextRules: 'InsertAsSnippet',
    detail: 'ReactDom查找真实dom node',
  },
  {
    label: 'Dialog.alert',
    kind: 'Method',
    insertText: [
      'Dialog.alert({',
      "\tcontent: '${1:Alert content}',",
      "\ttitle: '${2:Title}',",
      '\tonOk: () => {',
      '\t\t$3',
      '\t}',
      '})',
    ].join('\n'),
    insertTextRules: 'InsertAsSnippet',
    detail: 'alert弹框 By Fusion',
  },
  {
    label: 'Dialog.confirm',
    kind: 'Method',
    insertText: [
      'Dialog.confirm({',
      "\tcontent: '${1:Confirm content}',",
      "\ttitle: '${2:Title}',",
      '\tonOk: () => {',
      '\t\t$3',
      '\t},',
      '\tonCancel: () => {',
      '\t\t$4',
      '\t}',
      '})',
    ].join('\n'),
    insertTextRules: 'InsertAsSnippet',
    detail: '确认弹出框 By Fusion',
  },
  {
    label: 'Message.success',
    kind: 'Method',
    insertText: 'Message.success(${1:content})',
    insertTextRules: 'InsertAsSnippet',
    detail: '成功反馈提示 By Fusion',
  },
  {
    label: 'Message.error',
    kind: 'Method',
    insertText: 'Message.error(${1:content})',
    insertTextRules: 'InsertAsSnippet',
    detail: '错误反馈提示 By Fusion',
  },
  {
    label: 'Message.help',
    kind: 'Method',
    insertText: 'Message.help(${1:content})',
    insertTextRules: 'InsertAsSnippet',
    detail: '帮助反馈提示 By Fusion',
  },
  {
    label: 'Message.loading',
    kind: 'Method',
    insertText: 'Message.loading(${1:content})',
    insertTextRules: 'InsertAsSnippet',
    detail: 'loading反馈提示 By Fusion',
  },
  {
    label: 'Message.notice',
    kind: 'Method',
    insertText: 'Message.notice(${1:content})',
    insertTextRules: 'InsertAsSnippet',
    detail: '注意反馈提示 By Fusion',
  },
  {
    label: 'Message.waining',
    kind: 'Method',
    insertText: 'Message.waining(${1:content})',
    insertTextRules: 'InsertAsSnippet',
    detail: '警告反馈提示 By Fusion',
  },
  {
    label: 'Modal.confirm',
    kind: 'Method',
    insertText: [
      'Modal.confirm({',
      "\tcontent: '${1:Confirm content}',",
      "\ttitle: '${2:Title}',",
      '\tonOk: () => {',
      '\t\t$3',
      '\t},',
      '\tonCancel: () => {',
      '\t\t$4',
      '\t}',
      '})',
    ].join('\n'),
    insertTextRules: 'InsertAsSnippet',
    detail: '确认弹出框 By Antd',
  },
  {
    label: 'Modal.info',
    kind: 'Method',
    insertText: [
      'Modal.info({',
      "\tcontent: '${1:Info content}',",
      "\ttitle: '${2:Title}',",
      '\tonOk: () => {',
      '\t\t$3',
      '\t},',
      '\tonCancel: () => {',
      '\t\t$4',
      '\t}',
      '})',
    ].join('\n'),
    insertTextRules: 'InsertAsSnippet',
    detail: '信息弹出框 By Antd',
  },
  {
    label: 'Modal.success',
    kind: 'Method',
    insertText: [
      'Modal.success({',
      "\tcontent: '${1:Success content}',",
      "\ttitle: '${2:Title}',",
      '\tonOk: () => {',
      '\t\t$3',
      '\t},',
      '\tonCancel: () => {',
      '\t\t$4',
      '\t}',
      '})',
    ].join('\n'),
    insertTextRules: 'InsertAsSnippet',
    detail: '成功弹出框 By Antd',
  },
  {
    label: 'Modal.error',
    kind: 'Method',
    insertText: [
      'Modal.error({',
      "\tcontent: '${1:Error content}',",
      "\ttitle: '${2:Title}',",
      '\tonOk: () => {',
      '\t\t$3',
      '\t},',
      '\tonCancel: () => {',
      '\t\t$4',
      '\t}',
      '})',
    ].join('\n'),
    insertTextRules: 'InsertAsSnippet',
    detail: '错误弹出框 By Antd',
  },
  {
    label: 'Modal.warning',
    kind: 'Method',
    insertText: [
      'Modal.warning({',
      "\tcontent: '${1:Warning content}',",
      "\ttitle: '${2:Title}',",
      '\tonOk: () => {',
      '\t\t$3',
      '\t},',
      '\tonCancel: () => {',
      '\t\t$4',
      '\t}',
      '})',
    ].join('\n'),
    insertTextRules: 'InsertAsSnippet',
    detail: '警告弹出框 By Antd',
  },
];
