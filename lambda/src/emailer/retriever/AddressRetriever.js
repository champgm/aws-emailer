import Logger from '../util/Logger';

export default class AddressRetriever extends Logger {
  constructor(mysqlConnection) {
    super();
    this.mysqlConnection = mysqlConnection;
  }

  async retrieve(label) {
    this.log('Connecting to MySQL to retireve recipient address.');

    let queryResult = '';
    const queryHandler = (error, results) => {
      if (error) throw error;
      this.log(`Query returned recipient: ${JSON.stringify(results)}`);
      queryResult = results[0].address;
      this.log(`Grabbing first recipient: ${JSON.stringify(queryResult)}`);
    };

    await this.mysqlConnection.query('select address from destinations where label = ?', [label], queryHandler);
    this.log(`Address retrieved: ${queryResult}`);

    return queryResult;
  }
}
