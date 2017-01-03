import BodyRetriever from './retriever/BodyRetriever';
import RecipientRetriever from './retriever/RecipientRetriever';
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
    this.log('Calling recipient retriever...');
    const recipientRetriever = new RecipientRetriever(this.mysqlConnection);
    const recipientAddressPromise = recipientRetriever.retrieve(label);

    this.log('Awaiting recipient...');
    const recipientAddress = await recipientAddressPromise;

    this.log('Calling subject retriever...');
    const subjectRetriever = new SubjectRetriever(this.mysqlConnection);
    const subjectPromise = subjectRetriever.retrieve(subjectId);

    this.log('Awaiting subject...');
    const subject = await subjectPromise;

    this.log('Calling body retriever...');
    const bodyRetriever = new BodyRetriever(this.dynamoTable);
    const bodyPromise = bodyRetriever.retrieve(bodyId);

    this.log('Awaiting body...');
    const body = await bodyPromise;

    this.log(`Body: ${body}`);
    this.log(`Recipient: ${recipientAddress}`);
    this.log(`Subject: ${subject}`);


    const messageSender = new MessageSender(this.emailTransporter);
    await messageSender.send(recipientAddress, senderAddress, subject, body);

    const completeString = 'Email handling complete.';
    this.log(`${completeString}`);

    return completeString;
  }
}
