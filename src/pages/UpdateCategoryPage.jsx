import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header';
import UpdateCategoryForm from '../components/UpdateCategoryForm';

function UpdateCategoryPage({match:{params:{categoryId}}}) {
  return <div>
      <Header />
    <UpdateCategoryForm categoryId={categoryId} />
  </div>;
}

export default withRouter(UpdateCategoryPage);
