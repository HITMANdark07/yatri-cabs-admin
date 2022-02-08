import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withRouter } from 'react-router-dom';
// import VehicalDetails from '../components/VehicalDetails';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
// import moment from 'moment';
import { IconButton } from '@mui/material';

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


function CarsPage({history}) {
  const [categories, setCategories] = useState([]);
  const init =() => {
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/category-list`
    }).then((res) => {
      setCategories(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    init();
  },[]);
  return <div>
      <Header />
      <div className='main-container'>
          <button className='add-new-car-button' onClick={() => { history.push("/add-category")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW CAR CATEGORY </button>
      </div>
      <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Category Title</StyledTableCell>
            <StyledTableCell align="right">Seats</StyledTableCell>
            <StyledTableCell align="right">Luggage</StyledTableCell>
            <StyledTableCell align="right">AC Availablity</StyledTableCell>
            <StyledTableCell align="right">luggage</StyledTableCell>
            <StyledTableCell align="right">edit</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <StyledTableRow key={category._id}>
              <StyledTableCell component="th" scope="row">
                {category.title}
              </StyledTableCell>
              <StyledTableCell align="right">{category?.seats}</StyledTableCell>
              <StyledTableCell align="right">{category?.luggage}</StyledTableCell>
              <StyledTableCell align="right">{category?.ac ? "Available" : "Not Available"}</StyledTableCell>
              <StyledTableCell align="right">{category?.luggage}</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => {
                  history.push(`/update/category/${category?._id}`)
                }}>
                  <EditIcon color='"primary' />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      {/* <div className='category-cards-container'>
      {
        categories.map((cat,i) => (
          <VehicalDetails category={cat} key={i} />
        ))
      }
      </div> */}
  </div>;
}

export default withRouter(CarsPage);
