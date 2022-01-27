import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header';
import UpdateCarForm from '../components/UpdateCarForm';

function UpdateCarPage({match:{params:{carId}}}) {
  return <div>
      <Header />
    <UpdateCarForm carId={carId} />
  </div>;
}

export default withRouter(UpdateCarPage);
