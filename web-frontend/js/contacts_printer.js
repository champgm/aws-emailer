function printContacts(json) {
    console.log (json);
    $("#contact-btn").empty();

    var contentToInsert = '';
    $.each(json, function(i, contact) {
        var btn = '<button class="btn btn-toggle" name="recipient-btn">'
                    + '<input type="checkbox" name="label" value="' + contact.toLowerCase() + '">'
                    + '<span>' + contact + '</span>'
                + '</button>';
        contentToInsert += btn;
    });

    $("#contact-btn").append(contentToInsert);
}
