import AddressRetriever from './retriever/AddressRetriever';
import BodyRetriever from './retriever/BodyRetriever';
import SubjectRetriever from './retriever/SubjectRetriever';
import MessageSender from './sender/MessageSender';

export default class EmailHandler {
  constructor(sqlConnection, dynamoTable, emailTransporter) {
    this.dynamoTable = dynamoTable;
    this.sqlConnection = sqlConnection;
    this.emailTransporter = emailTransporter;
  }


  async handle(eventId, subjectId, bodyId, label, senderAddress) {
    const addressRetriever = new AddressRetriever(this.sqlConnection);
    const recipientAddress = await addressRetriever.retrieve(label);

    const subjectRetriever = new SubjectRetriever(this.sqlConnection);
    const subject = await subjectRetriever.retrieve(subjectId);

    const bodyRetriever = new BodyRetriever(this.dynamoTable);
    const body = await bodyRetriever.retrieve(bodyId);

    const messageSender = new MessageSender(this.emailTransporter);
    await messageSender.send(recipientAddress, senderAddress, subject, body);

    return 'Email handling complete.';
  }
}
