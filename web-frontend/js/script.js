//When DOM loaded we set focus
$(document).ready(function() {
	$("#form").each(function(){
	    this.reset();
	});
	// set focus to input field
	$("#form [name='subject']").focus();

	// if ($("#subject").val() == "") {
	// 	$("#text-clear").hide();
	// };

	$("#text-clear-subject").click(function(){
    	$("#subject").val('');
	});

	$("#text-clear-body").click(function(){
    	$("#body").val('');
	});

	$("#btnsubmit").click(function(){
		var form = document.getElementById("form");
		form.submit();
		form.reset();
		var name_btns = document.getElementsByName("recipient-btn");

		for(var i=0; i<name_btns.length; i++) {
			//window.alert(name_btns[i].className);
			name_btns[i].className = "btn btn-toggle";
		}


	//return false;
	});

});
