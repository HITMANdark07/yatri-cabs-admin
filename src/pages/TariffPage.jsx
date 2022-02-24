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
import { Button } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import makeToast from '../Toaster';
// import moment from 'moment';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import { IconButton } from '@mui/material';
import { isAuthenticated } from '../auth';
import { useCallback } from 'react';

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


function TariffPage({history}) {
  const [cars, setCars] = useState([]);
  const [location, setLocation] = useState("");
  const [active, setActive] = useState("LOCAL");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const init = useCallback(() => {
    setLoading(true);
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/tariff/list?&trip=${active}&start=${location}&limit=${limit}&skip=${skip}`,
    }).then((res) => {
      setCars(res.data);
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      console.log(err);
      alert("SOMETHING WENT WRONG");
    })
  },[active, location, limit,skip]);

 function deleteCar(id){
    axios({
      method:'DELETE',
      url:`${process.env.REACT_APP_API}/admin/tariff/delete/${id}/${isAuthenticated()?.admin?._id}`,
      headers:{
        Authorization:`Bearer ${isAuthenticated()?.token}`
      }
    }).then((res) => {
      makeToast("success", res.data.trip_type+" Tariff deleted !");
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
    
  },[init]);

  useEffect(() =>{
    getLocs();
  },[])
  const typeview = {
    flex:1, minHeight:'40px',padding:10, textAlign:'center',cursor:'pointer', color:'white', fontWeight:'800'
  }
  // console.log(filterdCars);

  const renderTable = (arr) => {
    if(arr[0]?.trip_type==="LOCAL" && !loading){
      return (
        <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>category</StyledTableCell>
            <StyledTableCell align="right">Trip Type</StyledTableCell>
            <StyledTableCell align="right">Location</StyledTableCell>
            <StyledTableCell align="right">Base Fare</StyledTableCell>
            <StyledTableCell align="right">Extra KM Charge</StyledTableCell>
            <StyledTableCell align="right">Extra Hour Charge</StyledTableCell>
            <StyledTableCell align="right">Driver Allowance</StyledTableCell>
            <StyledTableCell align="right">GST</StyledTableCell>
            <StyledTableCell align="right">edit</StyledTableCell>
            <StyledTableCell align="right">delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arr.map((car) => (
            <StyledTableRow key={car._id}>
              <StyledTableCell component="th" scope="row">
                {car?.category?.title}
              </StyledTableCell>
              <StyledTableCell align="right">{car?.trip_type} ({car?.sub_trip_type})</StyledTableCell>
              <StyledTableCell align="right">{car?.location?.name}</StyledTableCell>
              <StyledTableCell align="right">₹{car?.min_fare}/-</StyledTableCell>
              <StyledTableCell align="right">₹{car?.extra_km}/Km</StyledTableCell>
              <StyledTableCell align="right">₹{car?.extra_hours}/Hr</StyledTableCell>
              <StyledTableCell align="right">₹{car?.driver_allowance}/-</StyledTableCell>
              <StyledTableCell align="right">{car?.gst}%</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => {
                  history.push(`/update/tariff/${car?._id}`)
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
      )
    }else if(arr[0]?.trip_type==="OUTSTATION" && !loading){
      return(
        <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>category</StyledTableCell>
            <StyledTableCell align="right">Trip Type</StyledTableCell>
            <StyledTableCell align="right">Location</StyledTableCell>
            <StyledTableCell align="right">Per KM Charge</StyledTableCell>
            <StyledTableCell align="right">Driver Allowance</StyledTableCell>
            <StyledTableCell align="right">GST</StyledTableCell>
            <StyledTableCell align="right">edit</StyledTableCell>
            <StyledTableCell align="right">delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arr.map((car) => (
            <StyledTableRow key={car._id}>
              <StyledTableCell component="th" scope="row">
                {car?.category?.title}
              </StyledTableCell>
              <StyledTableCell align="right">{car?.trip_type} ({car?.sub_trip_type})</StyledTableCell>
              <StyledTableCell align="right">{car?.location?.name}</StyledTableCell>
              <StyledTableCell align="right">₹{car?.per_km}/- {car.min_km_per_day ? "("+car.min_km_per_day+"KM/day)" : "" }</StyledTableCell>
              <StyledTableCell align="right">₹{car?.driver_allowance}/- {
                car.driver_allowance_day ? "(₹"+car.driver_allowance_day+"/- /day)" : ""
              } </StyledTableCell>
              <StyledTableCell align="right">{car?.gst}%</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => {
                  history.push(`/update/tariff/${car?._id}`)
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
      )
    }else if(arr[0]?.trip_type==="AIRPORT" && !loading){
      return(
        <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>category</StyledTableCell>
            <StyledTableCell align="right">Trip Type</StyledTableCell>
            <StyledTableCell align="right">Location</StyledTableCell>
            <StyledTableCell align="right">Base Fare</StyledTableCell>
            <StyledTableCell align="right">Extra KM Charge</StyledTableCell>
            <StyledTableCell align="right">Driver Allowance</StyledTableCell>
            <StyledTableCell align="right">GST</StyledTableCell>
            <StyledTableCell align="right">edit</StyledTableCell>
            <StyledTableCell align="right">delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arr.map((car) => (
            <StyledTableRow key={car._id}>
              <StyledTableCell component="th" scope="row">
                {car?.category?.title}
              </StyledTableCell>
              <StyledTableCell align="right">{car?.trip_type} ({car?.sub_trip_type})</StyledTableCell>
              <StyledTableCell align="right">{car?.location?.name}</StyledTableCell>
              <StyledTableCell align="right">₹{car?.min_fare}/- </StyledTableCell>
              <StyledTableCell align="right">₹{car?.extra_km}/- </StyledTableCell>
              <StyledTableCell align="right">₹{car?.driver_allowance}/-</StyledTableCell>
              <StyledTableCell align="right">{car?.gst}%</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={() => {
                  history.push(`/update/tariff/${car?._id}`)
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
      )
    }else if(loading){
      return (
        <Box sx={{ width: '90%', marginLeft:'5%' }}>
          <Skeleton height={60} />
          <Skeleton animation="wave" height={60} />
          <Skeleton animation="wave" height={60} />
          <Skeleton animation="wave" height={60} />
          <Skeleton animation="wave" height={60} />
          <Skeleton animation={false} height={60} />
        </Box>
      )
    }else{
      return (
        <div style={{width: '90%', marginLeft:'5%', textAlign:'center'}}>
          <h2 style={{fontWeight:'400', letterSpacing:5}}>"0" Results Found</h2>
        </div>
      )
    }
  }
  return <div>
      <Header />
      <div className='main-container'>
          <div style={{display:'flex', flexDirection:'row'}}>
          {/* <TextField label="SEARCH HERE..." onChange={(e) =>{
            let name = e.target.value;
            let c = cars.filter((car) => car.make_model.toLowerCase().includes(name.toLowerCase()) && location==="" ? true : car.location._id===location);
            setFilteredCars(c);
          }} variant="standard" sx={{minWidth:400}}  /> */}

            <Box sx={{ minWidth: 220, }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Location</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={location}
                  label="Location"
                  onChange={(e) => {
                    setLocation(e.target.value)
                  }}
                >
                  <MenuItem value="">ALL LOCATIONS</MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc._id} value={loc._id}>{loc.name}</MenuItem>
                  ))}
                  
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 150, marginLeft:5 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-tariff-label">Tariffs Per Page</InputLabel>
                <Select
                  labelId="demo-simple-select-tariff-label"
                  id="demo-simple-select"
                  value={limit}
                  label="Tariffs Per Page"
                  onChange={(e) => {
                    setLimit(e.target.value)
                  }}
                >
                  {[1,2,5,10,15,20,25].map((lt) => (
                    <MenuItem key={lt} value={lt}>{lt}</MenuItem>
                  ))}
                  
                </Select>
              </FormControl>
            </Box>
          </div>

          <button className='add-new-car-button' onClick={() => { history.push("/add-tariff")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW TARIFF </button>
      </div>

      <div style={{width:'90%', marginLeft:'5%', display:'flex', flexDirection:'row',backgroundColor:'black', justifyContent:'center', alignItems:'center', borderRadius:'5px', overflow:'hidden', marginBottom:5}}>
          <div style={{...typeview,backgroundColor:active==="LOCAL" ? '#4285F8': 'inherit'}} onClick={() => setActive("LOCAL")}>LOCAL</div>
          <div style={{...typeview,backgroundColor:active==="OUTSTATION" ? '#4285F8': 'inherit'}} onClick={() => setActive("OUTSTATION")}>OUTSTATION</div>
          <div style={{...typeview,backgroundColor:active==="AIRPORT" ? '#4285F8': 'inherit'}} onClick={() => setActive("AIRPORT")}>AIRPORT</div>
      </div>
      
      {renderTable(cars)}

    <div style={{display:'flex',width:'90%',marginTop:10, marginLeft:'5%',flexDirection:'row-reverse' }}>
        {cars.length>=limit && <Button variant='contained' onClick={() =>{
          setSkip((s) => s+limit);
        }} endIcon={<SkipNextIcon />} >NEXT</Button>}
        {
          cars.length>=limit && skip>0 &&
          <Button disabled sx={{fontSize:20}}>{(skip/limit)+1}</Button>
        }
        {skip>0 && <Button variant='contained' onClick={() => {
          setSkip((s) => s-limit);
        }} startIcon={<SkipPreviousIcon />} >PREV</Button>}
    </div>
      {/* <div className='category-cards-container'>
      {
        cars.map((car,i) => (
          <CarDetails car={car} key={i} />
        ))
      }
      </div> */}
  </div>;
}

export default withRouter(TariffPage);
