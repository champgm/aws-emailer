import AddressRetriever from './retriever/AddressRetriever';
import BodyRetriever from './retriever/BodyRetriever';
import SubjectRetriever from './retriever/SubjectRetriever';
import Sender from './sender/Sender';

export default class BullHornDelivery {
  constructor(eventId, subjectId, bodyId, label) {
    this.eventId = eventId;
    this.subjectId = subjectId;
    this.bodyId = bodyId;
    this.label = label;
  }


  async handle() {
    var addressRetriever = new AddressRetriever(this.label);
    var address = await addressRetriever.retrieve();
    var bodyRetriever = new BodyRetriever(this.bodyId);
    var body = await bodyRetriever.retrieve();
    var subjectRetriever = new SubjectRetriever(this.subjectId);
    var subject = await subjectRetriever.retrieve();


    var sender = new Sender(address, subject, body);
    await sender.send();
    
  }
}