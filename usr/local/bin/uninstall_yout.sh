
#!/bin/bash

# main reference
alias=yout

### template - import default variables, functions
. /srv/http/addonstitle.sh
. /srv/http/addonsedit.sh

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

echo -e "$bar Removing youtube javascript.."
rm -v /srv/http/assets/js/RuneYoutube.js

echo -e "$bar Removing youtube directory.."
rm -r /mnt/MPD/LocalStorage/Youtube

echo -e "$bar Reverting Patched files..."

[[ -e /srv/http/app/templates/playback.php.backup ]] && backup=.backup
files="
/srv/http/app/templates/playback.php$backup
/srv/http/app/templates/footer.php$backup
"
restorefile $file

# end custom script --------------------------------------------------------------------------------<<<

### template - function: remove version from database, finish message
uninstallfinish $@
