/**
 * Creates new elements with given tag names and appends parent element to child element.
 * Returns parent element with appended child.
 * 
 * @param {string} parentElementTagName tag name of parent element
 * @param {string} childElementTagName tag name of child element
 * @return {HTMLElement} returns parent element with appended child
 */
export function appendChildToParent(parentElementTagName, childElementTagName) {
  const parent = document.createElement(parentElementTagName);
  const child = document.createElement(childElementTagName);
  parent.appendChild(child);
  return parent;
}

/**
 * Removes all the child nodes of the given parent node.
 * 
 * @param {Node} parent parent Node that needs all children removed
 */
export function removeAllChildNodes(parent) {
  while (parent.hasChildNodes()) 
    parent.removeChild(parent.firstChild);
}