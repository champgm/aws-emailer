# aws-emailer
This is a re-write of a self-emailer I wrote in Java a while back. I rewrote it this way mostly to learn front-end/full-stack web development. I also wanted to get a feel for how different pieces of AWS work in order to be better at my current job.

# Current Project Structure
![Project Structure](/Project-Structure.png?raw=true)

# Current Behavior & Technology
This project uses many technologies to function. It also uses quite a few to build and deploy. It is set up and intended to use AWS for the entirety of its infrastructure, but it could be repackaged or tweaked to work somewhere else.

## Web Farontend
Technologies for functionality:
 * HTML
 * PHP
 * The AWS PHP SDK

Technologies for build and deployment:
 * Composer
 * The Elastic Beanstalk CLI

Technologies for testing:
 * PHP's [built in web server](https://secure.php.net/manual/en/features.commandline.webserver.php)
 * [browser-sync](https://github.com/browsersync/browser-sync) in [proxy mode](https://www.browsersync.io/docs/options/#option-proxy)
 * No unit tests =(

Here's a quick summary of what the web frontend does in index.php:
 * Retrieve configured recipients from a MySQL database
 * Print those to the index page
 * Load the rest of the HTML form
 * On submit, POSTs form data to php/submit.php

Here's what, while logging to the page that loads, submit.php actually does:
 * Check form data for preconditions
 * Collect environment variables from AWS configuration
 * Generate a UUID as a key for another table in that AWS MySQL database
 * Store the subject on that table
 * Generate a UUID as a key for an AWS DynamoDB
 * Store the body in that DynamoDB
 * Submit an AWS SNS message containing
   * A unique ID for this event
   * The intended recipient
   * The key for the subject
   * The key for the body

## Web Frontend Architecture
![Web Frontend Architecture](/Web-Frontend-Architecture.png?raw=true)

## Lambda Backend
Technologies for functionality:
 * ECMAScript6
 * Node.js
 * AWS Node.js SDK
 * [nodemailer](https://github.com/nodemailer/nodemailer)
 * [mysqljs](https://github.com/mysqljs/mysql)
 * [bluebird](http://bluebirdjs.com/docs/getting-started.html) -_-

Technologies for build and deployment:
 * NPM
 * Babel
 * Serverless

Technologies for testing:
 * eslint
 * jasmine (with [babel-register](https://babeljs.io/docs/core-packages/babel-register/))
 * [istanbul](https://github.com/gotwarlost/istanbul) and [nyc](https://github.com/istanbuljs/nyc) for coverage reports

Here's a summary of what the Lambda architecture does:
 * Is triggered by the arrival of an SNS message
 * Attempts to parse keys and recipients from the message
 * Collects environment variables from AWS configuration
 * Retrieves the recipient's address from MySQL
 * Retrieves the intended subject from MySQL
 * Retrieves the intended body from DynamoDB
 * Composes all of those items into an email message
 * Sends the message with a preconfigured GMail account
