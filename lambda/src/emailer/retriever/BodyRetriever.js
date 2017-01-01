import Logger from '../util/Logger';

export default class BodyRetriever extends Logger {
  constructor(dynamoTable) {
    super();
    this.dynamoTable = dynamoTable;
  }

  async retrieve(bodyId) {
    const getParameters = {
      Key: {
        id: { S: bodyId }
      }
    };

    let body = '';
    const retrievalFunction = (error, data) => {
      if (error) throw error;

      this.log(`Retrieved Body: ${JSON.stringify(data)}`);
      body = data.Item;
    };

    await this.dynamoTable.getItem(getParameters, retrievalFunction);
    this.log(`Body retrieved: ${body}`);
    return body;
  }
}
