import styles from './MobileNotice.module.css'

export const MobileNotice = () => {
  return (
    <div className={styles.mobileNotice}>
      <p>
        Mobile environments do not support installation. Please access from a desktop (Mac or
        Windows) to proceed with the installation.
      </p>
    </div>
  )
}
