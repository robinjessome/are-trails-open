const webPush = require('web-push')

import { kv } from '@vercel/kv';
 
async function exampleCommands() {
  try {
    await kv.set('setExample', 'abc123', { ex: 100, nx: true });
  } catch (error) {
    // Handle errors
  }
}
 
async function exampleCommands2() {
  try {
    const getExample = await kv.get('setExample');
    console.log(getExample);
  } catch (error) {
    // Handle errors
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
  exampleCommands();
  exampleCommands2();
}

export default Notification