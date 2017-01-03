import AddressRetriever from './retriever/AddressRetriever';
import BodyRetriever from './retriever/BodyRetriever';
import SubjectRetriever from './retriever/SubjectRetriever';
import MessageSender from './sender/MessageSender';
import Logger from './util/Logger';

export default class EmailHandler extends Logger {
  constructor(mysqlConnection, dynamoTable, emailTransporter) {
    super();
    this.dynamoTable = dynamoTable;
    this.mysqlConnection = mysqlConnection;
    this.emailTransporter = emailTransporter;
  }


  async handle(eventId, subjectId, bodyId, label, senderAddress) {
    const addressRetriever = new AddressRetriever(this.mysqlConnection);
    const recipientAddressPromise = addressRetriever.retrieve(label);

    const subjectRetriever = new SubjectRetriever(this.mysqlConnection);
    const subjectPromise = subjectRetriever.retrieve(subjectId);

    const bodyRetriever = new BodyRetriever(this.dynamoTable);
    const bodyPromise = bodyRetriever.retrieve(bodyId);

    const recipientAddress = await recipientAddressPromise;
    const subject = await subjectPromise;
    const body = await bodyPromise;
    this.log(`Recipient: ${recipientAddress}`);
    this.log(`Subject: ${subject}`);
    this.log(`Body: ${body}`);

    const messageSender = new MessageSender(this.emailTransporter);
    await messageSender.send(recipientAddress, senderAddress, subject, body);

    const completeString = 'Email handling complete.';
    this.log(`${completeString}`);

    return completeString;
  }
}
