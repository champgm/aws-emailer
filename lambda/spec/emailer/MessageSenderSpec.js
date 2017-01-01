import EmailHandler from '../../src/emailer/EmailHandler';

require('jasmine-co').install();

describe('EmailHandlerSpec tests', () => {
  describe('When log is called', () => {
    it('Should return the input value, prefixed by the class name', () => {
      const sender = new EmailHandler();
      const message = 'Some Stuff';
      const output = sender.log(message);
      expect(output).toEqual(`EmailHandler: ${message}`);
    });
  });
});
