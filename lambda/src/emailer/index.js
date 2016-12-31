import 'babel-polyfill';
import EmailHandler from './EmailHandler';
import MySQL from 'mysql';
import AWS from 'aws-sdk';

module.exports.handler = async function handler(event, context, callback) {
  const message = event.Records[0].Sns.Message;
  console.log('From SNS:', message);

  /*
   * The input message should look like this:
   * {
   *   "eventId": UUID,
   *   "label": String,
   *   "subjectId": UUID,
   *   "bodyId": UUID
   * }
   */
  const inputMessage = JSON.parse(message);

  //Log all of the stuff from the message, to make sure it's delivered correctly.
  const eventId = inputMessage.id;
  const subjectId = inputMessage.subjectId;
  const bodyId = inputMessage.bodyId;
  const label = inputMessage.label;
  console.log(`eventId ID: ${eventId}`);
  console.log(`subjectId ID: ${subjectId}`);
  console.log(`bodyId ID: ${bodyId}`);
  console.log(`label ID: ${label}`);

  // Give the environment variables (from AWS) a nice name.
  let environmentVariables = process.env;

  /*
   *
   * This is what environment variable access looks like in PHP (which works)
   * $dbhost = $_SERVER['RDS_HOSTNAME'];
   * $dbport = $_SERVER['RDS_PORT'];
   * $dbname = $_SERVER['RDS_DB_NAME'];
   * $username = $_SERVER['RDS_USERNAME'];
   * $password = $_SERVER['RDS_PASSWORD'];
   */
  let sqlConnection = mysql.createConnection({
    host: `${environmentVariables.RDS_HOSTNAME}`,
    port: `${environmentVariables.RDS_PORT}`,
    database: `${environmentVariables.RDS_DB_NAME}`,
    user: `${environmentVariables.RDS_USERNAME}`,
    password: `${environmentVariables.RDS_PASSWORD}`
  });
  this.connection.connect();

  // Establish connection to the dynamo table where message bodies are stored.
  var dynamoTable = new AWS.DynamoDB({ params: { TableName: 'bodies' } });

  // Grab the sender account's username and password 
  let senderUsername = environmentVariables.SENDER_ACCOUNT_USERNAME;
  let senderPassword = environmentVariables.SENDER_ACCOUNT_PASSWORD;
  let nodemailer = require('nodemailer');
  let emailTransporter = nodemailer.createTransport(`smtps://${senderUsername}%40gmail.com:${senderPassword}@smtp.gmail.com`);

  let emailHandler = new EmailHandler(sqlConnection, dynamoTable, emailTransporter);
  await emailHandler.handle(eventId, subjectId, bodyId, label);

  this.connection.end();
  callback(null, "some kind of result");
};
