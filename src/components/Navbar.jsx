import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/slice/UserSlice'
import { useState } from 'react';
import axios from 'axios';


const pages = ['Profile', 'SignIn', 'SignUp'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
  let dispatch = useDispatch()
  let [searchUsers, setSearchUsers] = useState([])
  let data = useSelector((state) => state.user)
  console.log(data.user)
  let login = data.login

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  let [search, setSearch] = useState([])
  const handleSearch = async (e) => {
    console.log(e.target.value)
    let users = await axios.get(`http://127.0.0.1:3000/users/search?name=${e.target.value}`)
    setSearch(users.data.user)
  }

  return (
    <div className='fixed w-screen z-10'>
      <AppBar position="static" sx={{ backgroundColor: 'rgb(30, 41, 59)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
            <Link to='/'>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Fire
              </Typography>
            </Link>


            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                sx={{ display: { xs: 'block', md: 'none' } }} className='w-auto text-black'>
                {/* {pages.map((page) => (
                page==='Profile' && login===true?
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>:
                <MenuItem key={page} onClick={handleCloseNavMenu}>{page}</MenuItem>
              ))} */}
                {pages.map((page) => (
                  page === 'Profile' && login === true ?
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ color: { xs: 'black' }, display: 'block', px: 4, py: 2 }}
                    >
                      {page}
                    </Button> :
                    login === false && page !== 'Profile' &&
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ color: { xs: 'black' }, display: 'block', px: 4, py: 2 }}
                    >
                      {page}
                    </Button>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              to='/'
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Fire
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'center', alignItems: 'center' } }}>

              <div className='mx-auto relative'>
                <input type="text" placeholder='Search' onChange={handleSearch} className='border-1 border-blue-400 outline-none py-2 px-6 text-black rounded-md' name="" id="" />

                {search && <div className='flex flex-col gap-4 h-auto overflow-y-auto min-w-full bg-cyan-800 absolute rounded-b-md'>
                  {search?.map((user, key) => (
                    data?.user?.userDetails?._id !== user._id && <Link className='flex p-1 gap-2 justify-center items-center py-2' key={key} to={`/userPage?name=${user.name}`} state={user} onClick={() => setSearch([])}>
                      <img src={user.profilePic} className='rounded-full h-10' alt="" />
                      <div>
                        <p>{user.name}</p>
                        <p className='text-[12px] w-40'>{user.bio}</p>
                      </div>
                    </Link>
                  ))}
                </div>}
              </div>

              <div className='w-auto flex gap-4 mr-2 text-white'>
                {pages.map((page) => (
                  page === 'Profile' && login === true ?
                    <Link
                      key={page} to='/profile'
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                      className='mr-10'
                    >
                      {page}
                    </Link> :
                    login === false && page !== 'Profile' &&
                    <Link
                      key={page}
                      to={page == 'SignUp' ? '/register' : '/login'}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {page}
                    </Link>
                ))}
              </div>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={data.user.userDetails?.profilePic || ''} />
                </IconButton>
              </Tooltip>
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
                {settings.map((setting) => (
                  setting === 'Profile' && login == true ?
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Link to='/profile' >
                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                      </Link>
                    </MenuItem>
                    : setting == 'Logout' && login === true ? <MenuItem key={setting} onClick={() => dispatch(logout())}>
                      <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>

                      : (setting !== 'Logout' && login === false && setting !== 'Profile') && <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                      </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
export default React.memo(Navbar);
