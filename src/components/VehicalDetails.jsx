import React from 'react';
import styles from '../styles/VehicalDetails.module.css';
import { withRouter, Link } from 'react-router-dom';

const VehicalDetails = ({category}) => {
  
    return (
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.logoSec}>
              <img src={`${process.env.REACT_APP_API}/category/photo/${category?._id}`} alt={category?.title} />
              <span className={styles.title}>{category?.title}</span>
              <span className={styles.type}>{category?.type}</span>
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.carDetails}>
              <ul>
                <li>
                  <img src="/seat.png" alt="seat" />
                  <span>{category?.seats} seater</span>
                </li>
                <li>
                  <img src="/luggage.png" alt="luggage" />
                  {category?.luggage} luggages
                </li>
              </ul>
              <ul>
                <li>
                  <img src="/snowflake.png" alt="snowflake" />
                  {category?.ac ? "AC Available": "AC Unavailable"}
                </li>
                <li>
                  <img src="/settings.png" alt="setting" />
                  {category?.ac}
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.bookCab}>
              <Link to={`/update/category/${category?._id}`} style={{textDecoration:'none'}}>
                <span>Edit</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}

export default withRouter(VehicalDetails);
