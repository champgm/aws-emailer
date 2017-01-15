import 'babel-polyfill';
import AWS from 'aws-sdk';
import Promise from 'bluebird';
import EmailHandler from './EmailHandler';

const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
const nodemailer = require('nodemailer');

// This must be like this. I don't know why. This thing has to be promisified
// with "promisifiyAll" and it MUST be in an array, otherwise this process will
// crash SILENTLY.
// I hate bluebird.
// TODO: Learn how to promisify stuff myself.
Promise.promisifyAll([Connection]);

/*
 * Creates a bluebird-promisified MySQL connection with the given parameters
 *
 * @param {any} host - The sever to which a connection will be established
 * @param {any} port - The port to use
 * @param {any} database - The name of the database
 * @param {any} user - The username to use
 * @param {any} password - The password corresponding to the username
 * @returns
 */
async function getMysqlConnection(host, port, database, user, password) {
  console.log('Configuring MySQL connection...');
  const sqlConnectionParameters = {
    host,
    port,
    database,
    user,
    password,
    // debug: true
  };

  console.log('Creating MySQL connection...');
  const mysqlConnection = mysql.createConnection(sqlConnectionParameters);

  try {
    console.log('Connecting to MySQL...');
    await mysqlConnection
      .connectAsync()
      .then(() => {
        console.log('Established connection.', mysqlConnection.threadId);
      });
  } catch (error) {
    this.log('Error connecting to MySQL!');
    this.log(`${JSON.stringify(error)}`);
    return Promise.reject(error);
  }
  return mysqlConnection;
}

/*
 * Creates a bluebird-promisified instance of nodemailer which will use
 * GMail as the sending server
 *
 * @param {any} senderUsername - The GMail username
 * @param {any} senderPassword - The password for that user
 * @returns
 */
async function getNodeEmailer(senderUsername, senderPassword) {
  const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: `${senderUsername}@gmail.com`,
      pass: `${senderPassword}`
    },
    logger: true,
    debug: true
  };

  let emailTransporter;
  try {
    // Why doesn't THIS thing need to be in an array when passed to promisifiyAll ?????
    emailTransporter = Promise.promisifyAll(nodemailer.createTransport(smtpConfig));
  } catch (error) {
    this.log('Error promisifying the email transporter!');
    this.log(`${JSON.stringify(error)}`);
    return Promise.reject(error);
  }
  return emailTransporter;
}

/*
 * Main entrypoint to lambda emailer
 *
 * @param {any} event
 * @param {any} context
 * @param {any} callback
 */
module.exports.handler = async function handler(event, context, callback) {
  const message = event.Records[0].Sns.Message;
  const environmentVariables = process.env;

  /*
   * The input message should look like this:
   *   "eventId": UUID,
   *   "label": String,
   *   "subjectId": UUID,
   *   "bodyId": UUID
   */
  const inputMessage = JSON.parse(message);

  // Log all of the stuff from the message, for troubleshooting
  const eventId = inputMessage.eventId;
  const subjectId = inputMessage.subjectId;
  const bodyId = inputMessage.bodyId;
  const label = inputMessage.label;
  console.log(`eventId ID: ${eventId}`);
  console.log(`subjectId ID: ${subjectId}`);
  console.log(`bodyId ID: ${bodyId}`);
  console.log(`label ID: ${label}`);

  console.log('Configuring DynamoDB client...');
  const dynamoTable = new AWS.DynamoDB({ params: { TableName: 'bodies' } });
  Promise.promisifyAll(Object.getPrototypeOf(dynamoTable));

  // Construct the sender address from environment variables
  const senderUsername = environmentVariables.SENDER_ACCOUNT_USERNAME;
  const senderAddress = `${senderUsername}@gmail.com`;
  // Pass them into the nodemailer creation function
  console.log('Configuring nodemailer...');
  const emailTransporterPromise = getNodeEmailer(
    // const emailTransporter = await getNodeEmailer(
    environmentVariables.SENDER_ACCOUNT_USERNAME,
    environmentVariables.SENDER_ACCOUNT_PASSWORD
  );

  console.log('Connecting to MySQL...');
  const mysqlConnectionPromise = getMysqlConnection(
    // const mysqlConnection = await getMysqlConnection(
    environmentVariables.RDS_HOSTNAME,
    environmentVariables.RDS_PORT,
    environmentVariables.RDS_DB_NAME,
    environmentVariables.RDS_USERNAME,
    environmentVariables.RDS_PASSWORD
  );

  let emailTransporter;
  let mysqlConnection;
  try {
    [emailTransporter, mysqlConnection] = Promise.all([emailTransporterPromise, mysqlConnectionPromise]);
  } catch (error) {
    this.log('Error awaiting the email transporter and/or MySQL connection!');
    this.log(`${JSON.stringify(error)}`);
    return Promise.reject(error);
  }

  // Once you have gathered all of the dependencies, construct and call the EmailHandler
  console.log('Calling Handler...');
  try {
    const emailHandler = new EmailHandler(mysqlConnection, dynamoTable, emailTransporter);
    await emailHandler.handle(eventId, subjectId, bodyId, label, senderAddress);
  } catch (error) {
    this.log('Error handling message!');
    this.log(`${JSON.stringify(error)}`);
    return Promise.reject(error);
  }
  console.log('Handled.');

  // Don't forget to close the MySQL connection!
  // If you don't, the lambda will run until it times out... $$$$$
  console.log('Closing MySQL connection...');
  await mysqlConnection.endAsync();
  console.log('Email successfully sent.');
  console.log('END PROCESSING');

  callback(null, 'Email successfully sent?');
  return new Promise('Eslint wants me to return something');
};
