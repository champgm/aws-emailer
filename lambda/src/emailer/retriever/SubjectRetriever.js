import Logger from '../util/Logger';

export default class SubjectRetriever extends Logger {
  constructor(mysqlConnectionHelper) {
    super();
    this.mysqlConnectionHelper = mysqlConnectionHelper;
  }

  async retrieve(subjectId) {
    this.log('Connecting to MySQL to retireve subject.');

    const connection = this.mysqlConnectionHelper.mysqlClient
      .createConnection(this.mysqlConnectionHelper.sqlConnectionParameters);
    connection.connect();

    let queryResult = '';
    const queryHandler = (error, results) => {
      if (error) throw error;
      this.log(`Query returned subject: ${JSON.stringify(results)}`);
      queryResult = results[0].subject;
      this.log(`Grabbing first subject: ${JSON.stringify(queryResult)}`);
    };

    connection.query('select subject from subjects where id = ?', [subjectId], queryHandler);
    this.log(`Subject retrieved: ${queryResult}`);
    await connection.end();

    return queryResult;
  }
}
