import 'babel-polyfill';
import SubjectRetriever from '../../../src/emailer/retriever/SubjectRetriever';
import ErrorChecker from '../../ErrorChecker';

require('jasmine-co').install();

function theError(expectedMessage) {
  return new Error(expectedMessage);
}

describe('SubjectRetriever Specifications:', () => {
  let mysqlConnection;
  beforeAll(() => {
    mysqlConnection = jasmine.createSpy('MySQL Connection');
  });

  describe('When log is called,', () => {
    it('the input value (prefixed by the class name) should be returned.', () => {
      const retriever = new SubjectRetriever(mysqlConnection);
      const message = 'Some Stuff';
      const output = retriever.log(message);
      expect(output).toEqual(`SubjectRetriever: ${message}`);
    });
  });

  describe('Preconditions Specifications:', () => {
    let subjectIdError;
    let subjectRetriever;
    beforeAll(() => {
      subjectRetriever = new SubjectRetriever(mysqlConnection);
      subjectIdError = 'subjectId may not be null or empty';
    });
    describe('When instantiated without a MySQL connection,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new SubjectRetriever(); };
        expect(callWrapper).toThrow(theError('mysqlConnection may not be null or empty'));
      });
    });
    describe('When instantiated with a null or undefined MySQL connection,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new SubjectRetriever(undefined); };
        expect(callWrapper).toThrow(theError('mysqlConnection may not be null or empty'));
        const callWrapper2 = function callWrapper2() { return new SubjectRetriever(null); };
        expect(callWrapper2).toThrow(theError('mysqlConnection may not be null or empty'));
      });
    });
    describe('When retrieve is called without a subjectId and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await subjectRetriever.retrieve(); };
        expect(await ErrorChecker.checkForError(call, subjectIdError)).toBe(true);
      });
    });
    describe('When retrieve is called with a null subjectId and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await subjectRetriever.retrieve(null); };
        expect(await ErrorChecker.checkForError(call, subjectIdError)).toBe(true);
      });
    });
    describe('When retrieve is called with an undefined subjectId and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await subjectRetriever.retrieve(undefined); };
        expect(await ErrorChecker.checkForError(call, subjectIdError)).toBe(true);
      });
    });
  });

  describe('Functionality Specifications:', () => {
    let expectedQuery;
    let subject;
    let subjectId;
    beforeAll(() => {
      expectedQuery = 'select subject from subjects where id = ?';
      subject = "Don't forget to do stuff!";
      subjectId = 'subjectId1';
    });
    describe('When retrieve is called with a valid subjectId and the MySQL query works,', () => {
      it('the MySQL connection should have been called with the expected query and should have returned the expected subject.', async () => {
        const mockedResult = [{ subject }];
        const spymysqlConnection = {
          async queryAsync(queryTemplate, strings) {
            expect(queryTemplate).toEqual(expectedQuery);
            expect(strings[0]).toEqual(subjectId);
            return Promise.resolve(mockedResult);
          }
        };
        const subjectRetriever = new SubjectRetriever(spymysqlConnection);
        const retrievedSubject = await subjectRetriever.retrieve(subjectId);
        expect(retrievedSubject).toEqual(subject);
      });
    });
    describe('When retrieve is called with a valid subjectId and the query fails,', () => {
      it('the MySQL connection should have been called with the expected query and should have returned a rejected promise.', async () => {
        const mockedRejection = 'mockedRejection1';
        const spymysqlConnection = {
          async queryAsync(queryTemplate, strings) {
            expect(queryTemplate).toEqual(expectedQuery);
            expect(strings[0]).toEqual(subjectId);
            return Promise.reject(mockedRejection);
          }
        };
        const subjectRetriever = new SubjectRetriever(spymysqlConnection);
        const call = async () => { await subjectRetriever.retrieve(subjectId); };
        expect(await ErrorChecker.checkForError(call, mockedRejection)).toBe(true);
      });
    });
  });
});
