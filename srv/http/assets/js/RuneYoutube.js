var youtube_delaytimer;
var youtube_lastsearch;

function youtube_getVideo(data)
{
	var playlistname = "https://www.youtube.com/watch?v=" + $(data).attr('id');
	if (playlistname != null) {
		var encstream = encodeURI(playlistname);  //url encode
		encstream = encodeURIComponent(encstream); //encodes also ? & ... chars
		$(data).fadeTo(0.5,0.5);
		$(data).addClass("active");
		renderMSG( ([{'title': 'YouTube', 'text': 'Fetching video...', 'icon': 'fa fa-cog fa-spin', 'delay': 5000 }]) );
		$.get("youtube.php?url=" + encstream, function( data ) {
			renderMSG( ([{'title': 'Added to queue', 'text': 'YouTube video', 'icon': 'fa fa-check', 'delay': 3000 }]) );
		});
	}
}
function youtube_getPlaylist(data)
{
	var playlistname = "https://www.youtube.com/playlist?list=" + $(data).attr('id');
	if (playlistname != null) {
		var encstream = encodeURI(playlistname);  //url encode
		encstream = encodeURIComponent(encstream); //encodes also ? & ... chars
		$(data).fadeTo(0.5,0.5);
		$(data).addClass("active");
		renderMSG( ([{'title': 'YouTube', 'text': 'Requesting playlist...', 'icon': 'fa fa-cog fa-spin', 'delay': 3000 }]) );
		$.get("youtube.php?url=" + encstream, function( data ) {
			renderMSG( ([{'title': 'Added to queue', 'text': 'Downloading playlist...', 'icon': 'fa fa-check', 'delay': 3000 }]) );
		});
	}
}
function youtube_loadPage(page)
{
	if (page != null) {
		var queryUrl = "http://jackdye.co.uk/youtube/search.php?term=" + youtube_lastsearch + "&page=" + page;
		$.getJSON(queryUrl, function( data ) {
			var i = 0;
			var content = [];
			for (i = 0; i < data.items.length; i++) {
				var kind = data.items[i].id.kind;
				var title = data.items[i].snippet.title;
				var searchImage = data.items[i].snippet.thumbnails.default.url;
				if(kind == "youtube#video")
					content.push('<li id="'+data.items[i].id.videoId+'" onclick="youtube_getVideo(this)"><img src="' + searchImage + '"><span class="sn">' +title + '</span></li>');
				else if(kind == "youtube#playlist")
					content.push('<li id="'+data.items[i].id.playlistId+'" onclick="youtube_getPlaylist(this)"><img src="' + searchImage + '"><span class="sn"><i class="fa fa-file-text-o"></i> ' +title + '</span></li>');
				else if(kind == "youtube#channel")
					content.push('<li id="'+data.items[i].id.channelId+'" onclick="youtube_getChannel(this)"><img src="' + searchImage + '"><span class="sn"><i class="fa fa-user"></i> ' +title + '</span></li>');
				};
				if(data.prevPageToken)
					content.push('<a href="#" onclick="youtube_loadPage(\''+ data.prevPageToken +'\')"><i class="fa fa-arrow-left"></i> Prev page</a>');
				if(data.nextPageToken)
					content.push(' <a href="#" onclick="youtube_loadPage(\''+ data.nextPageToken +'\')">Next page <i class="fa fa-arrow-right"></i> </a>');
				
			$("#pl-video-searchresults").html(content.join(""));
		});
	}
}
function youtube_getChannel(data)
{
	var channel = $(data).attr('id');
	if (channel != null) {
		var queryUrl = "http://jackdye.co.uk/youtube/channel.php?term=" + encodeURI(channel);
		$.getJSON(queryUrl, function( data ) {
			var i = 0;
			var content = [];
			for (i = 0; i < data.items.length; i++) {
				var kind = data.items[i].id.kind;
				var title = data.items[i].snippet.title;
				var searchImage = data.items[i].snippet.thumbnails.default.url;
				if(kind == "youtube#video")
					content.push('<li id="'+data.items[i].id.videoId+'" onclick="youtube_getVideo(this)"><img src="' + searchImage + '"><span class="sn">' +title + '</span></li>');
				else if(kind == "youtube#playlist")
					content.push('<li id="'+data.items[i].id.playlistId+'" onclick="youtube_getPlaylist(this)"><img src="' + searchImage + '"><span class="sn"><i class="fa fa-file-text-o"></i> ' +title + '</span></li>');
				else if(kind == "youtube#channel")
					content.push('<li id="'+data.items[i].id.channelId+'" onclick="youtube_getChannel(this)"><img src="' + searchImage + '"><span class="sn"><i class="fa fa-user"></i> ' +title + '</span></li>');
				};
			$("#pl-video-searchresults").html(content.join(""));
		});
	}
}

