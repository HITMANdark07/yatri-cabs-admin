import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
// import CarDetails from '../components/CarDetails';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Switch from '@mui/material/Switch';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
// import { IconButton } from '@mui/material';
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



function UsersPage({history}) {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(true);
  const initUser =() => {
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/user/by-user/${isAuthenticated()?.admin?._id}`,
      headers:{
          Authorization:`Bearer ${isAuthenticated()?.token}`
      }
    }).then((res) => {
      setUsers(res.data);
    }).catch((err) => {
      console.log(err);
      alert("SOMETHING WENT WRONG");
    })
  }
  const initCorporate = () => {
      axios({
          method:'GET',
          url:`${process.env.REACT_APP_API}/user/by-corporate/${isAuthenticated()?.admin?._id}`,
          headers:{
            Authorization:`Bearer ${isAuthenticated()?.token}`
          }
      }).then((res) => {
          setUsers(res.data);
      }).catch((err) => {
          console.log(err);
          alert("SOMETHING WENT WRONG");
      })
  }

  const updateStatus = (status, id) => {
    if(status===1){
        status=0;
    }else status=1;
    axios({
        method:'PUT',
        url:`${process.env.REACT_APP_API}/user/update/${id}/${isAuthenticated()?.admin?._id}`,
        headers:{
            Authorization:`Bearer ${isAuthenticated()?.token}`
        },
        data:{
            status:status
        }
    }).then((res) => {
        if(res?.data?._id){
            if(!role){
                initCorporate();
            }else{
                initUser();
            }
        }
    }).catch((err) => {
        console.log(err?.response?.data?.error);
        alert("SOMETING WENT WRONG");
    })
  }

  useEffect(() => {
    if(!role){
        initCorporate();
    }else{
        initUser();
    }
  },[role]);
  return <div>
      <Header />
      <div className='main-container'>
          {/* <button className='add-new-car-button' onClick={() => { history.push("/add-users")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW CAR </button> */}
          <h2>MANAGE {role ? "USERS" : "CORPORATES"}<sup><Switch onClick={() => setRole((state) => !state)} checked={role} /></sup></h2>
      </div>
      <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">User Email</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Registered</StyledTableCell>
            <StyledTableCell align="right">Updated</StyledTableCell>
            <StyledTableCell align="right">Role</StyledTableCell>
            {/* <StyledTableCell align="right">tarrif</StyledTableCell> */}
            {/* <StyledTableCell align="right">edit</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <StyledTableRow key={user._id}>
              <StyledTableCell component="th" scope="row">
                {user.name}
              </StyledTableCell>
              <StyledTableCell align="right">{user?.email}</StyledTableCell>
              <StyledTableCell align="right"><Switch onClick={() => updateStatus(user?.status,user?._id)} checked={user?.status===1 ? true : false} /></StyledTableCell>
              <StyledTableCell align="right">{moment(user?.createdAt).fromNow()}</StyledTableCell>
              <StyledTableCell align="right">{moment(user?.updatedAt).fromNow()}</StyledTableCell>
              <StyledTableCell align="right">{user?.role}</StyledTableCell>
              {/* <StyledTableCell align="right">{user?.tarrif}</StyledTableCell> */}
              {/* <StyledTableCell align="right">
                <IconButton onClick={() => {
                  history.push(`/update/user/${user?._id}`)
                }}>
                  <EditIcon color='"primary' />
                </IconButton>
              </StyledTableCell> */}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      {/* <div className='category-cards-container'>
      {
        users.map((car,i) => (
          <CarDetails car={car} key={i} />
        ))
      }
      </div> */}
  </div>;
}

export default withRouter(UsersPage);
