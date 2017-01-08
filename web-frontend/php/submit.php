<?php
include 'uuid.php';
use Aws\Sns\SnsClient;
use Aws\DynamoDb\DynamoDbClient;

function div_printr($message)
{
    print '<div>';
    print_r($message);
    print '</div>';
}

function div_print($message)
{
    print '<div>';
    print($message);
    print '</div>';
}

function submit_sns($eventId, $label, $subjectId, $bodyId)
{
    $client = SnsClient::factory(array('region' => 'us-west-2'));

    #oh my god this is ridiculous
    $actualMessageArray = array(
      'eventId' => $eventId,
      'label' => $label,
      'subjectId' => $subjectId,
      'bodyId' => $bodyId,
    );

    $snsMessageArray = array(
      'default' => json_encode($actualMessageArray)
    );

    $snsSubject = "Email Event with ID: $eventId";
    $snsMessage = json_encode($snsMessageArray);
    $snsData = array(
      'TopicArn' => getenv('SNS_ARN'),
      'Message' => $snsMessage,
      'Subject' => $snsSubject,
      'MessageStructure' => 'json',
    );


    $result = $client->publish($snsData);
    return $result;
}

function store_body($eventId, $body)
{
    $client = DynamoDbClient::factory(array('region' => 'us-west-2'));
    $bodyId = UUID::v4();

    $item_array = array(
      'TableName' => 'bodies',
      'Item' => array(
          'id'      => array('S' => $bodyId),
          'eventId'    => array('S' => $eventId),
          'body'   => array('S' => $body)
      )
    );

    $result = $client->putItem($item_array);
    return $bodyId;
}

function store_subject($eventId, $subject, $dbh)
{
    $insertStatement = $dbh->prepare("INSERT INTO subjects (id, eventId, subject) VALUES (?, ?, ?)");

    $subjectId = UUID::v4();
    $insertStatement->bindParam(1, $subjectId);
    $insertStatement->bindParam(2, $eventId);
    $insertStatement->bindParam(3, $subject);
    $insertStatement->execute();

    return $subjectId;
}


print '<div id=\'email_output\'>';

if (!empty($_POST)) {
    if (isset($_POST['label'])) {
        if (isset($_POST['subject'])) {
            require '../vendor/autoload.php';
            include 'prepareDatabaseConnection.php';

            $eventId = UUID::v4();
            $label = $_POST['label'];
            $subject = $_POST['subject'];
            $body = '     ';
            if (!empty($_POST['body'])) {
                $body = $_POST['body'];
            }

            div_print("Label: ".$label);
            div_print("Subject: ".$subject);
            div_print("Body: ".$body);

            div_print("Sending the subject...");
            $subjectId = store_subject($eventId, $subject, $dbh);
            div_print("Sending the body...");
            $bodyId = store_body($eventId, $body);
            div_print("Submitting SNS...");
            submit_sns($eventId, $label, $subjectId, $bodyId);
            div_print("Done.");
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
