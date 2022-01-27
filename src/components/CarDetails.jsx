import React from 'react';
import styles from '../styles/VehicalDetails.module.css';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';

const CarDetails = ({category, car}) => {
  
    return (
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.logoSec}>
              <img src={`${process.env.REACT_APP_API}/category/photo/${car?.type?._id}`} alt={category?.title} />
              <span className={styles.title}>{car?.reg_number}</span>
              <span className={styles.type}>{car?.type?.title}</span>
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.carDetails}>
              <ul>
                <li>
                  <img src="/seat.png" alt="seat" />
                  <span>{car?.type?.seats} seater</span>
                </li>
                <li>
                  <img src="/luggage.png" alt="luggage" />
                  {car?.type?.luggage} luggages
                </li>
              </ul>
              <ul>
                <li>
                  <img src="/valid.png" alt="snowflake" />
                  Insurance: {moment(car?.insurance_validity).format('DD MMM YYYY')}
                </li>
                <li>
                  <img src="/valid.png" alt="setting" />
                  Permit: {moment(car?.permit_validity).format('DD MMM YYYY')}
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.bookCab}>
              <Link to={`/update/car/${car?._id}`} style={{textDecoration:'none'}}>
                <span>Edit</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}

export default withRouter(CarDetails);
