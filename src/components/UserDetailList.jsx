import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { Button, IconButton } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { isAuthenticated } from "../auth";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function UserDetailList({ user, role, initCorporate, initUser }) {
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(user?.price);
  const updateStatus = (status, id) => {
    if (status === 1) {
      status = 0;
    } else status = 1;
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/user/update/${id}/${
        isAuthenticated()?.admin?._id
      }`,
      headers: {
        Authorization: `Bearer ${isAuthenticated()?.token}`,
      },
      data: {
        status: status,
      },
    })
      .then((res) => {
        if (res?.data?._id) {
          if (!role) {
            initCorporate();
          } else {
            initUser();
          }
        }
      })
      .catch((err) => {
        console.log(err?.response?.data?.error);
        alert("SOMETING WENT WRONG");
      });
  };

  const updatePrice = () => {
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/user/update/${user._id}/${
        isAuthenticated()?.admin?._id
      }`,
      headers: {
        Authorization: `Bearer ${isAuthenticated()?.token}`,
      },
      data: {
        price: price,
      },
    })
      .then((res) => {
        if (res?.data?._id) {
            setShow(false);
          if (!role) {
            initCorporate();
          } else {
            initUser();
          }
        }
      })
      .catch((err) => {
        console.log(err?.response?.data?.error);
        alert("SOMETING WENT WRONG");
      });
  };
  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        {user.name}
      </StyledTableCell>
      <StyledTableCell align="right">{user?.email}</StyledTableCell>
      <StyledTableCell align="right">
        <Switch
          onClick={() => updateStatus(user?.status, user?._id)}
          checked={user?.status === 1 ? true : false}
        />
      </StyledTableCell>
      <StyledTableCell align="right">
        {moment(user?.createdAt).fromNow()}
      </StyledTableCell>
      <StyledTableCell align="right">
        {moment(user?.updatedAt).fromNow()}
      </StyledTableCell>
      <StyledTableCell align="right">{user?.role}</StyledTableCell>
      {!role && <StyledTableCell align="right">
        {show ? <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}  className="inp-price" /> : user?.price}  
        </StyledTableCell>}
      {!role && (
        <StyledTableCell align="right">
          
            {show ? <Button onClick={updatePrice} color="primary" variant="contained" >Update</Button> : <IconButton onClick={() => setShow(true)}><EditIcon  color='"primary' /></IconButton>}
          
        </StyledTableCell>
      )}
    </StyledTableRow>
  );
}

export default UserDetailList;
