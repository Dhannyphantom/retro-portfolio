// A tiny pub-sub so draggable elements anywhere in the tree can tell the
// custom cursor "I'm being dragged" without prop-drilling or context setup.
export function setCursorDragging(dragging: boolean) {
  window.dispatchEvent(new CustomEvent("cursor-drag", { detail: dragging }));
}
