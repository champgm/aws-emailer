import Promise from 'bluebird';
import Logger from '../util/Logger';
import Preconditions from '../util/Preconditions';

/**
 * Retrieves an email subject from the subjects table
 *
 * @export
 * @class SubjectRetriever
 * @extends {Logger}
 */
export default class SubjectRetriever extends Logger {

  /**
   * Creates an instance of SubjectRetriever.
   *
   * @param {any} mysqlConnection - A pre-connected, bluebird-promisified connection to MySQL
   *
   * @memberOf SubjectRetriever
   */
  constructor(mysqlConnection) {
    super();
    this.mysqlConnection = Preconditions.ensureNotNullOrEmpty(mysqlConnection, 'mysqlConnection may not be null or empty');
  }

  /**
   * Retrieves a subject from the subjects table corresponding to the given SubjectID
   *
   * @param {any} subjectId - The row key for the desired subject
   * @returns the corresponding subject
   *
   * @memberOf SubjectRetriever
   */
  async retrieve(subjectId) {
    if (Preconditions.isNullOrEmpty(subjectId)) {
      return Promise.reject('subjectId may not be null or empty');
    }

    this.log('Querying MySQL to retireve subject.');

    // Promisified connection...
    let subject;
    try {
      subject = await this.mysqlConnection
        // Query with the new bluebird method...
        .queryAsync('select subject from subjects where id = ?', [subjectId])
        // Then take the result of the query and find the subject inside.
        .then((result) => {
          this.log(`Query result: ${JSON.stringify(result)}`);
          return result[0].subject;
        });
    } catch (error) {
      this.log('Error awaiting subject retrieval!');
      this.log(`${JSON.stringify(error)}`);
      return Promise.reject(error);
    }

    this.log(`Subject retrieved: ${subject}`);
    return subject;
  }
}
