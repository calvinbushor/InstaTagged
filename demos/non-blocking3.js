
function foo() {
    console.log('foo');
}

function someServiceCall(callback) {
    setTimeout(function() {
    	// "Respnse" was returned to us
    	callback(null, 'Response');
    }, 3000);
}

function baz() {
    console.log('baz');
}

function handleResponse(err, response) {
	if ( err ) {
		console.log(err);
		return;
	}

	var msg = [];
	msg.push('Handling the [');
	msg.push(response);
	msg.push('].');

	console.log(msg.join(''));
}

foo();
someServiceCall(handleResponse);
baz();
