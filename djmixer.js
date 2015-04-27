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
	if (sessionStorage.getItem("queue") === null)
	{
		sessionStorage.setItem("queue", "");
	}
});

function updateVal(id, element, operation)
{
	var score = $('#' + id);
	var flag = 0;

	// parse id to get the queue number to update its score
	var queueNum = id.split("-").pop();
	var queue = JSON.parse(sessionStorage["queue"]);

	// only change the value if it is allowed to be changed
	if (score.data('voted') == 'no')
	{
		// if increment operation
		if (operation == 'inc')
		{
			score.html(parseInt(score.html(), 10)+1);
			queue[queueNum].score += 1;
		}

		// if decrement operation
		else if (operation == 'dec')
		{
			score.html(parseInt(score.html(), 10)-1);
			queue[queueNum].score -= 1;
		}

		// if score goes below -5, then remove from queue and call loadQueue
		if (parseInt(score.html(), 10) < -5)
		{
			queue.splice(queueNum, 1);
			flag = 1;
		}

		// update local storage score
		sessionStorage["queue"] = JSON.stringify(queue);

		// don't allow voting on that item again
		score.data('voted', 'yes');
		element.onclick = function(){return false;};

		// if we removed the queue item because of score, call loadQueue
		if (flag == 1)
		{
			loadQueue();
		}
	}
}

function addToQueue(element, songTitle, artistTitle, albumTitle, albumNum)
{
	$(element).addClass('mdi-navigation-check').removeClass('mdi-content-add');
	element.onclick = function(){return false;};

	var url = "albums/" + albumNum + ".jpg";

	var temp = sessionStorage["queue"];
	var queue;

	// if it's empty, manually make queue an empty array
	if (temp.length == 0)
		queue = [];
	else
		queue = JSON.parse(temp);

	var randomScore = Math.floor(Math.random() * 11) - 5;

	// save to the local queue object
	queue.push( { title: songTitle,
				  artist: artistTitle,
				  album: albumTitle,
				  file: url,
				  score: randomScore }
			  );

	// save to local storage
	sessionStorage["queue"] = JSON.stringify(queue);

	// toast that it's been added
	Materialize.toast('"' + songTitle + '"' + ' has been added!', 2500); // 4000 is the duration of the toast
}

function loadQueue()
{
	// get items from sessionStorage
	var temp = sessionStorage["queue"];

	var container = $('.collection');

	// always clear the container first
	container.html('');

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

	// sort the queue
	function compare(a,b) {
		if (a.score > b.score)
			return -1;
		if (a.score < b.score)
			return 1;
		return 0;
	}
	queue.sort(compare);

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

function loadHost()
{
	// get items from sessionStorage
	var temp = sessionStorage["queue"];

	// if it's empty, tell the user
	if (temp.length == 0)
	{
		$('#curr_song').html('Nothing in the queue.');
		$('#next_song').html('Nothing in the queue.');
		return;
	}

	var queue = JSON.parse(temp);

	var curr = queue[0];
	var next = queue[1];

	// if there's at least 1
	if (queue.length >= 1)
	{
		$('#curr_song').html(curr.title);
		$('#curr_artist').html(curr.arist);
		$('#curr_album').html(curr.album);
		$('#curr_album_file').attr('src', curr.file);

		// clear the next entry
		$('#next_song').html('');
		$('#next_artist').html('');
		$('#next_album').html('');
		$('#next_album_file').attr('src', '');
	}

	// if we know there's at least one more
	if (queue.length >= 2)	
	{
		$('#next_song').html(next.title);
		$('#next_artist').html(next.arist);
		$('#next_album').html(next.album);
		$('#next_album_file').attr('src', next.file);
	}
}

function hostNext()
{
	// actually remove from local storage
	// get items from sessionStorage
	var temp = sessionStorage["queue"];

	// if it's empty, there's nothing to do
	if (temp.length == 0)
	{
		return;
	}

	var queue = JSON.parse(temp);

	// remove the first entry by shifting everything up
	queue.shift();

	// save to sessionsStorage
	sessionStorage["queue"] = JSON.stringify(queue);

	// once we've updated local storage, call loadHost to update the page
	loadHost();
}