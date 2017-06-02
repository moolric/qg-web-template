define([
    'jquery'
], function(
    $
) {
    var get = function get(path,params,method) {

	    var object;
        
	    if (method == null) {
            method = 'GET';
        }

	    $.ajaxSetup({
	        async: false,
	        cache: false,
	        type : method,
	        dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            accepts: 'json'
	    });
        
	    var url = path;
	    //console.log(url);
	    
	    $.ajax({
	        url : url,
	        data : params,
	        success : function(data) {
		        object = data;
	        },
	        error : function(request,status,error) {
	        }
	    });
	    
	    if (object == '-1') {
	        alert('server error');
	    }
	    
	    return object;
	    
    };

    return get;

});


