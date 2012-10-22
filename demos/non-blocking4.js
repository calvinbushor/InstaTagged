
function one(callback) {
	var phrase;

    setTimeout(function() {
    	phrase = 'The';
    	callback(null, phrase);
    }, 3000);
}

function two(value, callback) {
    var phrase = value + ' candy';
    callback(null, phrase);
}

function three(value, callback) {
    var phrase = value + ' man';    
    callback(null, phrase);
}

function four(value, callback) {
    var phrase = value + ' can!';    
    callback(null, phrase);
}

one(function(err1, response1) {
	two(response1, function(err2, response2) {
		three(response2, function(err3, response3) {
			four(response3, function(err4, response4) {
				console.log(response4);
			});
		});
	});
});

