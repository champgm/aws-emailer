import BodyRetriever from './retriever/BodyRetriever';
import RecipientRetriever from './retriever/RecipientRetriever';
import SubjectRetriever from './retriever/SubjectRetriever';
import MessageSender from './sender/MessageSender';
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
    this.dynamoTable = dynamoTable;
    this.mysqlConnection = mysqlConnection;
    this.emailTransporter = emailTransporter;
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
    const [recipientAddress, subject, body] =
      await Promise.all([recipientAddressPromise, subjectPromise, bodyPromise]);

    // Log them out for troubleshooting
    this.log(`Body: ${body}`);
    this.log(`Recipient: ${recipientAddress}`);
    this.log(`Subject: ${subject}`);

    // Send and await the message
    const messageSender = new MessageSender(this.emailTransporter);
    const sendResult = await messageSender.send(recipientAddress, senderAddress, subject, body);

    this.log(`Send result: ${sendResult}`);
    return sendResult;
  }
}
