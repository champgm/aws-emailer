import 'babel-polyfill';
import BodyRetriever from '../../../src/emailer/retriever/BodyRetriever';
import ErrorChecker from '../../ErrorChecker';

require('jasmine-co').install();

function theError(expectedMessage) {
  return new Error(expectedMessage);
}

describe('BodyRetriever Specifications:', () => {
  let dummyDynamoTable;
  beforeAll(() => {
    dummyDynamoTable = jasmine.createSpy('Dummy Dynamo Table');
  });

  describe('When log is called,', () => {
    it('the input value (prefixed by the class name) should be returned.', () => {
      const retriever = new BodyRetriever(dummyDynamoTable);
      const message = 'Some Stuff';
      const output = retriever.log(message);
      expect(output).toEqual(`BodyRetriever: ${message}`);
    });
  });

  describe('Preconditions Specifications:', () => {
    let bodyRetriever;
    let bodyIdError;
    beforeAll(() => {
      bodyRetriever = new BodyRetriever(dummyDynamoTable);
      bodyIdError = 'bodyId may not be null or empty';
    });
    describe('When instantiated without a Dynamo Table,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new BodyRetriever(); };
        expect(callWrapper).toThrow(theError('dynamoTable may not be null or empty'));
      });
    });
    describe('When instantiated with a null or undefined Dynamo Table,', () => {
      it('an error should be thrown.', () => {
        const callWrapper = function callWrapper() { return new BodyRetriever(undefined); };
        expect(callWrapper).toThrow(theError('dynamoTable may not be null or empty'));
        const callWrapper2 = function callWrapper2() { return new BodyRetriever(null); };
        expect(callWrapper2).toThrow(theError('dynamoTable may not be null or empty'));
      });
    });
    describe('When retrieve is called without a body ID and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await bodyRetriever.retrieve(); };
        expect(await ErrorChecker.checkForError(call, bodyIdError)).toBe(true);
      });
    });
    describe('When retrieve is called with a null body ID and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await bodyRetriever.retrieve(null); };
        expect(await ErrorChecker.checkForError(call, bodyIdError)).toBe(true);
      });
    });
    describe('When retrieve is called with an undefined body ID and wrapped in a try/catch,', () => {
      it('An error should be caught.', async () => {
        const call = async () => { await bodyRetriever.retrieve(undefined); };
        expect(await ErrorChecker.checkForError(call, bodyIdError)).toBe(true);
      });
    });
  });

  describe('Functionality Specifications:', () => {
    describe('When retrieve is called with a valid body ID and the Dynamo Table call works,', () => {
      it('the Dynamo Table should have been called with the expected key and should have returned the expected body.', async () => {
        const bodyId = 'bodyId1';
        const bodyContents = 'bodyContents1';
        const expectedKey = { Key: { id: { S: bodyId } } };
        const mockedGetResult = { Item: { body: { S: bodyContents } } };
        const spyDynamoTable = {
          async getItemAsync(getParameters) {
            expect(getParameters).toEqual(expectedKey);
            return Promise.resolve(mockedGetResult);
          }
        };
        const bodyRetriever = new BodyRetriever(spyDynamoTable);
        const retrievedBody = await bodyRetriever.retrieve(bodyId);
        expect(retrievedBody).toEqual(bodyContents);
      });
    });
    describe('When retrieve is called with a valid body ID and Dynamo Table call fails,', () => {
      it('the Dynamo Table should have been called with the expected key and should have returned a rejected promise.', async () => {
        const bodyId = 'bodyId1';
        const expectedKey = { Key: { id: { S: bodyId } } };
        const mockedRejection = 'mockedRejection1';
        const spyDynamoTable = {
          async getItemAsync(getParameters) {
            expect(getParameters).toEqual(expectedKey);
            return Promise.reject(mockedRejection);
          }
        };
        const bodyRetriever = new BodyRetriever(spyDynamoTable);
        const call = async () => { await bodyRetriever.retrieve(bodyId); };
        expect(await ErrorChecker.checkForError(call, mockedRejection)).toBe(true);
      });
    });
  });
});
