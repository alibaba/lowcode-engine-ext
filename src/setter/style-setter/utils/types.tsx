export interface StyleData {
  styleKey: string;
  value: string | number | boolean;
}

export interface RadioItem {
  value: string;
  icon?: string;
  title?: string;
  tips: string;
}

export interface onStyleChange {
  (styleDataList: Array<StyleData>): void;
}
