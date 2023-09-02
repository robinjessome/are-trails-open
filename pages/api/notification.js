const webPush = require('web-push')

import { kv } from '@vercel/kv';

async function addKVList(keyName, value) {
  // If endpoint is the same as last element added to the list, change key values instead of adding new ones
  try {
    await kv.lpush(keyName, value);
  } catch (error) { 
    console.log("error in adding to kv list: ", error);
  }
}
async function readKVList(keyName, startIndex, endIndex){
  try {
    const getListExample = await kv.lrange(keyName, startIndex, endIndex);
    console.log(getListExample);
  } catch(error){
    console.log("error in reading kv list: ", error)
  }
}
async function clearKVList(){
  try{
    await kv.del('subs');
  } catch(error) {
    console.log("error in deleting kv list: ", error);
  }
}
webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
)

const Notification = (req, res) => {
  if (req.method == 'POST') {
    const { subscription } = req.body
    //clearKVList();
    addKVList('subs', subscription).then(() => {
    webPush
      .sendNotification(
        subscription,
        JSON.stringify({ title: 'Notifications enabled!', message: 'You are now subscribed to web push notifications for the Hydrocut trails status' })
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
    })
  } else {
    res.statusCode = 405
    res.end()
  }
  // console.log(readKVList('subs', 0, 2));
}

export default Notification