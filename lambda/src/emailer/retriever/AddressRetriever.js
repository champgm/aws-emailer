let mysql = require('mysql');
let environmentVariables = process.env;

export class AddressRetriever {
  constructor(label) {
    this.label = label;
  }

  async retrieve() {
    /*
     * This is what it looks like in PHP (which works)
     * $dbhost = $_SERVER['RDS_HOSTNAME'];
     * $dbport = $_SERVER['RDS_PORT'];
     * $dbname = $_SERVER['RDS_DB_NAME'];
     * $username = $_SERVER['RDS_USERNAME'];
     * $password = $_SERVER['RDS_PASSWORD'];
     */
    let connection = mysql.createConnection({
      host: `${environmentVariables.RDS_HOSTNAME}`,
      port: `${environmentVariables.RDS_PORT}`,
      database: `${environmentVariables.RDS_DB_NAME}`,
      user: `${environmentVariables.RDS_USERNAME}`,
      password: `${environmentVariables.RDS_PASSWORD}`
    });
    connection.connect();

    // What is this shit? is this really the pattern you have to follow to get the results of a query?
    // An external variable that's modified by a function passed to an external library's object?
    let queryResult = "";
    queryHandler = function (error, results) {
      if (err) throw err;
      console.log(`Query returned: ${results}`);
      queryResult = results[0];
      console.log(`Grabbing first item: ${queryResult}`);
    };

    connection.query('select address from addresses where label = ?', ['a'], queryHandler);
    connection.end();

    return queryResult;
  }
}