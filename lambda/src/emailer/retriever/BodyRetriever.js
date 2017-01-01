export default class BodyRetriever {
  constructor(dynamoTable) {
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

      console.log(`Retrieved Body: ${JSON.stringify(data)}`);
      body = data.Item;
    };

    this.dynamoTable.getItem(getParameters, retrievalFunction);
    return body;
  }
}
