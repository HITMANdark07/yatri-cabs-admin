import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header';
import UpdateTariffForm from '../components/UpdateTariffForm';

function UpdateTariffPage({match:{params:{tariffId}}}) {
  return <div>
      <Header />
    <UpdateTariffForm tariffId={tariffId} />
  </div>;
}

export default withRouter(UpdateTariffPage);
