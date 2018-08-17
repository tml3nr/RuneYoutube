#!/bin/bash

# main reference
alias=RuneYoutube

### template - import default variables, functions
. /srv/http/addonstitle.sh

### template - function: start message, installed check
uninstallstart $@

# start custom script ------------------------------------------------------------------------------>>>

echo -e "$bar Remove youtube-dl and atomicparsley..."
pacman -R --noconfirm youtube-dl atomicparsley

echo -e "$bar Remove web files..."
rm -v /srv/http/youtube.php

echo -e "$bar Remove shell scripts..."
rm -v /usr/local/bin/tube
rm -v /usr/local/bin/tubeplaylist

echo -e "$bar Reverting Patched files..."
file=/srv/http/app/templates/playback.php
echo $file
sed -i $'/<!-- RUNE_YOUTUBE_MOD -->/,/<!-- END_RUNE_YOUTUBE_MOD -->/ d' $file
file=/srv/http/app/templates/header.php
echo $file
sed -i $'/<!-- RUNE_YOUTUBE_MOD -->/,/<!-- END_RUNE_YOUTUBE_MOD -->/ d' $file

# for RuneUI Enhancement
file=/srv/http/app/templates/playbackcustom.php
[[ -e $file ]] && sed -i '/id="pl-import-youtube"/ {s/^/<!--/; s/$/-->/}' $file

file=/srv/http/app/templates/footer.php
echo $file
sed -i -e '/RuneYoutube.js/ d' $file

echo -e "$bar Removing youtube javascript.."
rm -v /srv/http/assets/js/RuneYoutube.js

echo -e "$bar Removing youtube directory.."
rm -r /mnt/MPD/LocalStorage/Youtube
# end custom script --------------------------------------------------------------------------------<<<

### template - function: remove version from database, finish message
uninstallfinish $@
