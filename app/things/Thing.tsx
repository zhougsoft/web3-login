'use client'
import styles from './things.module.css'

// import { useEffect } from 'react'

export default function Thing({ thing }: any) {
  return <div className={styles.thing}>{thing.title}</div>
}
