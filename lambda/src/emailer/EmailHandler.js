import AddressRetriever from './retriever/AddressRetriever';
import BodyRetriever from './retriever/BodyRetriever';
import SubjectRetriever from './retriever/SubjectRetriever';
import Sender from './sender/Sender';

export default class EmailHandler {
  constructor(sqlConnection, dynamoTable, emailTransporter) {
    this.dynamoTable = dynamoTable;
    this.sqlConnection = sqlConnection;
    this.emailTransporter = emailTransporter;
  }


  async handle(eventId, subjectId, bodyId, label, senderAddress) {
    var addressRetriever = new AddressRetriever(this.sqlConnection);
    var recipientAddress = await addressRetriever.retrieve(label);

    var subjectRetriever = new SubjectRetriever(this.sqlConnection);
    var subject = await subjectRetriever.retrieve(subjectId);

    var bodyRetriever = new BodyRetriever(this.dynamoTable);
    var body = await bodyRetriever.retrieve(bodyId);

    var sender = new Sender(this.emailTransporter);
    await sender.send(recipientAddress, senderAddress, subject, body);

    return 'Email handling complete.';
  }
}