import AWS from 'aws-sdk';

export class BodyRetriever {
  constructor(dynamoTable) {
    this.dynamoTable = dynamoTable;
  }

  async retrieve(bodyId) {
    getParameters = {
      Key: {
        id: { S: bodyId }
      }
    };

    let body = "";
    let retrievalFunction = function (error, data) {
      if (error) throw error;

      console.log(`Retrieved Body: ${JSON.stringify(data)}`);
      body = data.Item;
    };

    this.dynamoTable.getItem(getParameters, retrievalFunction);
    return body;
  }
}