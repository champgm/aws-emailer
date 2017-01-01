import MessageSender from '../../../src/emailer/sender/MessageSender';

require('jasmine-co').install();

describe('MessageSenderSpec tests', () => {
  describe('When log is called', () => {
    it('Should return the input value, prefixed by the class name', () => {
      const sender = new MessageSender();
      const message = 'Some Stuff';
      const output = sender.log(message);
      expect(output).toEqual(`MessageSender: ${message}`);
    });
  });
});
