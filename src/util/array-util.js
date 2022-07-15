/**
 * Removes the first occurrence of the element from the given array that satisfies the callback function. 
 * Returns an array containing deleted elements or an empty array if no elements are removed.
 * 
 * @param {Array} arr array to be traversed
 * @param {callback} callbackFn function to execute on each value in array until function returns true or reaches end of array 
 * @returns {Array} an array containing deleted elements, empty array if no elements are removed
 */
export function removeFirst(arr, callbackFn) {
  const index = arr.findIndex(callbackFn);
  return arr.splice(index, 1);
}

/**
 * Returns an array that contains the first occurrence which meets the callbackFn's criteria.
 * 
 * @param {Array} arr the array to traverse
 * @param {Function} callbackFn the function used to find the first occurrence
 * @returns 
 */
export function findFirst(arr, callbackFn) {
  const index = arr.findIndex(callbackFn);
  return arr.slice(index, index + 1); //or just return arr[index]
}