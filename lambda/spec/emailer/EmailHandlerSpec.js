
import 'babel-polyfill';
import EmailHandler from '../../src/emailer/EmailHandler';
import ErrorChecker from '../ErrorChecker';

require('jasmine-co').install();

function theError(expectedMessage) {
  return new Error(expectedMessage);
}

describe('EmailHandler Specifications:', () => {
  let mysqlConnection;
  let dynamoTable;
  let emailTransporter;
  beforeAll(() => {
    mysqlConnection = jasmine.createSpy('MySQL Connection');
    dynamoTable = jasmine.createSpy('Dummy Dynamo Table');
    emailTransporter = jasmine.createSpy('Nodemailer transporter');
  });

  describe('When log is called,', () => {
    it('the input value (prefixed by the class name) should be returned.', () => {
      const sendr = new EmailHandler(mysqlConnection, dynamoTable, emailTransporter);
      const message = 'Some Stuff';
      const output = sendr.log(message);
      expect(output).toEqual(`EmailHandler: ${message}`);
    });
  });

  describe('Preconditions Specifications:', () => {
    let emailHandler;
    let sqlError;
    let dynamoError;
    let emailError;
    let eventId;
    let subjectId;
    let bodyId;
    let label;
    let senderAddress;
    beforeAll(() => {
      emailHandler = new EmailHandler(mysqlConnection, dynamoTable, emailTransporter);
      sqlError = 'mysqlConnection may not be null or empty';
      dynamoError = 'dynamoTable may not be null or empty';
      emailError = 'emailTransporter may not be null or empty';
      eventId = 'eventId may not be null or empty';
      subjectId = 'subjectId may not be null or empty';
      bodyId = 'bodyId may not be null or empty';
      label = 'label may not be null or empty';
      senderAddress = 'senderAddress may not be null or empty';
    });
    describe('When instantiated without arguments,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new EmailHandler(); };
        expect(callWrapper).toThrow(theError('mysqlConnection may not be null or empty'));
      });
    });
    describe('When instantiated with a null or undefined arguments,', () => {
      it('errors should be thrown.', () => {
        const callWrapper1 = function callWrapper1() { return new EmailHandler(undefined, {}, {}); };
        expect(callWrapper1).toThrow(theError(sqlError));
        const callWrapper2 = function callWrapper2() { return new EmailHandler({}, undefined, {}); };
        expect(callWrapper2).toThrow(theError(dynamoError));
        const callWrapper3 = function callWrapper3() { return new EmailHandler({}, {}, undefined); };
        expect(callWrapper3).toThrow(theError(emailError));
        const callWrapper4 = function callWrapper4() { return new EmailHandler(null, {}, {}); };
        expect(callWrapper4).toThrow(theError(sqlError));
        const callWrapper5 = function callWrapper5() { return new EmailHandler({}, null, {}); };
        expect(callWrapper5).toThrow(theError(dynamoError));
        const callWrapper6 = function callWrapper6() { return new EmailHandler({}, {}, null); };
        expect(callWrapper6).toThrow(theError(emailError));
      });
    });
    describe('When handle is called without parameters and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await emailHandler.handle(); };
        expect(await ErrorChecker.checkForError(call, sqlError)).toBe(true);
      });
    });
    describe('When handle is called with any single parameter undefined or null and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call1 = async () => { await emailHandler.handle(undefined, {}, {}, {}, {}); };
        expect(await ErrorChecker.checkForError(call1, eventId)).toBe(true);
        const call2 = async () => { await emailHandler.handle({}, undefined, {}, {}, {}); };
        expect(await ErrorChecker.checkForError(call2, subjectId)).toBe(true);
        const call3 = async () => { await emailHandler.handle({}, {}, undefined, {}, {}); };
        expect(await ErrorChecker.checkForError(call3, bodyId)).toBe(true);
        const call4 = async () => { await emailHandler.handle({}, {}, {}, undefined, {}); };
        expect(await ErrorChecker.checkForError(call4, label)).toBe(true);
        const call5 = async () => { await emailHandler.handle({}, {}, {}, {}, undefined); };
        expect(await ErrorChecker.checkForError(call5, senderAddress)).toBe(true);
        const call6 = async () => { await emailHandler.handle(null, {}, {}, {}, {}); };
        expect(await ErrorChecker.checkForError(call6, eventId)).toBe(true);
        const call7 = async () => { await emailHandler.handle({}, null, {}, {}, {}); };
        expect(await ErrorChecker.checkForError(call7, subjectId)).toBe(true);
        const call8 = async () => { await emailHandler.handle({}, {}, null, {}, {}); };
        expect(await ErrorChecker.checkForError(call8, bodyId)).toBe(true);
        const call9 = async () => { await emailHandler.handle({}, {}, {}, null, {}); };
        expect(await ErrorChecker.checkForError(call9, label)).toBe(true);
        const call10 = async () => { await emailHandler.handle({}, {}, {}, {}, null); };
        expect(await ErrorChecker.checkForError(call10, senderAddress)).toBe(true);
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
        const emailHandler = new EmailHandler(spyNodemailer);
        const sendResult = await emailHandler.handle(recipientAddress, senderAddress, subject, body);
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
        const emailHandler = new EmailHandler(spyNodemailer);
        const call = async () => {
          await emailHandler.handle(recipientAddress, senderAddress, subject, body);
        };
        expect(await ErrorChecker.checkForError(call, mockedRejection)).toBe(true);
      });
    });
  });
});
