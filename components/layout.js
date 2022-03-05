// import styles from './layout.module.css'
// className={styles.main}
import React, { useEffect, useState } from 'react';
import Footer from './footer'
import ColorToggle from './color-toggle'


export default function Layout({ children }) {

  return (
      <main className="bg-slate-100 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center">
        <ColorToggle />
        {children}
        <Footer />
      </main>
  )
  }



