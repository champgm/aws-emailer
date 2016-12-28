<?php
include 'uuid.php';

function submit_sns()
{

    $snsMessage = array(
    'eventId' => $eventId,
    'label' => $label,
    'subjectId' => $subjectId,
    'bodyId' => $bodyId
    );
  
    $factory = SnsClient::factory(array('region' => 'us-west-2'));
    $client = $factory->get('Sns');
  
  // $result = $client->createQueue(array('QueueName' => 'my-queue'));
  // $queueUrl = $result->get('QueueUrl');
  
  // echo 'SQS queue url: $queueUrl';
    $snsMessage = '{}';
    $snsArray = array(
    'TopicArn' => 'arn:aws:sns:us-west-2:637769611129:emailer_entrypoint',
    // 'TargetArn' => 'string',
    // Message is required
    'Message' => 'string',
    'Subject' => 'string',
    'MessageStructure' => 'string',
    'MessageAttributes' => array(
        // Associative array of custom 'String' key names
        'String' => array(
        // DataType is required
        'DataType' => 'string',
        'StringValue' => 'string',
        'BinaryValue' => 'string',
      ),
      // ... repeated
    ),
    );
  
  
    $client->sendMessage(array(
    'QueueUrl'    => $queueUrl,
    'MessageBody' => 'Hello World!',
    ));
};

function store_message($eventId)
{
    $insertStatement = $dbh->prepare("INSERT INTO subjects (id, eventId, subject) VALUES (?, ?, ?)");

    $subjectId = UUID::v4();
    $insertStatement->bindParam(1, $subjectId);
    $insertStatement->bindParam(2, $value);
    $insertStatement->bindParam(3, $value);
  
  // insert one row
    $name = 'one';
    $value = 1;
    $insertStatement->execute();

    return 
}

function store_subject()
{
    $statement = $dbh->prepare("INSERT INTO subjects (name, value) VALUES (:name, :value)");
    $statement->bindParam(':name', $name);
    $statement->bindParam(':value', $value);
}


print '<div id=\'email_output\'>';

if (!empty($_POST)) {
    if (isset($_POST['label'])) {
        if (isset($_POST['subject'])) {
            print 'do stuff here';
            $label = $_POST['label'];
            $subject = $_POST['subject'];
            $body = '';

            if (isset($_POST['body'])) {
                $body = $_POST['body'];
            } else {
                $body = 'no text';
            }
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
