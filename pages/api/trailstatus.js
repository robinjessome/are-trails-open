import { kv } from '@vercel/kv';
import { setRequestMeta } from 'next/dist/server/request-meta';
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
    const subscriptions = await kv.smembers('subs');
    for (let i = 0; i < subscriptions.length; i++) {
        var sub = subscriptions[i];
        await webPush.sendNotification(
            sub,
            JSON.stringify({ title: notificationTitleString, message: trailStatus.message, icon: trailStatus.imageUrl })
        )
            .catch(err => {
                 console.error(err)
                 if(err.statusCode == 410){
                    kv.srem('subs', sub).then({})
                 }
                })
    }
}
async function isUpdated(trailStatus) {
    let lastUpdated = trailStatus.updatedAt;
    let lastUpdatedKV = await readKVvar('lastUpdated')
    if (lastUpdatedKV != lastUpdated) {
        await setKVvar('lastUpdated', lastUpdated);
        await setKVvar('lastStatus', trailStatus);
        await sendNotifications(trailStatus);
        console.log("notifications sent");
    } else {
        console.log("trailstatus has not been updated");
    }
}

const TrailStatus = (req, res) => {
    if (req.method == 'POST' && req.headers.trailstatusauth == process.env.TRAILSTATUS_API_PASSWORD) {
        console.log("logic started");
        isUpdated(req.body)
            .then(() => {
                res.statusCode = 200
                res.end()
            })
            .catch(err => {
                if ('statusCode' in err) {
                    res.writeHead(err.statusCode, err.headers).end(err.body)
                } else {
                    console.error(err)
                    res.statusCode = 500
                    res.end()
                }
            })
    } else {
        res.statusCode = 405
        res.end()
    }

}

export default TrailStatus