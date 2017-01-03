
/**
 * A superclass that provides utility methods for logging
 *
 * @export
 * @class Logger
 */
export default class Logger {

  /**
   * Prepends the current class name and then logs the given message to console.
   *
   * @param {any} message - The message to print
   * @returns - The full string that was printed.
   *
   * @memberOf Logger
   */
  log(message) {
    const output = `${this.constructor.name}: ${message}`;
    console.log(output);
    return output;
  }

}
