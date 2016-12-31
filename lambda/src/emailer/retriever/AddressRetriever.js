let mysql = require('mysql');

export class AddressRetriever {
  constructor(connection) {
    this.connection = connection;
  }

  async retrieve(label) {
    let queryResult = "";
    queryHandler = function (error, results) {
      if (error) throw error;
      console.log(`Query returned: ${results}`);
      queryResult = results[0];
      console.log(`Grabbing first item: ${queryResult}`);
    };

    this.connection.query('select address from addresses where label = ?', [label], queryHandler);

    return queryResult;
  }
}