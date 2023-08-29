import { kv } from '@vercel/kv';
const webPush = require('web-push')
webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
)


async function setKVvar(keyname, value) {
    await kv.set(keyname, value)
        .catch(error => { console.log("error in setting kv value: ", error); });
    console.log("set ", keyname, " to ", value);
}
async function readKVvar(keyname) {
    let kvvalue = await kv.get(keyname)
        .catch(error => { console.log("error in getting kv value: ", error); });
    console.log("found ", keyname, "'s value to be ", kvvalue);
    return kvvalue;
}

async function sendNotifications(trailStatus) {
    console.log("sending notifications");
    const notificationTitleString = 'The Hydrocut is ' + trailStatus.status;
    const list = await kv.lrange('subs', 0, -1);
    for (let i = 0; i < list.length; i++) {
        var sub = list[i];
        webPush
            .sendNotification(
                sub,
                JSON.stringify({ title: notificationTitleString, message: trailStatus.message, icon: trailStatus.imageUrl })
            )
            .catch(err => {
                console.error(err)
            })
    }
}
async function isUpdated(trailStatus) {
    // check for api password in request header
    let lastUpdated = trailStatus.updatedAt;
    let lastUpdatedKV = await readKVvar('lastUpdated')
    console.log(lastUpdatedKV);
    if (lastUpdatedKV != lastUpdated) {
        await setKVvar('lastUpdated', lastUpdated);
        await setKVvar('lastStatus', trailStatus);
        await sendNotifications(trailStatus);
    }
}
const TrailStatus = (req, res) => {
    if (req.method == 'POST' && req.headers.trailstatusauth == process.env.TRAILSTATUS_API_PASSWORD) {
        // TODO: take input from JSON request(trailstatus api fetch) and store in in a kv value
        isUpdated(req.body).
            catch(err => {
                if ('statusCode' in err) {
                    res.writeHead(err.statusCode, err.headers).end(err.body)
                } else {
                    console.error(err)
                    res.statusCode = 500
                    res.end()
                }
            })
        res.statusCode = 200
        res.end()
    } else {
        res.statusCode = 405
        res.end()
    }

}

export default TrailStatus