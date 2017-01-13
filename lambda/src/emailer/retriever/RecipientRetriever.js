import Promise from 'bluebird';
import Logger from '../util/Logger';
import Preconditions from '../util/Preconditions';

/**
 * Retrieves a recipient from the destinations table
 *
 * @export
 * @class RecipientRetriever
 * @extends {Logger}
 */
export default class RecipientRetriever extends Logger {

  /**
   * Creates an instance of RecipientRetriever.
   *
   * @param {any} mysqlConnection - A pre-connected, bluebird-promisified connection to MySQL
   *
   * @memberOf RecipientRetriever
   */
  constructor(mysqlConnection) {
    super();
    this.mysqlConnection = Preconditions.ensureNotNullOrEmpty(mysqlConnection, 'mysqlConnection may not be null or empty');
  }

  /**
   * Retrieves a subject from the subjects table corresponding to the given SubjectID
   *
   * @param {any} label - The label for the desired recipient
   * @returns the corresponding recipient's email address
   *
   * @memberOf RecipientRetriever
   */
  async retrieve(label) {
    if (Preconditions.isNullOrEmpty(label)) {
      return Promise.reject('label may not be null or empty');
    }

    this.log('Querying MySQL to retireve recipient address.');

    // Promisified connection...
    let address;
    try {
      address = await this.mysqlConnection
        // Query with the new bluebird method...
        .queryAsync('select address from destinations where label = ?', [label])
        // Then take the result of the query and find the subject inside.
        .then((result) => {
          this.log(`Query result: ${JSON.stringify(result)}`);
          return result[0].address;
        });
    } catch (error) {
      this.log('Error awaiting address retrieval!');
      this.log(`${JSON.stringify(error)}`);
      return Promise.reject(error);
    }
    // .catch((error) => {
    //   this.log(`Query FAILED: ${JSON.stringify(error)}`);
    //   return Promise.reject(error);
    // });

    this.log(`Recipient retrieved: ${address}`);
    return address;
  }
}
