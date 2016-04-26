$( document ).ready(function() {

    $.get('/search').done(function(data) {

    	console.log(data);
    });
    // $('#show-books').on('click', function(e) {
    // 	$('.cover-frame').html(data);
    // })
    console.log( "ready!" );
});

