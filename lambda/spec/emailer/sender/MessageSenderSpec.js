import 'babel-polyfill';
import MessageSender from '../../../src/emailer/sender/MessageSender';
import ErrorChecker from '../../ErrorChecker';

require('jasmine-co').install();

function theError(expectedMessage) {
  return new Error(expectedMessage);
}

describe('MessageSender Specifications:', () => {
  let emailTransporter;
  beforeAll(() => {
    emailTransporter = jasmine.createSpy('Nodemailer transporter');
  });

  describe('When log is called,', () => {
    it('the input value (prefixed by the class name) should be returned.', () => {
      const sendr = new MessageSender(emailTransporter);
      const message = 'Some Stuff';
      const output = sendr.log(message);
      expect(output).toEqual(`MessageSender: ${message}`);
    });
  });

  describe('Preconditions Specifications:', () => {
    let messageSender;
    let recipientError;
    beforeAll(() => {
      messageSender = new MessageSender(emailTransporter);
      recipientError = 'recipientAddress may not be null or empty';
    });
    describe('When instantiated without an emailTransporter connection,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new MessageSender(); };
        expect(callWrapper).toThrow(theError('emailTransporter may not be null or empty'));
      });
    });
    describe('When instantiated with a null or undefined emailTransporter connection,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new MessageSender(undefined); };
        expect(callWrapper).toThrow(theError('emailTransporter may not be null or empty'));
        const callWrapper2 = function callWrapper2() { return new MessageSender(null); };
        expect(callWrapper2).toThrow(theError('emailTransporter may not be null or empty'));
      });
    });
    describe('When send is called without parameters and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await messageSender.send(); };
        expect(await ErrorChecker.checkForError(call, recipientError)).toBe(true);
      });
    });
    describe('When send is called with a null parameter and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await messageSender.send(null); };
        expect(await ErrorChecker.checkForError(call, recipientError)).toBe(true);
      });
    });
    describe('When send is called with an undefined parameter and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await messageSender.send(undefined); };
        expect(await ErrorChecker.checkForError(call, recipientError)).toBe(true);
      });
    });
    describe('When send is called with any single parameter undefined or null and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call1 = async () => { await messageSender.send(undefined, {}, {}, {}); };
        expect(await ErrorChecker.checkForError(call1, recipientError)).toBe(true);
        const call2 = async () => { await messageSender.send({}, undefined, {}, {}); };
        expect(await ErrorChecker.checkForError(call2, 'senderAddress may not be null or empty')).toBe(true);
        const call3 = async () => { await messageSender.send({}, {}, undefined, {}); };
        expect(await ErrorChecker.checkForError(call3, 'subject may not be null or empty')).toBe(true);
        const call4 = async () => { await messageSender.send({}, {}, {}, undefined); };
        expect(await ErrorChecker.checkForError(call4, 'body may not be null or empty')).toBe(true);
        const call5 = async () => { await messageSender.send(null, {}, {}, {}); };
        expect(await ErrorChecker.checkForError(call5, recipientError)).toBe(true);
        const call6 = async () => { await messageSender.send({}, null, {}, {}); };
        expect(await ErrorChecker.checkForError(call6, 'senderAddress may not be null or empty')).toBe(true);
        const call7 = async () => { await messageSender.send({}, {}, null, {}); };
        expect(await ErrorChecker.checkForError(call7, 'subject may not be null or empty')).toBe(true);
        const call8 = async () => { await messageSender.send({}, {}, {}, null); };
        expect(await ErrorChecker.checkForError(call8, 'body may not be null or empty')).toBe(true);
      });
    });
  });

  describe('Functionality Specifications:', () => {
    let recipientAddress;
    let expectedOptions;
    let senderAddress;
    let subject;
    let body;
    beforeAll(() => {
      recipientAddress = 'someone@somewhere.net';
      senderAddress = 'util@elsewhere.com';
      subject = 'Do stuff!';
      body = 'no text';
      expectedOptions = {
        from: `"To Do" <${senderAddress}>`,
        to: `${recipientAddress}`,
        subject: `${subject}`,
        text: `${body}`
      };
    });
    describe('When send is called with a valid label and the emailTransporter works,', () => {
      it('the emailTransporter should have been called with the expected email options and should have returned some kind of result.', async () => {
        const mockedResult = { someStuff: 'someStuff' };
        const spyNodemailer = {
          async sendMailAsync(emailOptions) {
            expect(emailOptions).toEqual(expectedOptions);
            return Promise.resolve(mockedResult);
          }
        };
        const messageSender = new MessageSender(spyNodemailer);
        const sendResult = await messageSender.send(recipientAddress, senderAddress, subject, body);
        expect(sendResult).toEqual(mockedResult);
      });
    });
    describe('When send is called with a valid label and the query fails,', () => {
      it('the emailTransporter should have been called with the expected email options and should have returned a rejected promise.', async () => {
        const mockedRejection = 'mockedRejection1';
        const spyNodemailer = {
          async sendMailAsync(emailOptions) {
            expect(emailOptions).toEqual(expectedOptions);
            return Promise.reject(mockedRejection);
          }
        };
        const messageSender = new MessageSender(spyNodemailer);
        const call = async () => {
          await messageSender.send(recipientAddress, senderAddress, subject, body);
        };
        expect(await ErrorChecker.checkForError(call, mockedRejection)).toBe(true);
      });
    });
  });
});
