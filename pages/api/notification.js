import { kv } from '@vercel/kv';
const webPush = require('web-push')
webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
)

async function addSubscription(subscription) {
  await kv.sadd('subs', subscription);
  await webPush.sendNotification(
    subscription,
    JSON.stringify({ title: 'Notifications enabled!', message: 'You are now subscribed to notifications for the Hydrocut trails status' })
  )
}

const Notification = (req, res) => {
  if (req.method == 'POST') {
    const { subscription } = req.body
    addSubscription(subscription)
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

export default Notification