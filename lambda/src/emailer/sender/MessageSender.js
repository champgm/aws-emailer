
export default class MessageSender {
  constructor(emailTransporter) {
    this.emailTransporter = emailTransporter;
  }

  async retrieve(recipientAddress, senderAddress, subject, body) {
    const mailOptions = {
      from: `"Reminder:" ${senderAddress}`,
      to: `${recipientAddress}`,
      subject: `${subject}`,
      text: `${body}`
    };

    let sendResult = '';
    const sendFunction = (error, info) => {
      if (error) throw error;
      sendResult = info.response;
    };
    this.emailTransporter.sendMail(mailOptions, sendFunction);

    return sendResult;
  }
}
