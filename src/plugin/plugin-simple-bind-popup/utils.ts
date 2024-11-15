export function adjustOverlayPosition(overlay: HTMLElement, padding: any[]) {
  const rect = overlay.getBoundingClientRect();
  const style = getComputedStyle(overlay);
  const windowWidth = window.innerWidth;
  const [paddingTop = 0] = padding || [0];
  const [, paddingRight = paddingTop, paddingBottom = paddingTop] = padding || [0];
  const [,,, paddingLeft = paddingRight || paddingTop] = padding || [0];

  let newTop = rect.top;
  let newLeft = rect.left;

  // 检查并修正左侧和右侧
  if (rect.left < 0) {
    newLeft = paddingLeft;
    console.debug('超出可视区域', 'left');
  } else if (rect.right > windowWidth) {
    console.debug('超出可视区域', 'right');
    newLeft = windowWidth - rect.width - paddingRight;
  }

  // 检查并修正顶部和底部
  if (rect.top < 0) {
    newTop = paddingTop;
    console.debug('超出可视区域', 'top');
  } else if (style.bottom.includes('-')) {
    console.debug('超出可视区域', 'bottom');
    // 下方超出的话则反转展示在上方。
    newTop -= parseFloat(style.height) + paddingBottom;
  }

  // 应用修正后的位置
  overlay.style.left = `${newLeft}px`;
  overlay.style.top = `${newTop}px`;
}