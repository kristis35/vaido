import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/api/Context'; // Import useAuth hook

const Header: React.FC = () => {
  const { role } = useAuth(); // Get the current user's role

  return  (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Application
        </Typography>
        <Box>
          {/* Show Login button only if the user is not logged in */}
          {!role && (
            <Button color="inherit" component={Link} to="/">
              Login
            </Button>
          )}

          {/* Super Administratorius Buttons */}
          {role === 'super administratorius' && (
            <>
              <Button color="inherit" component={Link} to="/userlist">
                User List
              </Button>
              <Button color="inherit" component={Link} to="/universitylist">
                University List
              </Button>
              <Button color="inherit" component={Link} to="/facultylist">
                Faculty List
              </Button>
              <Button color="inherit" component={Link} to="/grouplist">
                Group List
              </Button>
            </>
          )}

          {/* Fotografas Buttons */}
          {role === 'fotografas' && (
            <>
              <Button color="inherit" component={Link} to="/photographerlist">
                Photographer List
              </Button>
              <Button color="inherit" component={Link} to="/photoupload">
                Photo Upload
              </Button>
            </>
          )}

          {/* Seniunas Buttons */}
          {role === 'seniunas' && (
            <Button color="inherit" component={Link} to="/adduserlist">
              Add User List
            </Button>
          )}

          {/* Show Logout button only if the user is logged in */}
          {role && (
            <Button color="inherit" component={Link} to="/logout">
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
