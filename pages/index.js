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
  }, [])

    return (
      <>
        <Head>
          <title>Is {trailName} open?</title>
        </Head>
        <div>
          <div className="text-center mb-4">
            <Image src="/img/hydrocut-logo_sm.png" width="200" height="140" alt="" />
          </div>
          <h1 className="text-center text-5xl mb-12">{trailName} is <span className="font-bold">{data?.status}</span></h1>
          <div className="text-center">
            {data?.message}
          </div>
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