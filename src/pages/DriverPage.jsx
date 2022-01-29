import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header';
import AddDriverForm from '../components/AddDriverForm';

const DriverPage = ({history}) => {
    return(
        <>
        <Header/>
        <AddDriverForm/>
        </>
    )
};

export default withRouter(DriverPage);