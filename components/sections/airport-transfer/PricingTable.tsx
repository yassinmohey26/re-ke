'use client';

import styles from './PricingTable.module.css';

interface TransferRow {
  destination: string;
  car_price: number | null;
  minibus_price: number | null;
}

interface Props {
  heading: string;
  colGoal: string;
  colCar: string;
  colMinibus: string;
  rows: TransferRow[];
}

export default function PricingTable({ heading, colGoal, colCar, colMinibus, rows }: Props) {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>{heading}</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thGoal}>{colGoal}</th>
                <th className={styles.thPrice}>{colCar}</th>
                <th className={styles.thPrice}>{colMinibus}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? styles.stripe : ''}>
                  <td className={styles.destName}>{row.destination}</td>
                  <td className={styles.price}>
                    {row.car_price != null ? `${row.car_price} €` : '—'}
                  </td>
                  <td className={styles.price}>
                    {row.minibus_price != null ? `${row.minibus_price} €` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
