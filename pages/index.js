import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'

function HomePage({trailStatusAPIId, trailName}) {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('https://api.trailstatusapp.com/regions/status?id='+trailStatusAPIId)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [trailStatusAPIId])

  const message = data?.message
  const updatedAt = data?.updatedAt;
  const updatedDate = new Date(updatedAt);
  const postLink = data?.instagramPermalink;
  const username = data?.user.username;

  let statusMessage, border;
  if(data?.status === 'open') {
    border = 'border-green-500';
    statusMessage = 'Yes, '+trailName+' is <strong>Open</strong>!';
  } else {
    border = 'border-red-500';
    statusMessage = 'No, '+trailName+' is closed...';
  }

    return (
      <>
        <Head>
          <title>Is {trailName} open?</title>
        </Head>
        <div className="mt-auto">
          <div className="text-center">
            <Image src="/img/hydrocut-logo_sm.png" width="200" height="140" alt="" />
          </div>
          {/* {isLoading && <div className="mt-8 text-center">loading...</div>} */}
          {!isLoading && (
            <>
              {statusMessage &&
                <h1 className="text-center text-5xl mt-12 mb-8" dangerouslySetInnerHTML={{  __html: statusMessage }}></h1>
              }
              <div className="text-center">
                {message &&
                  <p className={`border text-lg mb-2 bg-white py-2 px-4 rounded ${border}`}>{message}</p>
                }
                <div className="flex justify-between items-center mt-2">
                  {updatedAt && 
                    <p className="text-xs text-slate-500">Last updated: <strong>{updatedDate.toDateString()}</strong></p>
                  }
                  {postLink &&
                    <a href={postLink} className="text-slate-500 hover:text-sky-600" target="_blank" rel="noreferrer">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 inline-block mr-1 relative -top-[1px]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        {username}
                      </span>
                    </a>
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </>
    )
  }

export async function getStaticProps(context) {
  return {
    props: {
      trailName: process.env.TRAIL_NAME,
      trailStatusAPIId: process.env.TRAILSTATUS_API_ID
    },
  }
}

export default HomePage