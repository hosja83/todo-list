/**
 * Removes the first occurrence of the element from the given array that satisfies the callback function. 
 * Returns an array containing deleted elements or an empty array if no elements are removed.
 * 
 * @param {Array} arr array to be traversed
 * @param {callback} callbackFn function to execute on each value in array until function returns true or reaches end of array 
 * @returns {Array} an array containing deleted elements, empty array if no elements are removed
 */
export function removeOnce(arr, callbackFn) {
  const index = arr.findIndex(callbackFn);
  return arr.splice(index, 1);
}
