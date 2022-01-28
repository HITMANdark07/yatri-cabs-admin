import React from 'react';
import styles from '../styles/Tabs.module.css';
import StreamIcon from '@mui/icons-material/Stream';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import VerifiedIcon from '@mui/icons-material/Verified';
// import GroupsIcon from '@mui/icons-material/Groups';
import PersonPinIcon from '@mui/icons-material/PersonPin';

function Tabs() {
  return <div className={styles.main}>
      <div className={styles.tab} style={{backgroundColor:'#0C91EA'}}>
            <StreamIcon className={styles.icon} sx={{fontSize:150, color:'#fff'}} />
            <div className={styles.content}>
                <div className={styles.tabs}>Live Rides</div>
                <div className={styles.tabs}>2/1</div>
            </div>
      </div>
      <div className={styles.tab} style={{backgroundColor:'#69CC49'}}>
            <VerifiedIcon className={styles.icon} sx={{fontSize:150, color:'#fff'}} />
            <div className={styles.content}>
                <div className={styles.tabs}>Confirmed Rides</div>
                <div className={styles.tabs}>2/1</div>
            </div>
      </div>
      <div className={styles.tab} style={{backgroundColor:'#9934F7'}}>
            <PauseCircleFilledIcon className={styles.icon} sx={{fontSize:150, color:'#fff'}} />
            <div className={styles.content}>
                <div className={styles.tabs}>Pending Bookings</div>
                <div className={styles.tabs}>2/1</div>
            </div>
      </div>
      <div className={styles.tab} style={{backgroundColor:'#D0C409'}}>
            <PersonPinIcon className={styles.icon} sx={{fontSize:150, color:'#fff'}} />
            <div className={styles.content}>
                <div className={styles.tabs}>Drivers Online</div>
                <div className={styles.tabs}>2/1</div>
            </div>
      </div>
  </div>;
}

export default Tabs;
