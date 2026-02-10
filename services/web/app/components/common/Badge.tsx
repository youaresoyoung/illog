import styles from './Badge.module.css'

export const Badge = ({ text }: { text: string }) => {
  return <div className={styles.badge}>{text}</div>
}
