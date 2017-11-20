
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
        $("#pl-video-url").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#modal-pl-youtube-btn").click();
        }
});
//END_RUNE_YOUTUBE_MOD
});
}