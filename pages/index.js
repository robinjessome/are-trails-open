import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { IconCheck, IconX, IconBrandInstagram } from '@tabler/icons';

const base64ToUint8Array = base64 => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(b64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function HomePage({ trailStatusAPIId, trailName }) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [registration, setRegistration] = useState(null)
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      // run only in browser
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub)
            setIsSubscribed(true)
          }
        })
        setRegistration(reg)
      })
    }
    fetch('https://api.trailstatusapp.com/regions/status?id=' + trailStatusAPIId)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [trailStatusAPIId])

  const subscribeButtonOnClick = async event => {
    event.preventDefault()
    // Notification permissions managing
    if (Notification.permission === 'denied') {
      console.log("Notification permissions already denied so no request sent");
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(function (permission) {
        console.log("Permission", permission);
      });
      console.log("Notification permissions requested due to them being set to default settings(denied)");
    }
    if (Notification.permission === 'granted') {
      console.log("notification permissions set to granted so no request sent");
    }
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY)
    })
    // TODO: you should call your API to save subscription data on server in order to send web push notification from server
    await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ subscription: sub })
    })

    setSubscription(sub)
    setIsSubscribed(true)
    console.log('web push subscribed!')
    console.log(sub)
  }

  const unsubscribeButtonOnClick = async event => {
    event.preventDefault()
    await subscription.unsubscribe()
    // TODO: you should call your API to delete or invalidate subscription data on server
    setSubscription(null)
    setIsSubscribed(false)
    console.log('web push unsubscribed!')
  }

  const sendNotificationButtonOnClick = async event => {
    event.preventDefault()
    if (subscription == null) {
      console.error('web push not subscribed')
      return
    }

    await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription
      })
    })
  }

  let statusMessage, border, trails;

  const message = data?.message
  const updatedDate = new Date(data?.updatedAt);
  const postLink = data?.instagramPermalink;
  const username = data?.user.username;

  if (data?.status === 'open') {
    border = 'border-green-500';
    statusMessage = 'Yes, ' + trailName + ' is <strong>open</strong>!';
  } else {
    border = 'border-red-500';
    statusMessage = 'No, ' + trailName + ' is closed...';
  }

  if (isLoading) return null;

  if (!data) return <div className="mt-auto">...</div>

  return (
    <>
      <Head>
        <title>Is {trailName} open?</title>
      </Head>
      <div className="mt-auto text-slate-900 dark:text-slate-300 p-4 max-w-2xl">
        <div className="text-center">
          <Image src="/img/icons/logo.png" width="200" height="140" alt="" />
        </div>
        {!isLoading && (
          <>
            {statusMessage &&
              <h1 className="text-center text-5xl mt-12" dangerouslySetInnerHTML={{ __html: statusMessage }}></h1>
            }
            {data?.trails && (
              <div className="mt-6">
                <p className="text-center">

                  {data.trails?.map((trail) => {
                    console.log(trail);
                    let trailOpen = true;
                    let trailStatus = 'border-green-500 text-green-600 font-medium'
                    if (trail.status == 'closed') {
                      trailOpen = false;
                      trailStatus = 'border-slate-300 dark:border-slate-600 text-slate-500 opacity-50';
                    }
                    return (
                      <span
                        key={trail.id}
                        className={`inline-block mx-2 px-4 py-1 rounded border ${trailStatus}`}>
                        {trailOpen
                          ? <IconCheck className="w-4 inline-block mr-2 relative -top-[1px]" />
                          : <IconX className="w-4 inline-block mr-2 relative -top-[1px]" />
                        }
                        {trail.name}
                      </span>
                    );
                  }
                  )}
                </p>
              </div>
            )}
            <div className="text-center mt-8">
              {message &&
                <p className={`border text-lg mb-2 bg-white py-2 px-4 rounded dark:bg-slate-800 ${border}`}>{message}</p>
              }
              <div className="md:flex justify-between items-center mt-2">
                {updatedDate &&
                  <p className="text-xs text-slate-500">Last updated: <strong>{updatedDate.toLocaleString()}</strong></p>
                }
                {postLink &&
                  <a href={postLink} className="text-slate-500 hover:text-sky-600" target="_blank" rel="noreferrer">
                    <span>
                      <IconBrandInstagram className="w-6 mr-1 inline-block relative -top-[1px]" />
                      {username}
                    </span>
                  </a>
                }
              </div>
            </div>
          </>
        )}
      </div>
      <button onClick={subscribeButtonOnClick} disabled={isSubscribed}>
        Subscribe
      </button>
      <button onClick={unsubscribeButtonOnClick} disabled={!isSubscribed}>
        Unsubscribe
      </button>
      <button onClick={sendNotificationButtonOnClick} disabled={!isSubscribed}>
        Send Notification
      </button>
    </>
  )
}

export async function getStaticProps(context) {
  return {
    props: {
      trailName: process.env.trailName,
      trailStatusAPIId: process.env.TRAILSTATUS_API_ID
    },
  }
}

export default HomePage