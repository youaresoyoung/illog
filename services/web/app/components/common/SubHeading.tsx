import styles from './SubHeading.module.css'

export const SubHeading = ({ text }: { text: string }) => {
  return <h2 className={styles.subHeading}>{text}</h2>
}
