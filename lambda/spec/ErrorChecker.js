export default class ErrorChecker {

  constructor() {
    throw new Error('ErrorChecker should not be instantiated.');
  }

  static async checkForError(functionToCall, expectedError) {
    let thrown = false;
    try {
      await functionToCall();
    } catch (error) {
      thrown = true;
      expect(error).toEqual(expectedError);
    }
    expect(thrown).toBe(true);
    return thrown;
  }
}
