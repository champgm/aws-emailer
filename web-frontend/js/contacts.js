$(document).ready(function() {

var contacts = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    wildcard: 'QUERY',
    url: '/php/retrieveLabels.php#QUERY',

    transport: function (opts, onSuccess, onError) {
            var url = opts.url.split("#")[0];
            var query = opts.url.split("#")[1];
            console.log (query)
            $.ajax({
                url: url,
                data: {'search': query},
                type: "POST",
                dataType: "json",
                success: function(response) {
                  console.log ("succeed!")
                  console.log(response)
                  onSuccess(response);
                },
                error: function (request, textStatus, errorThrown) {
                    console.log(request)
                    console.log(textStatus)
                    console.log(errorThrown)
                    onError(errorThrown);
                }
            })
    }
  }
});

    $('#contact .typeahead').typeahead(null, {
        displayKey: 'label',
        source: contacts
    });
});

