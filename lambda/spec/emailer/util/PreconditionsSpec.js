import Preconditions from '../../../src/emailer/util/Preconditions';
import ErrorChecker from '../../ErrorChecker';

require('jasmine-co').install();

describe('Preconditions tests', () => {
  describe('Preconditions Preconditions tests', () => {
    describe('When Preconditions is constructed', () => {
      it('Should return the input value, prefixed by the class name', async () => {
        const call = async () => {
          const checker = new Preconditions();
          return checker;
        };
        expect(await ErrorChecker.checkForError(call, 'Preconditions should not be instantiated.')).toBe(true);
      });
    });
  });
  describe('Functionality tests', () => {
    describe('When ensureConditionTrue is called with a true value', () => {
      it('it should return true.', async () => {
        expect(Preconditions.ensureConditionTrue(true, 'true must be true')).toBe(true);
      });
    });
    describe('When ensureConditionTrue is called with a false value', () => {
      it('it should throw an error.', async () => {
        const call = async () => { Preconditions.ensureConditionTrue(false, 'false must be true'); };
        expect(await ErrorChecker.checkForError(call, 'false must be true')).toBe(true);
      });
    });
  });
});
