import 'babel-polyfill';
import RecipientRetriever from '../../../src/emailer/retriever/RecipientRetriever';
import ErrorChecker from '../../ErrorChecker';

require('jasmine-co').install();

function theError(expectedMessage) {
  return new Error(expectedMessage);
}

describe('RecipientRetriever Specifications:', () => {
  let mysqlConnection;
  beforeAll(() => {
    mysqlConnection = jasmine.createSpy('MySQL Connection');
  });

  describe('When log is called,', () => {
    it('the input value (prefixed by the class name) should be returned.', () => {
      const retriever = new RecipientRetriever(mysqlConnection);
      const message = 'Some Stuff';
      const output = retriever.log(message);
      expect(output).toEqual(`RecipientRetriever: ${message}`);
    });
  });

  describe('Preconditions Specifications:', () => {
    let recipientRetriever;
    let labelNotNull;
    beforeAll(() => {
      recipientRetriever = new RecipientRetriever(mysqlConnection);
      labelNotNull = 'label may not be null or empty';
    });
    describe('When instantiated without a MySQL connection,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new RecipientRetriever(); };
        expect(callWrapper).toThrow(theError('mysqlConnection may not be null or empty'));
      });
    });
    describe('When instantiated with a null or undefined MySQL connection,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new RecipientRetriever(undefined); };
        expect(callWrapper).toThrow(theError('mysqlConnection may not be null or empty'));
        const callWrapper2 = function callWrapper2() { return new RecipientRetriever(null); };
        expect(callWrapper2).toThrow(theError('mysqlConnection may not be null or empty'));
      });
    });
    describe('When retrieve is called without a label and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await recipientRetriever.retrieve(); };
        expect(await ErrorChecker.checkForError(call, labelNotNull)).toBe(true);
      });
    });
    describe('When retrieve is called with a null label and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await recipientRetriever.retrieve(null); };
        expect(await ErrorChecker.checkForError(call, labelNotNull)).toBe(true);
      });
    });
    describe('When retrieve is called with an undefined label and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await recipientRetriever.retrieve(undefined); };
        expect(await ErrorChecker.checkForError(call, labelNotNull)).toBe(true);
      });
    });
  });

  describe('Functionality Specifications:', () => {
    let expectedQuery;
    let address;
    let label;
    beforeAll(() => {
      expectedQuery = 'select address from destinations where label = ?';
      address = 'recipient1@asdf.net';
      label = 'aLabel';
    });
    describe('When retrieve is called with a valid label and the MySQL query works,', () => {
      it('the MySQL connection should have been called with the expected query and should have returned the expected recipient.', async () => {
        const mockedResult = [{ address }];
        const spymysqlConnection = {
          async queryAsync(queryTemplate, strings) {
            expect(queryTemplate).toEqual(expectedQuery);
            expect(strings[0]).toEqual(label);
            return Promise.resolve(mockedResult);
          }
        };
        const recipientRetriever = new RecipientRetriever(spymysqlConnection);
        const retrievedRecipient = await recipientRetriever.retrieve(label);
        expect(retrievedRecipient).toEqual(address);
      });
    });
    describe('When retrieve is called with a valid label and the query fails,', () => {
      it('the MySQL connection should have been called with the expected query and should have returned a rejected promise.', async () => {
        const mockedRejection = 'mockedRejection1';
        const spymysqlConnection = {
          async queryAsync(queryTemplate, strings) {
            expect(queryTemplate).toEqual(expectedQuery);
            expect(strings[0]).toEqual(label);
            return Promise.reject(mockedRejection);
          }
        };
        const recipientRetriever = new RecipientRetriever(spymysqlConnection);
        const call = async () => { await recipientRetriever.retrieve(label); };
        expect(await ErrorChecker.checkForError(call, mockedRejection)).toBe(true);
      });
    });
  });
});
