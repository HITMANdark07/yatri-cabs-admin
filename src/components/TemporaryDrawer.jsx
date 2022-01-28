import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
import List from '@mui/material/List';
import CategoryIcon from '@mui/icons-material/Category';
import { withRouter } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Typography } from '@mui/material';

function TemporaryDrawer({showDrawer, toggleDrawer, history}) {
  // const toggleDrawer = (anchor, showD) => (event) => {
  //   if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
  //     return;
  //   }

  //   setState({ ...state, left: open });
  // };


  return (
    <div>
        <React.Fragment>
          <Drawer
            anchor={"left"}
            open={showDrawer}
            onClose={toggleDrawer}
          >
            <Box
            sx={{ width : 250 }}
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <List>
            <Typography sx={{flex:1, textAlign:'center', fontSize:25, fontWeight:'800', height:50}}>
              YATRI CABS
            </Typography>
            <Divider />

                <ListItem button onClick={() => {
                  history.push("/")
                }}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" secondary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => {
                  history.push("/category")
                }}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Car Catalog" secondary="Manage Categories" />
                </ListItem>

                <ListItem button onClick={() => {
                  history.push("/cars")
                }}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cars" secondary="Manage Cars" />
                </ListItem>

                <ListItem button onClick={() => {
                  history.push("/driver")
                }}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Driver" secondary="Manage Drivers" />
                </ListItem>

            </List>

            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Box>
          </Drawer>
        </React.Fragment>
    </div>
  );
}
export default withRouter(TemporaryDrawer);