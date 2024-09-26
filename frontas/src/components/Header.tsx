import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/api/Context'; // Import useAuth hook

const Header: React.FC = () => {
  const { role } = useAuth(); // Get the current user's role

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Vinječių sistema
        </Typography>
        <Box>
          {/* Show Login button only if the user is not logged in */}
          {!role && (
            <Button color="inherit" component={Link} to="/">
              Prisijungti
            </Button>
          )}

          {/* Super Administratorius Buttons */}
          {role === 'super administratorius' && (
            <>
              <Button color="inherit" component={Link} to="/userlist">
                Naudotojų sąrašas
              </Button>
              <Button color="inherit" component={Link} to="/universitylist">
                Universitetų sąrašas
              </Button>
              <Button color="inherit" component={Link} to="/facultylist">
                Fakultetų sąrašas
              </Button>
              <Button color="inherit" component={Link} to="/grouplist">
                Grupių sąrašas
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
            <>
            <Button color="inherit" component={Link} to="/adduserlist">
              Pridėti grupiokus
            </Button>
            <Button color="inherit" component={Link} to="/addgroup">
              Sukurti grupe
            </Button>
            </>
          )}

          {/* Show Logout button only if the user is logged in */}
          {role && (
            <Button color="inherit" component={Link} to="/logout">
              Atsijungti
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
