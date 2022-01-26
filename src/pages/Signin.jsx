import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Header from '../components/Header';
import SignUpForm from '../components/SignUpForm';

function Signin({history}) {

    useEffect(() => {
        if(isAuthenticated()){
            history.push("/");
        }
    },[history]);
  return <div>
      <Header />
      <SignUpForm />
  </div>;
}
export default withRouter(Signin);