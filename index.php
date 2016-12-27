<!DOCTYPE html>
<html lang="en">

<head>
  <title>email</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>


  <script src='https://code.jquery.com/jquery-3.1.0.min.js'></script>
  <script src="js/awsEndpoint.js"></script>
  <script src="js/focus.js"></script>
</head>

<body>
  <div class="container-fluid">
    <form role="form" id="form" action="sendemail" method="POST" target="_blank">
      <!--<div class="row">
<div class="col-xs-4 col-xs-offset-4">
<div class="radio">
<label><input type="radio" name="recipient" value="mac" checked="checked">Mac</label>
</div>
</div>
</div>
<div class="row">
<div class="col-xs-4 col-xs-offset-4">
<div class="radio">
<label><input type="radio" name="recipient" value="na">Na</label>
</div>
</div>
</div>
<div class="row">
<div class="col-xs-4 col-xs-offset-4">
<div class="radio">
<label><input type="radio" name="recipient" value="all">All</label>
</div>
</div>
</div>
<div class="row">
<div class="col-xs-4 col-xs-offset-4">
<div class="radio">
<label><input type="radio" name="recipient" value="error">Error</label>
</div>
</div>
</div>-->
      <?php include 'php/retrieveTags.php' ?>
      <?php print "<div><p>stuff stuff stuff</p></div>"; ?>
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