'use strict';

module.exports.handler = async function handler(event, context, callback) {
  const message = event.Records[0].Sns.Message;
  console.log('From SNS:', message);

  /*
   * The input message should look like this:
   * {
   *   "eventId": UUID,
   *   "label": String,
   *   "subjectId": UUID,
   *   "bodyId": UUID
   * }
   */
  const inputMessage = JSON.parse(message);

  const eventId = inputMessage.id;
  const subjectId = inputMessage.subjectId;
  const bodyId = inputMessage.bodyId;
  const label = inputMessage.label;




  callback(null, "some kind of result");
};
