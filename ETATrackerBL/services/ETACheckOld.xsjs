//**** Example for basic REQUEST RESPONSE handling
var paramName; 
var paramValue; 
var headerName; 
var headerValue; 
var contentType;

//Implementation of GET call
function handleGet() {
	// Retrieve data here and return results in JSON/other format 
	var d = new Date();
	
	$.response.status = $.net.http.OK;
	 
		 	  
	var conn = $.db.getConnection(); 
//	var ps = conn.prepareStatement(""); 
	
	var pc = conn.prepareCall("CALL \"c5208507trial.hanainstance.ETATracker.ETATrackerBL.procedures::checkOld\" (?,?)"); 
	
//	var d1 = d.toLocaleDateString();
//	d1 = d1.replace("/","");
//	d1 = d1.replace("/","");
	var d1 = d.getFullYear().toString()+(d.getMonth()+1).toString()+d.getDate().toString();
	
	
	pc.setString(1, d1.toLocaleString() );
	
    pc.execute(); 
	
    var rs = pc.getResultSet(); 
    var result;
    while(rs.next()){
    	result = rs.getString(1);
    }
    
    return {"myResult":" GET success", 
    		"resultsExist": result + " Mahesh"
    };
    	
}
//Implementation of POST call
function handlePost() {
	var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}
	// Extract body insert data to DB and return results in JSON/other format
	$.response.status = $.net.http.CREATED;
    return {"myResult":"POST success"};
}
// Check Content type headers and parameters
function validateInput() {
	var i; var j;
	// Check content-type is application/json
	contentType = $.request.contentType;
//	if ( contentType === null || contentType.startsWith("application/json") === false){
//		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
//		 $.response.setBody("Wrong content type request use application/json");
//		return false;
//	}
	// Extract parameters and process them 
	for (i = 0; i < $.request.parameters.length; ++i) {
	    paramName = $.request.parameters[i].name;
	    paramValue = $.request.parameters[i].value;
//      Add logic	    
	}
	// Extract headers and process them 
	for (j = 0; j < $.request.headers.length; ++j) {
	    headerName = $.request.headers[j].name;
	    headerValue = $.request.headers[j].value;
//      Add logic	    
	 }
	return true;
}
// Request process 
function processRequest(){
	if (validateInput()){
		try {
		    switch ( $.request.method ) {
		        //Handle your GET calls here
		        case $.net.http.GET:
		            $.response.setBody(JSON.stringify(handleGet()));
		            break;
		            //Handle your POST calls here
		        case $.net.http.POST:
		            $.response.setBody(JSON.stringify(handlePost()));
		            break; 
		        //Handle your other methods: PUT, DELETE
		        default:
		            $.response.status = $.net.http.METHOD_NOT_ALLOWED;
		            $.response.setBody("Wrong request method");		        
		            break;
		    }
		    $.response.contentType = "application/json";	    
		} catch (e) {
		    $.response.setBody("Failed to execute action: " + e.toString());
		}
	}
}
// Call request processing  
processRequest();
