$(document).ready(function(){
	if(window.location.href.indexOf("id_token") >= 0){
		var urlParams = new URLSearchParams(window.location.href.split("#")[1]);
		id_token = urlParams.get("id_token");
		getCredentials(id_token);
	}
	else if(window.location.href.indexOf("code") >= 0){ //
		var urlParams = new URLSearchParams(window.location.search);
		code = urlParams.get("code");
		requestbody = "grant_type=authorization_code&client_id=2c2hr79i86psrgolq7e5vd24vm&code=" + code + "&redirect_uri=https://s3-us-west-2.amazonaws.com/chatbotanniver/index.html";
		$.ajax({
			url:"https://chatbot2018.auth.us-west-2.amazoncognito.com/oauth2/token",
			method:"POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: requestbody,

			success:function(data){
				access_token = data['access_token'];
				id_token = data['id_token'];
				refresh_token = data['refresh_token'];
				getCredentials(id_token);
			}
		});
	}
	else{ // Not signed in
		window.location.href = "https://chatbot2018.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=2c2hr79i86psrgolq7e5vd24vm&redirect_uri=https://s3-us-west-2.amazonaws.com/chatbotanniver/index.html";
	}
});

function getCredentials(id_token){ // Use id_token to get access key, secret key and session token to generate apigClient
	// Set up AWS Javascript SDK: set the region where your identity pool exists
	AWS.config.region = 'us-west-2';
	// Exchange the token for credentials, using CognitoIdentityCredentials (internally through AWS STS)
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'us-west-2:109259bb-ead7-438e-889d-e819546066ef',
		Logins: {
			'cognito-idp.us-west-2.amazonaws.com/us-west-2_gJ992QUti': id_token
		}
	});
	AWS.config.credentials.get(function(){
		// Credentials will be available when this function is called.
		accessKeyId = AWS.config.credentials.accessKeyId;
		secretAccessKey = AWS.config.credentials.secretAccessKey;
		sessionToken = AWS.config.credentials.sessionToken;
		apigClient = apigClientFactory.newClient({ // Cannot use var here as that will create a local variable.
 			apiKey: 'evIibukcM37KXMYY2hCCc9kon2ivumYo6m5MEwIx',
            region: "us-west-2",
			accessKey: accessKeyId,
			secretKey: secretAccessKey,
			sessionToken: sessionToken
		});
	});
}