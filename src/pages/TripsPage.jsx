import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
// import CarDetails from '../components/CarDetails';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Button } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import EditIcon from '@mui/icons-material/Edit';
// import makeToast from '../Toaster';
// import moment from 'moment';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ModelComp from '../components/Model';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from '@mui/lab/LoadingButton';
// import { isAuthenticated } from '../auth';
import makeToast from '../Toaster';
import CheckIcon from '@mui/icons-material/Check';
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { useCallback } from 'react';
import { isAuthenticated } from '../auth';

const st = ['UNPAID','PARTIAL','PAID','REFUNDED'];
const clr = ["red","yellow","green","grey"];
const s = ["PENDING","CONFIRMED","LIVE", "COMPLETED","CANCELED"];
const sclr = ["yellow","greenyellow","green","grey","red"];

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


const MyMapComponent = compose(
  withProps({
    /**
     * Note: create and replace your own key in the Google console.
     * https://console.developers.google.com/apis/dashboard
     * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
     */
    // lat:-34.397,
    // lng:150.644,
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyATzOQBhRyutho2AlgGTQnsybhNOkuACzI&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `200px` }} />,
    containerElement: <div style={{ height: `200px` }} />,
    mapElement: <div style={{ height: `200px` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={18} defaultCenter={{ lat: props.lat, lng: props.lng }}>
    {props.isMarkerShown && (
      <Marker position={{ lat: props.lat, lng: props.lng }} />
    )}
  </GoogleMap>
));
function TableDataList({trip,history,fetchTrips}) {
  const [show, setShow] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState("");
  const [cars, setCars] = useState([]);
  const [car, setCar] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [ig, setIg] = useState("");
  const [cig, setCig] = useState("");
  const toggleShow = () => {
    setShow((state) => !state);
  }

  const assignDriver = () => {
    setLoading1(true);
    axios({
      method:'PUT',
      url:`${process.env.REACT_APP_API}/trip/update/${trip._id}/${isAuthenticated()?.admin?._id}`,
      headers:{
        Authorization:`Bearer ${isAuthenticated()?.token}`
      },
      data:{
        status:'CONFIRMED',
        driver:driver
      }
    }).then((response) => {
      if(response?.data?._id){
        makeToast("success","Successfully Assigned");
        fetchTrips();
        setShow(false);
      }
      setLoading1(false);
    }).catch((err) => {
      makeToast("error", err?.response?.data?.error);
      setLoading1(false);
    })
  }

  const cancelTrip = () => {
    setLoading2(true);
    axios({
      method:'PUT',
      url:`${process.env.REACT_APP_API}/trip/update/${trip._id}/${isAuthenticated()?.admin?._id}`,
      headers:{
        Authorization:`Bearer ${isAuthenticated()?.token}`
      },
      data:{
        status:'CANCELED'
      }
    }).then((response) => {
      if(response?.data?._id){
        makeToast("success","Successfully Canceled");
        fetchTrips();
        setShow(false);
      }
      setLoading2(false);
    }).catch((err) => {
      makeToast("error", err?.response?.data?.error);
      setLoading2(false);
    })
  }

  const init = React.useCallback(() => {
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/driver/list/${isAuthenticated()?.admin?._id}?status=1&location=${trip?.tariff?.location?._id}`,
      headers:{
        Authorization:`Bearer ${isAuthenticated().token}`
      }
    }).then((response) => {
      setDrivers(response.data);
    }).catch((err) => {
      console.log(err);
    })
  },[trip])

  const init2 = React.useCallback(() => {
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/car/list?type=${trip?.car_type?._id}&location=${trip?.tariff?.location?._id}&booked=false`,
      headers:{
        Authorization:`Bearer ${isAuthenticated().token}`
      }
    }).then((response) => {
      console.log(response.data);
      setCars(response?.data);
    }).catch((err) => {
      makeToast("error",err?.response?.data?.error);
    })
  },[trip]);
  React.useEffect(() => {
    if(show){
      init();
      init2();
    }
  },[show, init, init2])
  return(
    <StyledTableRow key={trip._id}>
              <ModelComp open={show} setOpen={setShow}>
              <>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                  <Typography id="modal-modal-title" variant="h4" >
                   Assign Driver
                  </Typography>
                  <IconButton onClick={() => setShow(false)}>
                  <CloseIcon />
                  </IconButton>
                </div>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                  <div style={{flex:1}}>
                    <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
                    {trip?.tariff?.location?.name}
                    </Typography>
                    {trip?.tariff?.trip_type==="OUTSTATION" && (
                      <>
                      <Typography id="modal-modal-description" variant='p' sx={{ mt: 2 }}>
                      to
                      </Typography>
                      <Typography id="modal-modal-description" variant="h6" sx={{ mb: 2 }}>
                      {trip?.destination?.name}
                      </Typography>
                      </>
                    )}
                  </div>

                  {ig!==""  && <img src={`${process.env.REACT_APP_API}/image/photo/${ig}`} style={{width:'50%', aspectRatio:'1/1',margin:5, borderRadius:5}} alt={driver}  />}
                </div>
                <>
                <FormControl fullWidth sx={{my:2}}>
                  <InputLabel id="demo-simple-select-label" style={{marginLeft:'-1%'}}>Driver</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={driver}
                    label="Age"
                    onChange={(e) => {
                      setDriver(e.target.value);
                      const d = drivers.filter((f) => f._id===e.target.value);
                      setIg(d[0]?.image);
                    }}
                  >
                    {drivers.length===0 && <MenuItem value="">NO DRIVERS AVAILABLE</MenuItem>}
                    {drivers.map((d) => {
                      return <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                {cig!==""  && <img src={`${process.env.REACT_APP_API}/image/photo/${cig}`} style={{width:'100%',margin:5, borderRadius:5}} alt={driver}  />}
                <FormControl fullWidth sx={{my:2}}>
                  <InputLabel id="demo-simple-select-label" style={{marginLeft:'-1%'}}>Select Car</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={car}
                    label="Select Car"
                    onChange={(e) => {
                      setCar(e.target.value);
                      const d = cars.filter((f) => f._id===e.target.value);
                      if(d) setCig(d[0]?.image);
                    }}
                  >
                    {cars.length===0 && <MenuItem value="">NO CAR AVAILABLE</MenuItem>}
                    {cars.map((d) => {
                      return <MenuItem key={d._id} value={d._id}>{d.reg_number}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <MyMapComponent isMarkerShown lat={trip?.start?.lat} lng={trip?.start?.lng} />
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                <LoadingButton variant='contained' loading={loading1} disabled={driver==="" || loading1 || car===""} onClick={assignDriver} sx={{my:1}} startIcon={<CheckIcon />}>ASSIGN AND CONFIRM</LoadingButton>
                <LoadingButton variant='contained' loading={loading2} onClick={cancelTrip} disabled={loading2} color='secondary' sx={{my:1}} startIcon={<CancelIcon />}>CANCEL TRIP</LoadingButton>
                </div>
                </>
              </>
              </ModelComp>
              <StyledTableCell component="th" scope="row">
                {trip?.tariff?.location?.name}
              </StyledTableCell>
              <StyledTableCell align="right">{trip?.tariff?.trip_type} ({trip?.tariff?.sub_trip_type})</StyledTableCell>
              <StyledTableCell align="right">{trip?.car_type?.title}</StyledTableCell>
              <StyledTableCell align="right">
              <div 
              style={{backgroundColor: sclr[s.indexOf(trip?.status)], padding:5,borderRadius:2, fontWeight:'700'}}>
              {trip?.status}
              </div>
              </StyledTableCell>
              <StyledTableCell align="right">{moment(new Date(trip?.pick_date)).format("DD MMM YYYY")}</StyledTableCell>
              <StyledTableCell align="right">{trip?.pick_time}</StyledTableCell>
              <StyledTableCell align="right">
              <div 
              style={{backgroundColor: clr[st.indexOf(trip?.paymentStatus)], color:'white', padding:5,borderRadius:2, fontWeight:'500', alignItems:'center'}}>
                  {trip?.paymentStatus}
                  </div></StyledTableCell>
              <StyledTableCell align="right">{trip?.contact}</StyledTableCell>
              <StyledTableCell align="right">{trip?.client_name}</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton onClick={toggleShow}>
                  <VisibilityIcon color="primary" />
                </IconButton>
              </StyledTableCell>
              {/* <StyledTableCell align="right">
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
              </StyledTableCell> */}
    </StyledTableRow>
  )
}

function TripsPage({history}) {
  const [trips, setTrips] = useState([]);
  const [location, setLocation] = useState("");
//   const [active, setActive] = useState("LOCAL");
  const [status, setStatus] = useState("PENDING");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  const init = useCallback(() => {
    setLoading(true);
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/trips/list?&location=${location}&status=${status}&limit=${limit}&skip=${skip}`,
    }).then((res) => {
      setTrips(res.data);
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      console.log(err);
      alert("SOMETHING WENT WRONG");
    })
  },[status, location, limit,skip]);

//  function deleteTrip(id){
//     axios({
//       method:'DELETE',
//       url:`${process.env.REACT_APP_API}/admin/tariff/delete/${id}/${isAuthenticated()?.admin?._id}`,
//       headers:{
//         Authorization:`Bearer ${isAuthenticated()?.token}`
//       }
//     }).then((res) => {
//       makeToast("success", res.data.trip_type+" Tariff deleted !");
//       console.log(res.data);
//       init();
//     }).catch((err) => {
//       console.log(err);
//       alert("SOMETHING WENT WRONG");
//     })
//   }

 const getLocs =() => {
  axios({
      method:"GET",
      url:`${process.env.REACT_APP_API}/location/list?status=true`,
  }).then((res) => {
      setLocations(res.data);
    //   if(res.data[0]._id) setLocation(res.data[0]._id);
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
//   const typeview = {
//     flex:1, minHeight:'40px',padding:10, textAlign:'center',cursor:'pointer', color:'white', fontWeight:'800'
//   }
  // console.log(filterdCars);

  const RenderTable = ({arr,fetchTrips}) => {
    if(arr[0]?._id&& !loading){
      return (
        <TableContainer component={Paper} sx={{maxWidth:'90%', marginLeft:'5%'}}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Location</StyledTableCell>
            <StyledTableCell align="right">Trip Type</StyledTableCell>
            <StyledTableCell align="right">Car Type</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Pickup Date</StyledTableCell>
            <StyledTableCell align="right">Pick Time</StyledTableCell>
            <StyledTableCell align="right">Pay. Stat.</StyledTableCell>
            <StyledTableCell align="right">Contact</StyledTableCell>
            <StyledTableCell align="right">Client Name</StyledTableCell>
            <StyledTableCell align="right">Manage</StyledTableCell>
            {/* <StyledTableCell align="right">edit</StyledTableCell>
            <StyledTableCell align="right">delete</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {arr.map((trip) => (
            <TableDataList trip={trip} key={trip._id} history={history} fetchTrips={fetchTrips} />
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
                <InputLabel id="demo-simple-select-status-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-status-label"
                  id="demo-simple-select"
                  value={status}
                  label="Status"
                  onChange={(e) => {
                    setStatus(e.target.value)
                  }}
                >
                  {["PENDING","CONFIRMED","LIVE", "COMPLETED","CANCELED"].map((lt) => (
                    <MenuItem key={lt} value={lt}>{lt}</MenuItem>
                  ))}
                  
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ minWidth: 150, marginLeft:5 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-tariff-label">Trips Per Page</InputLabel>
                <Select
                  labelId="demo-simple-select-tariff-label"
                  id="demo-simple-select"
                  value={limit}
                  label="Trips Per Page"
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

          {/* <button className='add-new-car-button' onClick={() => { history.push("/add-tariff")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW TARIFF </button> */}
      </div>

      {/* <div style={{width:'90%', marginLeft:'5%', display:'flex', flexDirection:'row',backgroundColor:'black', justifyContent:'center', alignItems:'center', borderRadius:'5px', overflow:'hidden', marginBottom:5}}>
          <div style={{...typeview,backgroundColor:active==="LOCAL" ? '#4285F8': 'inherit'}} onClick={() => setActive("LOCAL")}>LOCAL</div>
          <div style={{...typeview,backgroundColor:active==="OUTSTATION" ? '#4285F8': 'inherit'}} onClick={() => setActive("OUTSTATION")}>OUTSTATION</div>
          <div style={{...typeview,backgroundColor:active==="AIRPORT" ? '#4285F8': 'inherit'}} onClick={() => setActive("AIRPORT")}>AIRPORT</div>
      </div> */}
      
      {/* {renderTable(trips)} */}
      <RenderTable arr={trips} fetchTrips={init} />

    <div style={{display:'flex',width:'90%',marginTop:10, marginLeft:'5%',flexDirection:'row-reverse' }}>
        {trips.length>=limit && <Button variant='contained' onClick={() =>{
          setSkip((s) => s+limit);
        }} endIcon={<SkipNextIcon />} >NEXT</Button>}
        {
          trips.length>=limit && skip>0 &&
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

export default withRouter(TripsPage);