if ($('#section-index').length) {

// ====================================================================================================
// PLAYBACK SECTION
// ====================================================================================================
	
    jQuery(document).ready(function(){
 //RUNE_YOUTUBE_MOD
        // save youtube to playlist
        $('#modal-pl-youtube-btn').click(function(){
            var playlistname = $('#pl-video-url').val();
            if (playlistname != null) {
             var encstream = encodeURI(playlistname);  //url encode
             encstream = encodeURIComponent(encstream); //encodes also ? & ... chars
            if(encstream.indexOf("playlist") !== -1)
            {
                renderMSG( ([{'title': 'YouTube', 'text': 'Requesting playlist...', 'icon': 'fa fa-cog fa-spin', 'delay': 3000 }]) );
            }
            else
            {
                renderMSG( ([{'title': 'YouTube', 'text': 'Fetching video...', 'icon': 'fa fa-cog fa-spin', 'delay': 5000 }]) );
            }
             $.get("youtube.php?url=" + encstream, function( data ) {
               if(data.indexOf("playlist") !== -1)
               {
                   renderMSG( ([{'title': 'YouTube', 'text': 'Downloading playlist...', 'icon': 'fa fa-check', 'delay': 6000 }]) );
               }
               else
               {
                   renderMSG( ([{'title': 'Added to queue', 'text': 'YouTube video', 'icon': 'fa fa-check', 'delay': 3000 }]) );
               }
            });
            }
        });
        //$("#pl-video-url").keyup(function(event) {
        //if (event.keyCode === 13) {
        //}});
        $("#pl-video-url").on('change keyup paste', function() {
            var searchTerm = $('#pl-video-url').val();
			if(searchTerm == youtube_lastsearch)
				return;
			youtube_lastsearch = searchTerm;
            if (searchTerm != null) {
				clearTimeout(youtube_delaytimer);
				var youtubeExp = /^(https:\/\/|http:\/\/|)(www\.|m\.|)(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/g;
				var playListexp = /^(https:\/\/|http:\/\/|)(www\.|m\.|)(youtube\.com\/playlist\?list=)([\w-]+)/g;
				var match = youtubeExp.exec(searchTerm);
				if(match != null)
				{
					var ytthumb = 'https://img.youtube.com/vi/' + match[4] +'/1.jpg'
					$("#pl-video-searchresults").html('<li id="'+match[4]+'" onclick="youtube_getVideo(this)"><img src="' + ytthumb + '"><span class="sn">Pasted Video</span></li>');
					return;
				}
				var match = playListexp.exec(searchTerm);
				if(match != null)
				{
					var ytthumb = 'https://img.youtube.com/pl/' + match[4] +'/1.jpg'
					$("#pl-video-searchresults").html('<li id="'+match[4]+'" onclick="youtube_getPlaylist(this)"><img src="' + ytthumb + '"><span class="sn">Pasted Playlist</span></li>');
					return;
				}
				
				$("#pl-video-thumb").attr("src", "");
				youtube_delaytimer = setTimeout(function() {
					var queryUrl = "http://jackdye.co.uk/youtube/search.php?term=" + encodeURI(searchTerm);
					$.getJSON(queryUrl, function( data ) {
						var i = 0;
						var content = [];
						for (i = 0; i < data.items.length; i++) {
							var kind = data.items[i].id.kind;
							var title = data.items[i].snippet.title;
							var searchImage = data.items[i].snippet.thumbnails.default.url;
							if(kind == "youtube#video")
								content.push('<li id="'+data.items[i].id.videoId+'" onclick="youtube_getVideo(this)"><img src="' + searchImage + '"><span class="sn">' +title + '</span></li>');
							else if(kind == "youtube#playlist")
								content.push('<li id="'+data.items[i].id.playlistId+'" onclick="youtube_getPlaylist(this)"><img src="' + searchImage + '"><span class="sn"><i class="fa fa-file-text-o"></i> ' +title + '</span></li>');
							else if(kind == "youtube#channel")
								content.push('<li id="'+data.items[i].id.channelId+'" onclick="youtube_getChannel(this)"><img src="' + searchImage + '"><span class="sn"><i class="fa fa-user"></i> ' +title + '</span></li>');
							};
						if(data.prevPageToken)
							content.push('<a href="#" onclick="youtube_loadPage(\''+ data.prevPageToken +'\')"><i class="fa fa-arrow-left"></i> Prev page</a>');
						if(data.nextPageToken)
							content.push(' <a href="#" onclick="youtube_loadPage(\''+ data.nextPageToken +'\')">Next page <i class="fa fa-arrow-right"></i> </a>');
						$("#pl-video-searchresults").html(content.join(""));
					});
				}, 500); // Will do the ajax stuff after 1000 ms, or 1 s
            }
        });
});
//END_RUNE_YOUTUBE_MOD
}