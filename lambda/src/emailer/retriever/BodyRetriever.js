import Promise from 'bluebird';
import Logger from '../util/Logger';
import Preconditions from '../util/Preconditions';

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
    this.dynamoTable = Preconditions.ensureNotNullOrEmpty(dynamoTable, 'dynamoTable may not be null or empty');
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
    if (Preconditions.isNullOrEmpty(bodyId)) {
      return Promise.reject('bodyId may not be null or empty');
    }
    this.log('Getting the message body from DynamoDB.');

    // Parameters are pretty simple... just the body ID
    const getParameters = {
      Key: {
        id: { S: bodyId }
      }
    };

    // Promisified DynamoDB
    let body;
    try {
      body = await this.dynamoTable
        // Get with the new bluebird method...
        .getItemAsync(getParameters)
        // The body sttring is way down in there.
        .then((result) => {
          this.log(`Get result: ${JSON.stringify(result)}`);
          return result.Item.body.S;
        });
    } catch (error) {
      this.log('Error awaiting body retrieval!');
      this.log(`${JSON.stringify(error)}`);
      return Promise.reject(error);
    }

    this.log(`Body retrieved: ${body}`);
    return body;
  }
}
