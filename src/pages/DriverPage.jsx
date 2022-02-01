import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Switch from '@mui/material/Switch';
import makeToast from "../Toaster";

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import EditIcon from '@mui/icons-material/Edit';
// import { IconButton } from '@mui/material';
import axios from 'axios';
import { isAuthenticated } from '../auth';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const DriverPage = ({history}) => {

    const [drivers, setDrivers] = useState([]);

    const init =() => {
        axios({
            method:'GET',
            url:`${process.env.REACT_APP_API}/driver/list/${isAuthenticated()?.admin._id}`,
            headers:{
                Authorization:`Bearer ${isAuthenticated().token}`
            }
        }).then((res) => {
            setDrivers(res.data);
        }).catch((err ) => {
            console.log(err.response.data.error);
        })
    }

    useEffect(() => {
        init();
    },[]);

    const updateStatus = (id, status) => {
        if(status===1) status=0;
        else status =1;
        axios({
            method:'PUT',
            url:`${process.env.REACT_APP_API}/driver/update/${id}/${isAuthenticated()?.admin?._id}`,
            data:{status},
            headers:{
                Authorization:`Bearer ${isAuthenticated().token}`
            }
        }).then((res) => {
            makeToast("success", "Updated Successfully");
            init();
        }).catch((err) => {
            console.log(err.response.data.error);
            makeToast("error", err.response.data.error);
        })
    }
    return(
        <>
        <Header/>
        <div className='main-container'>
          <button className='add-new-car-button' onClick={() => { history.push("/add-driver")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW DRIVER </button>
        </div>
        <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
            <TableRow>
                <StyledTableCell align='left'>Avatar</StyledTableCell>
                <StyledTableCell>Driver Name</StyledTableCell>
                <StyledTableCell align="right">status</StyledTableCell>
                <StyledTableCell align="right">Contact</StyledTableCell>
                <StyledTableCell align="right">Location</StyledTableCell>
                <StyledTableCell align="right">Licence Number</StyledTableCell>
                <StyledTableCell align="right">Aadhar</StyledTableCell>
                {/* <StyledTableCell align="right">luggage</StyledTableCell> */}
                <StyledTableCell align="right">edit</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {drivers.map((driver) => (
                <StyledTableRow key={driver._id}>
                <StyledTableCell align="left">
                    <img src={`${process.env.REACT_APP_API}/image/photo/${driver?.image}`} width="50px" height="50px" style={{borderRadius:50}} alt={driver.name} />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                    {driver.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                    <Switch onClick={() => {
                        updateStatus(driver?._id,driver?.status);
                    }} checked={driver?.status===1 ? true : false} />
                </StyledTableCell>
                <StyledTableCell align="right">{driver.phone}</StyledTableCell>
                <StyledTableCell align="right">{driver?.location?.name}</StyledTableCell>
                <StyledTableCell align="right">{driver?.dl_number}</StyledTableCell>
                <StyledTableCell align="right">{driver?.aadhar_number}</StyledTableCell>
                {/* <StyledTableCell align="right">{}</StyledTableCell> */}
                <StyledTableCell align="right">
                    {/* <IconButton onClick={() => {
                    history.push(`/update/driver/${driver?._id}`)
                    }}>
                    <EditIcon color='"primary' />
                    </IconButton> */}
                </StyledTableCell>
                </StyledTableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        </>
    )
};

export default withRouter(DriverPage);