@echo OFF

setlocal EnableDelayedExpansion

for /f "delims=" %%i in ('node -v 2^>nul') do set output=%%i

if "!output!" EQU "" (
    echo node is not installed
) else (
    if NOT exist ./server/node_modules (
        echo installing server node packages
        npm install --prefix ./server/ ./server/
    )
    if NOT exist ./frontEnd/node_modules (
        echo installing frontEnd node packages
        npm install --prefix ./frontEnd/ ./frontEnd/
    )
    cls
    ipconfig | findstr IPv4 > ipadd.txt

    echo Starting server
    echo To exit server press ctrl+c twice
    echo Warning: do not enter y at the propt or the server will not full shut down
    echo.
    for /F "tokens=14" %%i in (ipadd.txt) do ( 
    echo To connect to the game enter: http://%%i:8080/ into a web browser
    )
    del ipadd.txt /Q
    echo.
    node ./server/node_modules/pm2/bin/pm2 start ./server/server.js
    npx live-server .\frontEnd\ --no-browser
    node ./server/node_modules/pm2/bin/pm2 stop server
    node ./server/node_modules/pm2/bin/pm2 delete server
)