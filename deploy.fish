#!/usr/local/bin/fish

if test -e dist/index.html
    tree -ah ./dist
    # recursive, checksum, verbose, itemized, [h]uman bytes, stats3 too much, owner/group
    and rsync -rc -vih --info=all4,stats2 -og --chown=tk:docker --perms --chmod=D775,F664 ./dist/ tkel.ly:/opt/mail/docker-data/nginx/www/tkel.ly/public/genify/
    # -gupah = group,user,permissions,all (incl. hidden),human sizes
    and ssh tkel.ly tree -gupah /opt/mail/docker-data/nginx/www/tkel.ly/public/
else
    echo Build first, then deploy.
end
