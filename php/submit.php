<?php
include 'uuid.php';
use Aws\Sns\SnsClient;
use Aws\DynamoDb\DynamoDbClient;

function div_print($message)
{
    print '<div>';
    print_r($message);
    print '</div>';
}

function submit_sns($eventId, $label, $subjectId, $bodyId)
{
    $client = SnsClient::factory(array('region' => 'us-west-2'));

    $snsSubject = "Email Event with ID: $eventId";
    $snsArray = array(
      'eventId' => $eventId,
      'label' => $label,
      'subjectId' => $subjectId,
      'bodyId' => $bodyId
    );
    $snsMessage = json_encode($snsArray);

    $snsData = array(
      'TopicArn' => 'arn:aws:sns:us-west-2:637769611129:emailer_entrypoint',
      // 'TargetArn' => 'string',
      // Message is required
      'Message' => $snsMessage,
      'Subject' => $snsSubject,
      'MessageStructure' => 'json',
    );
  
  
    $result = $client->publish($snsData);
    div_print($result);
    return $result;
}

function store_body($eventId, $body)
{
    $client = DynamoDbClient::factory(array('region' => 'us-west-2'));
    $bodyId = UUID::v4();

    $result = $client->putItem(array(
      'TableName' => 'bodies',
      'Item' => array(
          'id'      => array('s' => $bodyId),
          'eventId'    => array('s' => $time),
          'body' => array('S' => $body)
      )
    ));

    div_print($result);

    return $bodyId;
}

function store_subject($eventId, $subject)
{
    $insertStatement = $dbh->prepare("INSERT INTO subjects (id, eventId, subject) VALUES (?, ?, ?)");

    $subjectId = UUID::v4();
    $insertStatement->bindParam(1, $subjectId);
    $insertStatement->bindParam(2, $eventId);
    $insertStatement->bindParam(3, $value);
    $insertStatement->execute();

    return $subjectId;
}


print '<div id=\'email_output\'>';

if (!empty($_POST)) {
    if (isset($_POST['label'])) {
        if (isset($_POST['subject'])) {
            $eventId = UUID::v4();
            print 'do stuff here';
            $label = $_POST['label'];
            $subject = $_POST['subject'];
            $body = '';

            if (isset($_POST['body'])) {
                $body = $_POST['body'];
            } else {
                $body = 'no text';
            }
            $subjectId = store_subject($eventId, $subject);
            $bodyId = store_body($eventId, $body);
            submit_sns($eventId, $label, $subjectId, $bodyId)
        } else {
            print 'Cannot send email without subject.';
        };
    } else {
        print 'Cannot send email without recipient.';
    };
} else {
    print 'No POST data was found, email cannot be sent.';
};
print '</div>';
