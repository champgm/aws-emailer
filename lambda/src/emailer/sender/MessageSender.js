import Promise from 'bluebird';
import Logger from '../util/Logger';
import Preconditions from '../util/Preconditions';

/**
 * A class to send email messages.
 *
 * @export
 * @class MessageSender
 * @extends {Logger}
 */
export default class MessageSender extends Logger {

  /**
   * Creates an instance of MessageSender.
   *
   * @param {any} emailTransporter - A preconfigured, bluebird-promisified nodemailer transporter.
   *
   * @memberOf MessageSender
   */
  constructor(emailTransporter) {
    super();
    this.emailTransporter = Preconditions.ensureNotNullOrEmpty(emailTransporter, 'emailTransporter may not be null or empty');
  }

  /**
   * Sends an email with the configured transporter.
   *
   * @param {any} recipientAddress - The address for the recipient
   * @param {any} senderAddress - The address for the sender
   * @param {any} subject - The subject for the message
   * @param {any} body - The body for the message
   * @returns the result of sending
   *
   * @memberOf MessageSender
   */
  async send(recipientAddress, senderAddress, subject, body) {
    if (Preconditions.isNullOrEmpty(recipientAddress)) return Promise.reject('recipientAddress may not be null or empty');
    if (Preconditions.isNullOrEmpty(senderAddress)) return Promise.reject('senderAddress may not be null or empty');
    if (Preconditions.isNullOrEmpty(subject)) return Promise.reject('subject may not be null or empty');
    if (Preconditions.isNullOrEmpty(body)) return Promise.reject('body may not be null or empty');

    // The details of th email to send
    const mailOptions = {
      from: `"To Do" <${senderAddress}>`,
      to: `${recipientAddress}`,
      subject: `${subject}`,
      text: `${body}`
    };

    this.log('Sending email...');
    // Promisified sender...
    let sendResult;
    try {
      sendResult = await this.emailTransporter
        // Send with the promisifed method
        .sendMailAsync(mailOptions)
        // Return the result
        .then(thing => thing);
    } catch (error) {
      this.log('Error awaiting message transporter!');
      this.log(`${JSON.stringify(error)}`);
      return Promise.reject(error);
    }

    this.log(`Email sent: ${JSON.stringify(sendResult)}`);
    return sendResult;
  }
}
