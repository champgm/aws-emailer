import Promise from 'bluebird';
import RecipientRetriever from './retriever/RecipientRetriever';
import SubjectRetriever from './retriever/SubjectRetriever';
import BodyRetriever from './retriever/BodyRetriever';
import MessageSender from './sender/MessageSender';
import Preconditions from './util/Preconditions';
import Logger from './util/Logger';


/**
 * A class for gathering all dependencies for sending
 * email messages and using a transporter to send them.
 *
 * @export
 * @class EmailHandler
 * @extends {Logger}
 */
export default class EmailHandler extends Logger {

  /**
   * Creates an instance of EmailHandler.
   *
   * @param {any} mysqlConnection - A pre-connected, bluebird-promisified connection to MySQL
   * @param {any} dynamoTable - A bluebird-promisified instance of DynamoDB,
   *                            preconfigured with a table name.
   * @param {any} emailTransporter - A preconfigured, bluebird-promisified nodemailer transporter.
   *
   * @memberOf EmailHandler
   */
  constructor(mysqlConnection, dynamoTable, emailTransporter) {
    super();
    this.mysqlConnection = Preconditions.ensureNotNullOrEmpty(mysqlConnection, 'mysqlConnection may not be null or empty');
    this.dynamoTable = Preconditions.ensureNotNullOrEmpty(dynamoTable, 'dynamoTable may not be null or empty');
    this.emailTransporter = Preconditions.ensureNotNullOrEmpty(emailTransporter, 'emailTransporter may not be null or empty');
  }

  /**
   * Handles the sending of an email with the given attributes using the configured infrastructure
   *
   * @param {any} eventId - The event ID corresponding to this specific send request
   * @param {any} subjectId - The ID for the stored message subject
   * @param {any} bodyId - The ID for the stored message body
   * @param {any} label - The ID for the preconfigured recipient
   * @param {any} senderAddress - The address that the message is to be sent from
   * @returns the results of sending the email
   *
   * @memberOf EmailHandler
   */
  async handle(eventId, subjectId, bodyId, label, senderAddress) {
    if (Preconditions.isNullOrEmpty(eventId)) return Promise.reject('eventId may not be null or empty');
    if (Preconditions.isNullOrEmpty(subjectId)) return Promise.reject('subjectId may not be null or empty');
    if (Preconditions.isNullOrEmpty(bodyId)) return Promise.reject('bodyId may not be null or empty');
    if (Preconditions.isNullOrEmpty(label)) return Promise.reject('label may not be null or empty');
    if (Preconditions.isNullOrEmpty(senderAddress)) return Promise.reject('senderAddress may not be null or empty');

    // Retrieve promise for recipient
    const recipientRetriever = new RecipientRetriever(this.mysqlConnection);
    const recipientAddressPromise = recipientRetriever.retrieve(label);
    // Retrieve promise for subject
    const subjectRetriever = new SubjectRetriever(this.mysqlConnection);
    const subjectPromise = subjectRetriever.retrieve(subjectId);
    // Retrieve promise for body
    const bodyRetriever = new BodyRetriever(this.dynamoTable);
    const bodyPromise = bodyRetriever.retrieve(bodyId);

    // Await all dependencies of the message sender
    let recipientAddress;
    let subject;
    let body;
    try {
      [recipientAddress, subject, body] =
        await Promise.all([recipientAddressPromise, subjectPromise, bodyPromise]);
    } catch (error) {
      this.log('Error awaiting retrievers!');
      this.log(`${JSON.stringify(error)}`);
      return Promise.reject(error);
    }

    // Log them out for troubleshooting
    this.log(`Body: ${body}`);
    this.log(`Recipient: ${recipientAddress}`);
    this.log(`Subject: ${subject}`);

    // Send and await the message
    let sendResult;
    try {
      const messageSender = new MessageSender(this.emailTransporter);
      sendResult = await messageSender.send(recipientAddress, senderAddress, subject, body);
    } catch (error) {
      this.log('Error awaiting message send!');
      this.log(`${JSON.stringify(error)}`);
      return Promise.reject(error);
    }

    this.log(`Send result: ${sendResult}`);
    return sendResult;
  }
}
