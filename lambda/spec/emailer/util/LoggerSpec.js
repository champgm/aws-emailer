import Logger from '../../../src/emailer/util/Logger';

require('jasmine-co').install();

describe('LoggerSpec tests', () => {
  describe('When log is called', () => {
    it('Should return the input value, prefixed by the class name', () => {
      const logger = new Logger();
      const message = 'Some Stuff';
      const output = logger.log(message);
      expect(output).toEqual(`Logger: ${message}`);
    });
  });
});
