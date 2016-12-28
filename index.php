<!DOCTYPE html>
<html lang="en">

<head>
  <title>email</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

  <?php require 'vendor/autoload.php'; ?>
  <?php use Aws\Sns\SnsClient; ?>
  <script src="js/focus.js"></script>
</head>

<body>
  <div class="container-fluid">
    <form role="form" id="form" action="php/submit.php" method="POST" target="_blank">
      <?php include 'php/prepareDatabaseConnection.php'; ?>
      <?php include 'php/retrieveLabels.php'; ?>
      <?php include 'php/printLabelsList.php'; ?>

        <div class="form-group">
          <label for="subject">Subject:</label>
          <input type="text" class="form-control" id="subject" name="subject">
        </div>
        <div class="form-group">
          <label for="body">Body:</label>
          <textarea class="form-control" rows="5" id="body" name="body"></textarea>
        </div>
        <div class="text-center">
          <button type="submit" class="btn btn-default">Submit</button>
        </div>
    </form>
  </div>
</body>

</html>