if test -e dist/bundle.js
    scp dist/bundle.js app/index.html app/genify.png tkel.ly:/var/www/genify
else
    echo Build first, then deploy.
end
