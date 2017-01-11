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
   *
   * @memberOf Preconditions
   */
  static ensureConditionTrue(condition, errorMessage) {
    if (!condition) {
      throw new Error(errorMessage);
    }
  }

  /**
   *
   *
   * @static
   * @param {any} argument
   * @param {any} errorMessage
   *
   * @memberOf Preconditions
   */
  static ensureNotNullOrEmpty(argument, errorMessage) {
    if (Preconditions.isNullOrEmpty(argument)) {
      throw new Error(errorMessage);
    }
    return argument;
  }

  static isNullOrEmpty(argument) {
    return (typeof argument === 'undefined' || !argument);
  }

}
