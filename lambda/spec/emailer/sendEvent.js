import { handler } from '../../src/emailer/index';

require('jasmine-co').install();

describe('index.js tests', () => {
  describe('When log is called', () => {
    it('Should return the input value, prefixed by the class name', () => {
      //  const message = event.Records[0].Sns.Message;
      const event = {
        Records: [{
          Sns: {
            Message: '{"eventId": "bbd9f96f-5992-4d60-a90b-5a459be8b6a9", "label": "Mac", "subjectId": "ade043b6-eb22-47a8-a6c1-3bfcb2cc5fb6", "bodyId": "ce1e0c4f-ec53-4256-b607-1ee27d68758e"}'
          }
        }]
      };

      const callback = (error, message) => {
        expect(error).toEqual(null);
        expect(message).toEqual('Email successfully sent?');
      };

      try {
        handler(event, callback, callback);
      } catch (error) {
        console.log(error);
      }
    });
  });
});

