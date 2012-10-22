
function foo() {
    console.log('foo');
}

function someServiceCall() {
    setTimeout(function() {
    	console.log('Response');
    }, 3000);
}

function baz() {
    console.log('baz');
}

foo();
someServiceCall();
baz();
