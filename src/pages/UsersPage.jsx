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
import { isAuthenticated } from '../auth';
import UserDetailList from '../components/UserDetailList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));



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
            {!role &&<StyledTableCell align="right">price</StyledTableCell>}
            {!role && <StyledTableCell align="right">edit</StyledTableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserDetailList key={user._id} initUser={initUser} initCorporate={initCorporate} role={role} user={user} />
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
