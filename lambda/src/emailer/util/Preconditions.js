/**
 * A utility class for checking arguments
 *
 * @class Preconditions
 */
export default class Preconditions {

  /**
   * Creates an instance of Preconditions.
   *
   * @memberOf Preconditions
   */
  constructor() {
    throw new Error('Preconditions should not be instantiated.');
  }

  /**
   * Checks the given condition. If false, throws an error with the given message.
   *
   * @static
   * @param {any} condition - A condition which should be true
   * @param {any} errorMessage - A message which should be
   * @returns - true if the condition is true
   *
   * @memberOf Preconditions
   */
  static ensureConditionTrue(condition, errorMessage) {
    if (!condition) {
      throw new Error(errorMessage);
    }
    return condition;
  }

  /**
   * Checks an argument to make sure it's not null or empty.
   * Throws an exception if it is.
   *
   * @static
   * @param {any} argument - the argument to check for null and empty
   * @param {any} errorMessage - The error to throw if the argument is null or empty
   * @returns - the input argument
   *
   * @memberOf Preconditions
   */
  static ensureNotNullOrEmpty(argument, errorMessage) {
    if (Preconditions.isNullOrEmpty(argument)) {
      throw new Error(errorMessage);
    }
    return argument;
  }

  /**
   * Checks if an argument is null or empty.
   *
   * @static
   * @param {any} argument - the argument to check for null or empty
   * @returns true if the argument is null or empty
   *
   * @memberOf Preconditions
   */
  static isNullOrEmpty(argument) {
    return (typeof argument === 'undefined' || !argument);
  }

}
