import Logger from '../util/Logger';

export default class MessageSender extends Logger {
  constructor(emailTransporter) {
    super();
    this.emailTransporter = emailTransporter;
  }

  async send(recipientAddress, senderAddress, subject, body) {
    const mailOptions = {
      from: `"Reminder:" <${senderAddress}>`,
      to: `${recipientAddress}`,
      subject: `${subject}`,
      text: `${body}`
    };

    this.log(`from: "Reminder:" <${senderAddress}>`);
    this.log(`to: ${recipientAddress}`);
    this.log(`subject: ${subject}`);
    this.log(`text: ${body}`);

    this.log('Sending email...');
    let sendResult = '';
    const sendFunction = (error, info) => {
      if (error) throw error;
      sendResult = info.response;
    };
    this.emailTransporter.sendMail(mailOptions, sendFunction);
    this.log(`Email sent: ${sendResult}`);

    return sendResult;
  }
}
