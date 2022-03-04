// import styles from './layout.module.css'
// className={styles.main}


export default function Layout({ children }) {
  return (
      <main className="min-h-screen flex items-center justify-center">    
        {children}
      </main>
  )
}




