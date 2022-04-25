import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { IconCheck, IconX, IconBrandInstagram } from '@tabler/icons';

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

  let statusMessage, border, trails;

  const message = data?.message
  const updatedDate = new Date(data?.updatedAt);
  const postLink = data?.instagramPermalink;
  const username = data?.user.username;

  if(data?.status === 'open') {
    border = 'border-green-500';
    statusMessage = 'Yes, '+trailName+' is <strong>open</strong>!';
  } else {
    border = 'border-red-500';
    statusMessage = 'No, '+trailName+' is closed...';
  }

  if(isLoading) return null;

  if (!data) return <div className="mt-auto">...</div>
  
  return (
      <>
        <Head>
          <title>Is {trailName} open?</title>
        </Head>
        <div className="mt-auto text-slate-900 dark:text-slate-300 p-4 max-w-2xl">
          <div className="text-center">
            <Image src="/img/logo.png" width="200" height="140" alt="" />
          </div>
          {!isLoading && (
            <>
              {statusMessage &&
                <h1 className="text-center text-5xl mt-12" dangerouslySetInnerHTML={{  __html: statusMessage }}></h1>
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