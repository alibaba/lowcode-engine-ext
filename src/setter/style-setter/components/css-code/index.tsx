import * as React from 'react';
import { Button} from '@alifd/next';
import { StyleData } from '../../utils/types';
import { parseToCssCode, parseToStyleData } from '../../utils';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import Icon from '../../components/icon';
interface CodeProps {
  styleData: StyleData | any;
  onStyleDataChange: (val: any) => void;
}

const extensions = [css()];
export default class CssCode extends React.Component<CodeProps> {
  state = {
    cssCode: '',
    isCanSave:true,
  };


  componentWillReceiveProps(nextProps: CodeProps) {
    const cssCode = parseToCssCode(nextProps.styleData);
    this.setState({
      cssCode,
    });
  }

  componentDidMount() {
    const { styleData } = this.props;
    const cssCode = parseToCssCode(styleData);
    this.setState({
      cssCode,
    });
  }


  savaStyle = () => {
    const { onStyleDataChange } = this.props;
    const {cssCode} = this.state;
    const newStyleData = parseToStyleData(cssCode);
     // 检查是否和原来的styleData完全相同
    newStyleData && onStyleDataChange(newStyleData);
    this.setState({
      isCanSave:true
    })
  }


  updateCode = (newCode: string) => {
    this.setState({
      cssCode: newCode,
    });
    const newStyleData = parseToStyleData(newCode);
    if (newStyleData){
      this.setState({
        isCanSave:false
      })
    }

  };

  render() {
    const { cssCode,isCanSave } = this.state;
    return (
        <div>
          <div style={{marginBottom:'5px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <Icon type="icon-CSS"></Icon>
            <Button type="primary" disabled={isCanSave} onClick={this.savaStyle}>保存</Button>
          </div>
          <CodeMirror
              value={cssCode}
              onChange={(value, viewUpdate) => this.updateCode(value)}
              extensions={extensions}
              basicSetup={{
                foldGutter: false,
                lineNumbers:false
              }}
  
          />
        </div>
    );
  }
}
