//exception.js

/**
 * User-Defined Exception used for identifying type of exception and 
 * handling errors appropriately
 */
export default function UserException(message) {
  this.message = message;
  this.name = 'UserException';
}