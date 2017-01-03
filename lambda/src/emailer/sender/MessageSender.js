import Logger from '../util/Logger';

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
    this.emailTransporter = emailTransporter;
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
    // The details of th email to send
    const mailOptions = {
      from: `"To Do" <${senderAddress}>`,
      to: `${recipientAddress}`,
      subject: `${subject}`,
      text: `${body}`
    };
    this.log(`Mail Options: ${JSON.stringify(mailOptions)}`);

    this.log('Sending email...');
    // Promisified sender...
    const sendResult = await this.emailTransporter
      // Send with the promisifed method
      .sendMailAsync(mailOptions)
      // Return the result
      .then(thing => thing);

    this.log(`Email sent: ${JSON.stringify(sendResult)}`);
    return sendResult;
  }
}
