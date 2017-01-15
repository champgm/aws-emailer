# OSX Install Instructions
It seems like getting this project up and running for development isn't so easy... Here are some detailed steps about how to do it.

# Workstation Dependencies
1.  Install and/or update [homebrew](http://brew.sh/)
      ```
      brew update --debug --verbose
      brew upgrade --debug --verbose
      ```

1.  Using brew, install 'node' and 'npm'
      ```
      brew install npm
      brew install node
      ```

1.  Using brew, install 'awscli' and 'awsebcli'
      ```
      brew install awscli
      brew install awsebcli
      ```

1.  Configure awscli, it will look something like this:
      ```
      aws configure
      AWS Access Key ID: asdf12345
      AWS Secret Access Key: 12345asdf
      Default region name: us-west-2
      Default output format [None]: <It's fine to leave this blank>
      ```

1.  Right now, this project is configured to use an AWS configuration profile called `mine`. I did this because I have a profile for work that needs to be the default, but I wanted mine configured as well. As far as I can recall, the only place it is hard-coded is in the lambda folder's `.serverless` file. Either change that to `default` there or...

    configure the `[mine]` profile:
      ```
      cd ~/.aws
      subl .
      ```
      Now, edit both `configuration` and `credentials` so they look something like this:
      ```
      [default]
      region = us-west-2
      [mine]
      region = us-west-2
      ```
      ```
      [default]
      aws_access_key_id = asdf12345
      aws_secret_access_key = 12345asdf
      [mine]
      aws_access_key_id = asdf12345
      aws_secret_access_key = 12345asdf
      ```
      Now, you can use all of the aws cli tools with your profile by using the flag `--profile mine`.

1.  Using brew, [install a recent version of PHP](https://developerjack.com/blog/2016/08/26/Installing-PHP71-with-homebrew/).
      ```
      brew tap homebrew/dupes
      brew tap homebrew/versions
      brew tap homebrew/homebrew-php
      brew install php71
      ```
      Now, in your `.bashrc` or `.zshrc` or whatever shell you're using, manage your `PATH` variable such that the php link homebrew installed is loaded before the default one. As of right now, my last `PATH` line looks something like this:
      ```
      export PATH=/usr/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/X11/bin:$PATH
      ```
      Hopefully, when you check the PHP version, it should look something like this:
      ```
      php --version
      PHP 7.1.0 (cli) (built: Dec  2 2016 05:24:57) ( ZTS MSVC14 (Visual C++ 2015) x64 )
      Copyright (c) 1997-2016 The PHP Group
      Zend Engine v3.1.0-dev, Copyright (c) 1998-2016 Zend Technologies
      ```

# web-frontend Dependencies
1.  Open a terminal and navigate to the `web-frontend` folder of this project

1.  Install [composer](https://getcomposer.org/)
      ```
      php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
      php -r "if (hash_file('SHA384', 'composer-setup.php') === '55d6ead61b29c7bdee5cccfb50076874187bd9f21f65d8991d46ec5cc90518f447387fb9f76ebae1fbbacf329e583e30') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
      php composer-setup.php
      php -r "unlink('composer-setup.php');"
      ```

1.  Install the PHP dependencies for the web-frontend using composer
      ```
      php composer.phar install
      ```

1.  Initialize the Elastic Beanstalk configuration with ebcli. That will look something like this:
      ```
      $ eb init
      Select a default region
      1) us-east-1 : US East (N. Virginia)
      2) us-west-1 : US West (N. California)
      3) us-west-2 : US West (Oregon)
      ...
      (default is 3): 3

      Select an application to use
      1) php-lambda-emailer
      2) Emailer
      3) [ Create new Application ]
      (default is 3): 1
      Note:
       Elastic Beanstalk now supports AWS CodeCommit; a fully-managed source control service. To learn more, see Docs: https://aws.amazon.com/codecommit/
      Do you wish to continue with CodeCommit? (y/n) (default is n): n
      ```

# Configure environment variables
Configuring environment variables [for lambdas](https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html) and [for elastic beanstalk](https://docs.aws.amazon.com/gettingstarted/latest/deploy/envvar.html) is out of scope of this readme, but you WILL need to configure them locally for testing.

Add a block of 'export' commands to your `.*rc` file. Something like this:
```
#Environment Variables for testing AWS stuff
export RDS_HOSTNAME="mysql.whatever.com"
export RDS_PORT="3306"
export RDS_DB_NAME="php-lambda-emailer"
export RDS_USERNAME="dbuser"
export RDS_PASSWORD="dbpassword"
export SENDER_ACCOUNT_USERNAME="gmail-util-account-name"
export SENDER_ACCOUNT_PASSWORD="gmail-util-account-password"
```

# Start the dev server
1.  Ideally, you should now be ready to start the dev server. Open two new tabs in your terminal and navigate both to the `web-frontend` folder of this project

1.  First, start the PHP dev server
      ```
      npm run server
      ```

1.  Now, run browsersync so the page will refresh each time you edit something
      ```
      npm run browsersync
      ```