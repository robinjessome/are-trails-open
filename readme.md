# Trails...are they open!?

Just a little Next.js practice, leveraging an existing API endpoint from [trailstatusapp.com](https://trailstatusapp.com/) // [jschr/trail-status-app](https://github.com/jschr/trail-status-app) for [The Hydrocut](https://www.thehydrocut.ca/) mountain biking trails, in Kitchener, Ontario, but should work for any system using the TrailStatus App.

## .env variables
- `TRAILSTATUS_API_ID` - trail id for trailstatusapp endpoint

## next.config variables
- `trailName` - for the trail name, obviously.




# NOTES(things I had to troubleshoot):
# if you add assets and are referencing them in manifest.json or html, /public is the root folder so instead of "public/img/icon.png", "img/icon.png" should be used or "/img/icon.png" in index.js