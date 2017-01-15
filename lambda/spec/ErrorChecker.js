/**
 * Test utility class for checking errors because handling
 * 1000 errors on async method calls sucks.
 *
 * @export
 * @class ErrorChecker
 */
export default class ErrorChecker {

  /**
   * Creates an instance of ErrorChecker.
   * Will throw an exception
   *
   * @memberOf ErrorChecker
   */
  constructor() {
    throw new Error('ErrorChecker should not be instantiated.');
  }

  /**
   * Calls a given function and expects an error.
   * Will return whether or not it threw anything.
   *
   * @static
   * @param {any} functionToCall - the function to expect an error from
   * @param {string} expectedError - the error to expect, this should be a string
   * @returns true if the expected error was thrown
   *
   * @memberOf ErrorChecker
   */
  static async checkForError(functionToCall, expectedError) {
    let thrown = false;
    try {
      await functionToCall();
    } catch (error) {
      thrown = true;
      if (error instanceof Error) {
        expect(error).toEqual(new Error(expectedError));
      } else {
        expect(error).toEqual(expectedError);
      }
    }
    expect(thrown).toBe(true);
    return thrown;
  }
}
