import Logger from '../util/Logger';

/**
 * Retrieves a message body from the bodies dynamo table
 *
 * @export
 * @class BodyRetriever
 * @extends {Logger}
 */
export default class BodyRetriever extends Logger {

  /**
   * Creates an instance of BodyRetriever.
   *
   * @param {any} dynamoTable - A bluebird-promisified instance of DynamoDB,
   *                            preconfigured with a table name.
   *
   * @memberOf BodyRetriever
   */
  constructor(dynamoTable) {
    super();
    this.dynamoTable = dynamoTable;
  }

  /**
   * Retrieves a message body from the body table corresponding to the given BodyID
   *
   * @param {any} bodyId - The key ID for the desired message body
   * @returns the corresponding message body
   *
   * @memberOf BodyRetriever
   */
  async retrieve(bodyId) {
    // Parameters are pretty simple... just the body ID
    const getParameters = {
      Key: {
        id: { S: bodyId }
      }
    };


    // Promisified DynamoDB
    const body = await this.dynamoTable
      // Get with the new bluebird method...
      .getItemAsync(getParameters)
      // Sorry, this part is a little ridiculous.
      .then((result) => {
        this.log(`Get result: ${JSON.stringify(result)}`);
        return result.Item.body.S;
      });

    return body;
  }
}
