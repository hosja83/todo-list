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

/**
 * Set the given element's attributes that are given along with their values structured as 
 * an object with key-value pairs.
 * 
 * @param {DOM Element} element DOM element to set attributes
 * @param {Object} attributes key value pairs containing attributes and their values to set
 */
export function setAttributes(element, attributes) {
  for (const key in attributes)
    element.setAttribute(key, attributes[key]);
}

/**
 * Set the given element's attributes that are given along with their values structured as 
 * an object with key-value pairs with the given namespace.
 * 
 * @param {String} namespace String specifying the namespace of the attribute
 * @param {DOM Element} element DOM element to set attributes
 * @param {Object} attributes key value pairs containing attributes and their values to set
 */
export function setAttributesNS(namespace, element, attributes) {
  for (const key in attributes)
    element.setAttributesNS(namespace, key, attributes[key]);
}

/**
 * Appends an arbitrary collection of given children that represent HTML Elements to a
 * parent HTML Element.
 * 
 * @param {HTMLElement} parent Parent HTML Element to have children append to
 * @param {HTMLElement} children Child HTML Elements to be appended to parent
 */
export function appendChildren(parent, children) {
  children.forEach(child => parent.appendChild(child));
}