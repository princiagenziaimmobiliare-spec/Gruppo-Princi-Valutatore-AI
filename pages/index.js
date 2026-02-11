import PropertyForm from '../components/PropertyForm';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Property Valuation</h1>
      <PropertyForm />
    </div>
  );
}