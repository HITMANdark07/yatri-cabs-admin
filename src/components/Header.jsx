import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { isAuthenticated } from '../auth';
import { withRouter } from 'react-router-dom';
import { signout } from '../auth';
import TemporaryDrawer from './TemporaryDrawer';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({history}) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [showDrawer, setShowDrawer] = React.useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const toggleDrawer = () => {
    setShowDrawer((state) => !state);
  }

  return (
    <>
    <TemporaryDrawer showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
    <AppBar position="fixed" color="primary" enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer}
              color="inherit"
            >
              <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: 'flex' }}
          >
            Yatri-Cabs
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}></Box>

          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => {
                handleCloseNavMenu();
                history.push("/cars")
              }}>
                  <Typography textAlign="center">Cars</Typography>
              </MenuItem>

              <MenuItem onClick={() => {
                handleCloseNavMenu();
                history.push("/category")
              }}>
                  <Typography textAlign="center">Manage Category</Typography>
              </MenuItem>

              <MenuItem onClick={() => {
                handleCloseNavMenu();
                history.push("/coupons")
              }}>
                  <Typography textAlign="center">Coupans</Typography>
              </MenuItem>
              
            </Menu>
          </Box> */}
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            Yatri-Cabs
          </Typography> */}
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
    
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  history.push("/category");
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
               Manage Category
              </Button>

              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  history.push("/cars");
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Cars
              </Button>

              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  history.push("/coupans");
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Coupon
              </Button> 
            
          </Box> */}

          <Box sx={{ flexGrow: 1 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 2, float:'right' }}>
                <Avatar alt="Remy Sharp" src="https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png" />
                <Typography sx={{color:'#fff', marginLeft:1}} >
                  {isAuthenticated().admin?.name}
                </Typography>
                </IconButton>
              </Tooltip>
            
            
  
                {isAuthenticated() ?
                <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>

                <MenuItem onClick={() => {
                  handleCloseUserMenu();
                  signout(() => {
                    history.push("/signin");
                  })
                }}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
                </Menu>
                :
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                <MenuItem onClick={() =>{
                  handleCloseUserMenu();
                  history.push("/signin");
                }}>
                  <Typography textAlign="center">Signin</Typography>
                </MenuItem>
                </Menu>
                }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
};
export default withRouter(Header);
