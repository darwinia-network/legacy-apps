import { ReactElement, ReactNode } from 'react';

const hasProps = (jsx: ReactNode): jsx is ReactElement =>
  Object.prototype.hasOwnProperty.call(jsx, 'props');

function reduceJsxToString (previous: string, current: ReactNode): string {
  return previous + innerText(current);
}

function innerText (jsx: ReactNode): string {
  // Empty
  if (
    jsx === null ||
    typeof jsx === 'boolean' ||
    typeof jsx === 'undefined'
  ) {
    return '';
  }

  // Numeric children.
  if (typeof jsx === 'number') {
    return jsx.toString();
  }

  // String literals.
  if (typeof jsx === 'string') {
    return jsx;
  }

  // Array of JSX.
  if (Array.isArray(jsx)) {
    return jsx.reduce<string>(reduceJsxToString, '');
  }

  // Children prop.
  if (
    hasProps(jsx) &&
    Object.prototype.hasOwnProperty.call(jsx.props, 'children')
  ) {
    return innerText(jsx.props.children);
  }

  // Default
  return '';
}

export default innerText;
