import 'babel-polyfill';
import AWS from 'aws-sdk';
import Promise from 'bluebird';
import EmailHandler from './EmailHandler';


const mysqlClient = Promise.promisifyAll(require('mysql'));
const nodemailer = Promise.promisifyAll(require('nodemailer'));

module.exports.handler = async function handler(event, context, callback) {
  const message = event.Records[0].Sns.Message;
  console.log('From SNS:', message);

  try {
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

    // Log all of the stuff from the message, to make sure it's delivered correctly.
    const eventId = inputMessage.eventId;
    const subjectId = inputMessage.subjectId;
    const bodyId = inputMessage.bodyId;
    const label = inputMessage.label;
    console.log(`eventId ID: ${eventId}`);
    console.log(`subjectId ID: ${subjectId}`);
    console.log(`bodyId ID: ${bodyId}`);
    console.log(`label ID: ${label}`);

    // Give the environment variables (from AWS) a nice name.
    console.log('Grabbing environment variables...');
    const environmentVariables = process.env;

    /*
     *
     * This is what environment variable access looks like in PHP (which works)
     * $dbhost = $_SERVER['RDS_HOSTNAME'];
     * $dbport = $_SERVER['RDS_PORT'];
     * $dbname = $_SERVER['RDS_DB_NAME'];
     * $username = $_SERVER['RDS_USERNAME'];
     * $password = $_SERVER['RDS_PASSWORD'];
     */
    console.log('Configuring MySQL connection...');
    const sqlConnectionParameters = {
      host: `${environmentVariables.RDS_HOSTNAME}`,
      port: `${environmentVariables.RDS_PORT}`,
      database: `${environmentVariables.RDS_DB_NAME}`,
      user: `${environmentVariables.RDS_USERNAME}`,
      password: `${environmentVariables.RDS_PASSWORD}`
    };
    // const sqlConnection = mysql.createConnection(sqlConnectionParameters);
    // console.log('Connecting to MySQL database...');
    // sqlConnection.connect();

    // In my opinion, this is probably bad form. I HATE when I receieve an object and
    // don't know it's structure, but I don't want to pass two parameters when I
    // could pass just one.
    const mysqlConnectionHelper = {
      mysqlClient,
      sqlConnectionParameters
    };

    // Establish connection to the dynamo table where message bodies are stored.
    console.log('Configuring DynamoDB client...');
    const dynamoTable = Promise.promisifyAll(new AWS.DynamoDB({ params: { TableName: 'bodies' } }));

    // Grab the sender account's username and password
    console.log('Grabbing sender account info...');
    const senderUsername = environmentVariables.SENDER_ACCOUNT_USERNAME;
    const senderPassword = environmentVariables.SENDER_ACCOUNT_PASSWORD;

    console.log('Configuring nodemailer...');
    const emailTransporter = Promise.promisifyAll(nodemailer.createTransport(`smtps://${senderUsername}%40gmail.com:${senderPassword}@smtp.gmail.com`));

    console.log('Calling Handler...');
    const emailHandler = new EmailHandler(mysqlConnectionHelper, dynamoTable, emailTransporter);
    await emailHandler.handle(eventId, subjectId, bodyId, label);
    console.log('Handled.');

    console.log('Closing MySQL connection...');
  } catch (error) {
    callback(error);
  }
  callback(null, 'Email successfully sent?');
};
