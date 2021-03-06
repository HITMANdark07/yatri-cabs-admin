import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
// import CarDetails from '../components/CarDetails';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TextField } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import makeToast from '../Toaster';
import moment from 'moment';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { IconButton } from '@mui/material';
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


function CarsPage({history}) {
  const [cars, setCars] = useState([]);
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm ] = useState("");
  const [locations, setLocations] = useState([]);
  const [filterdCars, setFilteredCars] = useState([]);
  const init =() => {
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/car/list`,
    }).then((res) => {
      setCars(res.data);
      setFilteredCars(res.data);
    }).catch((err) => {
      console.log(err);
      alert("SOMETHING WENT WRONG");
    })
  }

 function deleteCar(id){
    axios({
      method:'DELETE',
      url:`${process.env.REACT_APP_API}/admin/car/delete/${id}/${isAuthenticated()?.admin?._id}`,
      headers:{
        Authorization:`Bearer ${isAuthenticated()?.token}`
      }
    }).then((res) => {
      makeToast("success", res.data.make_model+" deleted !");
      console.log(res.data);
      init();
    }).catch((err) => {
      console.log(err);
      alert("SOMETHING WENT WRONG");
    })
  }

 const getLocs =() => {
  axios({
      method:"GET",
      url:`${process.env.REACT_APP_API}/location/list`,
  }).then((res) => {
      setLocations(res.data);
  }).catch((err) => {
      console.log(err.response?.data?.error);
      alert("SOMETHING WENT WRONG");
  })
};


  useEffect(() => {
    init();
    getLocs();
  },[]);

  // console.log(filterdCars);
  return <div>
      <Header />
      <div className='main-container'>
          <div style={{display:'flex', flexDirection:'row'}}>
          <TextField label="SEARCH HERE..."
            onChange={(e) =>{
            let name = e.target.value;
            setSearchTerm(name)
            // let c = cars.filter((car) => car.make_model.toLowerCase().includes(name.toLowerCase()));
            // setFilteredCars(c);
          }} variant="standard" sx={{minWidth:400}}  />

            <Box sx={{ minWidth: 220, marginLeft:5 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Location</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={location}
                  label="Location"
                  onChange={(e) => {
                    setLocation(e.target.value)
                    let c =  cars.filter((car) => car.location._id===e.target.value) ;
                    if(e.target.value===""){
                      setFilteredCars(cars);
                    }else{
                      setFilteredCars(c);
                    }
                    
                  }}
                >
                  <MenuItem value="">ALL LOCATIONS</MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc._id} value={loc._id}>{loc.name}</MenuItem>
                  ))}
                  
                </Select>
              </FormControl>
            </Box>
          </div>

          <button className='add-new-car-button' onClick={() => { history.push("/add-cars")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW CAR </button>
      </div>
      <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Registration number</StyledTableCell>
            <StyledTableCell align="right">Make & Model</StyledTableCell>
            <StyledTableCell align="right">Location</StyledTableCell>
            <StyledTableCell align="right">Model</StyledTableCell>
            <StyledTableCell align="right">Insurance validity</StyledTableCell>
            <StyledTableCell align="right">Permit Validity</StyledTableCell>
            <StyledTableCell align="right">edit</StyledTableCell>
            <StyledTableCell align="right">delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterdCars.filter((fc) =>  fc.make_model.toLowerCase().includes(searchTerm.toLowerCase())).map((car) => (
            <StyledTableRow key={car._id}>
              <StyledTableCell component="th" scope="row">
                {car.reg_number}
              </StyledTableCell>
              <StyledTableCell align="right">{car?.make_model}</StyledTableCell>
              <StyledTableCell align="right">{car?.location?.name}</StyledTableCell>
              <StyledTableCell align="right">{car?.type?.title}</StyledTableCell>
              <StyledTableCell align="right">{moment(car?.insurance_validity_from).format('DD MMM YYYY')} - {moment(car?.insurance_validity_to).format('DD MMM YYYY')}</StyledTableCell>
              <StyledTableCell align="right">{moment(car?.permit_validity_from).format('DD MMM YYYY')} - {moment(car?.permit_validity_to).format('DD MMM YYYY')}</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => {
                  history.push(`/update/car/${car?._id}`)
                }}>
                  <EditIcon color="primary" />
                </IconButton>
              </StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => deleteCar(car?._id)} >
                  <DeleteForeverIcon color="secondary" />
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
