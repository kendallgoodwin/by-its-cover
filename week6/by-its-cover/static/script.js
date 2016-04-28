$( document ).ready(function() {

    $.get('/rec').done(function(data) {

    	console.log(data);
    });

    console.log( "ready!" );
});

$('#sidebar').affix({
  offset: {
    top: $('header').height()
  }
}); 

