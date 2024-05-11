import React from 'react'
import {Divider} from 'rsuite'

import styles from "./Divider.module.scss"

export default function MyDivider() {
  return (
    <div>
        <Divider vertical className={styles.divider} />
    </div>
  )
}
