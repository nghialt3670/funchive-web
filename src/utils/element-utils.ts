import {
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";

export const tryCloneNodeWithOnClick = (
  node: ReactNode,
  onClick: MouseEventHandler<Element>,
) => {
  return isValidElement(node)
    ? cloneElement(node as ReactElement<any>, { onClick })
    : node;
};
