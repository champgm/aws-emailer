
export class MessageSender {
  constructor(emailTransporter) {
    this.emailTransporter = emailTransporter;
  }

  async retrieve(recipientAddress, senderAddress, subject, body) {
    var mailOptions = {
      from: `"Reminder:" ${senderAddress}`,
      to: `${recipientAddress}`,
      subject: `${subject}`,
      text: `${body}`
    };

    sendResult = "";
    sendFunction = function (error, info) {
      if (error) throw error;
      sendResult = info.response;
    }
    this.emailTransporter.sendMail(mailOptions, sendFunction);

    return sendResult;
  }
}