$( document ).ready(function(){
	$('.button-collapse').sideNav({
		menuWidth: 270, // Default is 240
		closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
		}
	);

	$('#splashscreen').delay(500).fadeOut('slow');
	$('#nearby-spinner').delay(500).fadeOut('slow', function(){
		$('#nearby-cards').fadeIn('slow');
	});

	// initialize local storage queue if it's not present
	if (localStorage.getItem("queue") === null)
	{
		localStorage.setItem("queue", "");
	}
});

function updateVal(id, element, operation)
{
	var score = $('#' + id);

	// only change the value if it is allowed to be changed
	if (score.data('voted') == 'no')
	{
		if (operation == 'inc')
			score.html(parseInt($('#' + id).html(), 10)+1);
		else if (operation == 'dec')
			score.html(parseInt($('#' + id).html(), 10)-1);
		score.data('voted', 'yes');
		element.onclick = function(){return false;};
	}
	
}

function addToQueue(element, songTitle, artistTitle, albumTitle, albumNum)
{
	$(element).addClass('mdi-navigation-check').removeClass('mdi-content-add');
	element.onclick = function(){return false;};

	var url = "albums/" + albumNum + ".jpg";

	var temp = localStorage["queue"];
	var queue;

	// if it's empty, manually make queue an empty array
	if (temp.length == 0)
		queue = [];
	else
		queue = JSON.parse(temp);

	// save to the local queue object
	queue.push( { title: songTitle,
				  album: albumTitle,
				  artist: artistTitle,
				  file: url,
				  score: 0 }
			  );

	// save to local storage
	localStorage["queue"] = JSON.stringify(queue);

	// toast that it's been added
	Materialize.toast('"' + songTitle + '"' + ' has been added!', 2500); // 4000 is the duration of the toast
}


function loadQueue()
{
	// get items from localstorage
	var temp = localStorage["queue"];

	var container = $('.collection');

	// if it's empty, manually make queue an empty array
	if (temp.length == 0)
	{
		container.html('<p>There are no items in the queue :(</p>');
		return;
	}
	else
	{
		var queue = JSON.parse(temp);
	}

	$.each(queue, function(index, el)
	{
		var item = '<li class="collection-item avatar"><img src="' + el.file + '" alt="" class="circle">';

		item += '<span class="title">' + el.title + '</span>';
		item += '<p>' + el.artist + '</p><p><i>' + el.album + '</i></p>';
		
		item += '<div class="secondary-content blue-text">';

		item += '<i class="green-text mdi-hardware-keyboard-arrow-up small-med" onclick="updateVal(\'queue-' + index + '\', this, \'inc\')"></i>';

		item += '<p class="score" data-voted=\'no\' id="queue-' + index + '">' + el.score + '</p>';

		item += '<i class="red-text mdi-hardware-keyboard-arrow-down small-med" onclick="updateVal(\'queue-' + index + '\', this, \'dec\')"></i>';

		item += '</div></a></li>';

		container.append(item);
	});
}