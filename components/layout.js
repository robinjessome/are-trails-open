import Head from 'next/head'
// import styles from './layout.module.css'
// className={styles.main}

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Layouts Example</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center">    
        {children}
      </main>
    </>
  )
}