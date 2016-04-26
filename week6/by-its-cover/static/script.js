$( document ).ready(function() {

    $.get('/rec').done(function(data) {

    	console.log(data);
    });

    console.log( "ready!" );
});

