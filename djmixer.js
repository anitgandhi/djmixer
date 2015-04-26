$( document ).ready(function(){
	$('.button-collapse').sideNav({
		menuWidth: 270, // Default is 240
		closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
		}
	);

	$('#splashscreen').delay(500).fadeOut('slow');
});

function incVal(id)
{
	$('#' + id).html(parseInt($('#' + id).html(), 10)+1)
}

function decVal(id)
{
	$('#' + id).html(parseInt($('#' + id).html(), 10)-1)
}