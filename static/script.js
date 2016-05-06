$( document ).ready(function() {

    // $.get('/rec').done(function(data) {

    // 	console.log(data);
    // });

    console.log( "ready!" );




// $('#sidebar').affix({
//   offset: 
//   		{
//     top: $('header').height()
//   }
// }); 


$( window ).resize(function() {
    if ($(document).width() <= 991){ 
 		$("#sidebar-container").collapse('hide');
    }else{
    	$("#sidebar-container").collapse('show');
    }
});

    if ($(document).width() > 992){ 
 		$("#sidebar-container").collapse('show');
    }

$('.delete-btn').on('click', function(e) {
	e.preventDefault();
	var favoriteId = $(this).attr('data-favorite-id');
	var that = this;
	$.ajax({
		method: 'DELETE',
		url: '/my-list/' + favoriteId,
		success: function(){
			$(that).parent().parent().parent().remove();
		}
	});
});

});