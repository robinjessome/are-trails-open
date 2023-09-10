# Trails...are they open!?

Just a little Next.js practice, leveraging an existing API endpoint from [trailstatusapp.com](https://trailstatusapp.com/) // [jschr/trail-status-app](https://github.com/jschr/trail-status-app) for [The Hydrocut](https://www.thehydrocut.ca/) mountain biking trails, in Kitchener, Ontario, but should work for any system using the TrailStatus App.

## .env variables
- `TRAILSTATUS_API_ID` - trail id for trailstatusapp endpoint
- `TRAILSTATUS_API_PASSWORD` - set a password to access trailstatus api endpoint
Vapid web push details(if you do not already have keys, you can generate them here: {https://www.attheminute.com/vapid-key-generator})
- `WEB_PUSH_EMAIL` - email
- `NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY` - public key
- `WEB_PUSH_PRIVATE_KEY` - private key
Vercel kv details: get these from vercel storage page of your project
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_REST_API_TOKEN`
- `KV_REST_API_URL`
- `KV_URL`

## next.config variables
- `trailName` - for the trail name, obviously.
