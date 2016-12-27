<?php

function submit_sns(){
$label = $_POST['label'];

}


print "<div id=\"email_output\">";

if(!empty($_POST)){
    if (isset($_POST['label'])) {
        if (isset($_POST['subject'])){
            print "do stuff here";
        }else{
            print "Cannot send email without subject.";
        };
    }else{
        print "Cannot send email without recipient.";
    };
}else{
    print "No POST data was found, email cannot be sent.";
};
print "</div>";
?>