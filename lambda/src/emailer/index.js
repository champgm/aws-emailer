import 'babel-polyfill';
import AWS from 'aws-sdk';
import Promise from 'bluebird';
import EmailHandler from './EmailHandler';

const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
const nodemailer = require('nodemailer');

// This must be like this. I don't know why.
// I hate bluebird.
// TODO: Learn how to promisify stuff myself.
Promise.promisifyAll([Connection]);

/**
 * Pulls needed values from environment variables and creates a
 * connected, promisified instance of a MySQL connection.
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

  console.log('Connecting to MySQL...');
  await mysqlConnection
    .connectAsync()
    .then(() => {
      console.log('Established connection.', mysqlConnection.threadId);
    })
    .catch((error) => {
      console.error('Connection error.', error);
    });
  return mysqlConnection;
}

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

  const emailTransporter = Promise.promisifyAll(nodemailer.createTransport(smtpConfig));
  return emailTransporter;
}

/**
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

  // Construct the sender address from environment variables
  const senderUsername = environmentVariables.SENDER_ACCOUNT_USERNAME;
  const senderAddress = `${senderUsername}@gmail.com`;

  console.log('Configuring DynamoDB client...');
  const dynamoTable = new AWS.DynamoDB({ params: { TableName: 'bodies' } });
  Promise.promisifyAll(Object.getPrototypeOf(dynamoTable));


  console.log('Configuring nodemailer...');
  const emailTransporter = await getNodeEmailer(
    environmentVariables.SENDER_ACCOUNT_USERNAME,
    environmentVariables.SENDER_ACCOUNT_PASSWORD
  );

  console.log('Connecting to MySQL...');
  const mysqlConnection = await getMysqlConnection(
    environmentVariables.RDS_HOSTNAME,
    environmentVariables.RDS_PORT,
    environmentVariables.RDS_DB_NAME,
    environmentVariables.RDS_USERNAME,
    environmentVariables.RDS_PASSWORD
  );

  console.log('Calling Handler...');
  const emailHandler = new EmailHandler(mysqlConnection, dynamoTable, emailTransporter);
  await emailHandler.handle(eventId, subjectId, bodyId, label, senderAddress);
  console.log('Handled.');

  console.log('Closing MySQL connection...');
  await mysqlConnection.endAsync();
  console.log('Email successfully sent.');
  console.log('END PROCESSING');

  callback(null, 'Email successfully sent?');
};
