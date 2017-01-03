import Logger from '../util/Logger';

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
    this.mysqlConnection = mysqlConnection;
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
    this.log('Querying MySQL to retireve recipient address.');

    // Promisified connection...
    const address = await this.mysqlConnection
      // Query with the new bluebird method...
      .queryAsync('select address from destinations where label = ?', [label])
      // Then take the result of the query and find the subject inside.
      .then((result) => {
        this.log(`Query result: ${JSON.stringify(result)}`);
        return result[0].address;
      });

    this.log(`Recipient retrieved: ${address}`);
    return address;
  }
}
