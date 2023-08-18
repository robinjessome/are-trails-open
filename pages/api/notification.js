const webPush = require('web-push')

import { kv } from '@vercel/kv';

async function setKV(keyName, value) {
  try {
    await kv.set(keyName, value, { ex: 100, nx: true });
  } catch (error) {
    // Handle errors
  }
}

async function readKV(keyName) {
  try {
    const getExample = await kv.get(keyName);
    console.log(getExample);
  } catch (error) {
    // Handle errors
  }
}
async function addKVList(keyName, value) {
  // If endpoint is the same as last element added to the list, change key values instead of adding new ones
  try {
    await kv.lpush(keyName, value);
  } catch (error) { }
}
async function readKVList(keyName, startIndex, endIndex){
  try {
    const getListExample = await kv.lrange(keyName, startIndex, endIndex);
    console.log(getListExample);
  } catch(error){}
}
async function clearKVList(){
    await kv.del('subEndpoints');
    await kv.del('subAuthKeys');
    await kv.del('subP256dhKeys');
}
webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
)

const Notification = (req, res) => {
  if (req.method == 'POST') {
    const { subscription } = req.body
    console.log(req.body);
    console.log(req.body.subscription.endpoint);
    console.log(req.body.subscription.keys.auth);
    console.log(req.body.subscription.keys.p256dh);
    addKVList('subEndpoints', req.body.subscription.endpoint);
    addKVList('subAuthKeys', req.body.subscription.keys.auth);
    addKVList('subP256dhKeys', req.body.subscription.keys.p256dh);
    // clearKVList();
    webPush
      .sendNotification(
        subscription,
        JSON.stringify({ title: 'Hello Web Push', message: 'Your web push notification is here!' })
      )
      .then(response => {
        res.writeHead(response.statusCode, response.headers).end(response.body)
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
  console.log(readKVList('subEndpoints', 0, 10));
  console.log(readKVList('subAuthKeys', 0, 10));
  console.log(readKVList('subP256dhKeys', 0, 10));
}

export default Notification