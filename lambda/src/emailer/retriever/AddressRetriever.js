import Logger from '../util/Logger';

export default class AddressRetriever extends Logger {
  constructor(mysqlConnectionHelper) {
    super();
    this.mysqlConnectionHelper = mysqlConnectionHelper;
  }

  async retrieve(label) {
    this.log('Connecting to MySQL to retireve recipient address.');

    const connection = this.mysqlConnectionHelper.mysqlClient
      .createConnection(this.mysqlConnectionHelper.sqlConnectionParameters);
    connection.connect();

    let queryResult = '';
    const queryHandler = (error, results) => {
      if (error) throw error;
      this.log(`Query returned recipient: ${JSON.stringify(results)}`);
      queryResult = results[0].address;
      this.log(`Grabbing first recipient: ${JSON.stringify(queryResult)}`);
    };

    await connection.query('select address from destinations where label = ?', [label], queryHandler);
    this.log(`Address retrieved: ${queryResult}`);
    await connection.end();

    return queryResult;
  }
}
