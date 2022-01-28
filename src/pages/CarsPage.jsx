import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
// import CarDetails from '../components/CarDetails';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
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
  const [cars, setCars] = useState([]);
  const init =() => {
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/car/list`,
    }).then((res) => {
      setCars(res.data);
    }).catch((err) => {
      console.log(err);
      alert("SOMETHING WENT WRONG");
    })
  }

  useEffect(() => {
    init();
  },[]);
  return <div>
      <Header />
      <div className='main-container'>
          <button className='add-new-car-button' onClick={() => { history.push("/add-cars")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW CAR </button>
      </div>
      <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Registration number</StyledTableCell>
            <StyledTableCell align="right">Model</StyledTableCell>
            <StyledTableCell align="right">Insurance validity</StyledTableCell>
            <StyledTableCell align="right">Permit Validity</StyledTableCell>
            <StyledTableCell align="right">Seats</StyledTableCell>
            <StyledTableCell align="right">luggage</StyledTableCell>
            <StyledTableCell align="right">edit</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cars.map((car) => (
            <StyledTableRow key={car._id}>
              <StyledTableCell component="th" scope="row">
                {car.reg_number}
              </StyledTableCell>
              <StyledTableCell align="right">{car?.type?.title}</StyledTableCell>
              <StyledTableCell align="right">{moment(car?.insurance_validity).format('DD MMM YYYY')}</StyledTableCell>
              <StyledTableCell align="right">{moment(car?.permit_validity).format('DD MMM YYYY')}</StyledTableCell>
              <StyledTableCell align="right">{car?.type?.seats}</StyledTableCell>
              <StyledTableCell align="right">{car?.type?.luggage}</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => {
                  history.push(`/update/car/${car?._id}`)
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
        cars.map((car,i) => (
          <CarDetails car={car} key={i} />
        ))
      }
      </div> */}
  </div>;
}

export default withRouter(CarsPage);
