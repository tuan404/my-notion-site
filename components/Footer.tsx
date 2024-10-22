import * as React from 'react'

import * as config from '@/lib/config'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const FooterImpl: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        Copyright {currentYear}©{config.author}
      </div>
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
