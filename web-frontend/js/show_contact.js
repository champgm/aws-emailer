$(document).ready(function() {
    $.ajax({
        url: "/php/printLabelsList.php",
        method: "GET",
        dataType: "json",
        success: function(resp) {
            console.log(resp);
            printContacts(resp);
        },
        error: function() {

        }
    });
})