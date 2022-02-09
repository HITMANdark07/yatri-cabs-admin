import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header';
import UpdateDriverForm from '../components/UpdateDriverForm';

function UpdateDriverPage({match:{params:{driverId}}}) {
  return (<div>
        <Header />
            <UpdateDriverForm driverId={driverId} />
        </div>);
}

export default withRouter(UpdateDriverPage);
