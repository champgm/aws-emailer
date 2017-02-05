<!DOCTYPE html>
<html lang="en">

<head>
  <title>email</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <link href="https://fonts.googleapis.com/css?family=Oxygen" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="css/style.css">

  
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  <script src="js/typeahead.js/typeahead.jquery.min.js"></script>
  <script src="js/typeahead.js/bloodhound.min.js"></script>
  <script src="js/contacts.js"></script>
	<script src="js/show_contact.js"></script>
	<script src="js/contacts_printer.js"></script>
  <script src="js/script.js"></script>

</head>

<body>
  <nav id="header-nav" class="navbar navbar-default">
		<div class="container">
			<div class="navbar-header">
				<a class="navbar-brand" href="index.html">
          			<h1>Email</h1>
        		</a>
			</div>  			
	</nav> 
  <div id="main-content" class="container">
    <form role="form" id="form" action="php/submit.php" method="POST" target="_blank">
     
      <div id="contact" class="hidden-md hidden-sm hidden-xs text-center">
        <input class="typeahead" type="text" name="label" placeholder="Search Contacts">
      </div>

      <div class="form-group hidden-lg">
				<div id="contact-btn" class="btn-checkbox clearfix" data-toggle="buttons">
				</div>
	 		</div>
			<div id="subject-div" class="form-group">
				<label id="subject-label" for="subject">Subject</label> 
				<input type="text" class="form-control" id="subject" name="subject" placeholder="Enter subject">
				<span id="text-clear-subject" class="glyphicon glyphicon-remove-circle"></span>

			</div>
			<div id="body-div"class="form-group">
				<label for="body">Body</label>
				<textarea class="form-control" rows="5" id="body" name="body" placeholder="Enter email content here"></textarea>
				<span id="text-clear-body" class="glyphicon glyphicon-remove-circle"></span>
			</div>
			<div class="text-center">
				<button type="button" value="submit" id="btnsubmit" class="btn btn-default">Submit</button>
				<button type="reset" class="btn btn-default">Reset</button>
			</div>
    </form>
  </div>
</body>

</html>