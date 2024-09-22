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
          My Application
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {/* Super Administratorius Buttons */}
          {role === 'super administratorius' && (
            <>
              <Button color="inherit" component={Link} to="/addmaster">
                Add Master
              </Button>
              <Button color="inherit" component={Link} to="/adminorders">
                Admin Orders
              </Button>
              <Button color="inherit" component={Link} to="/adminlist">
                Admin List
              </Button>
              <Button color="inherit" component={Link} to="/editgroup">
                Edit Group
              </Button>
              <Button color="inherit" component={Link} to="/votingpage">
                Voting Page
              </Button>
              <Button color="inherit" component={Link} to="/editorspage">
                Editor Page
              </Button>
              <Button color="inherit" component={Link} to="/uservignettes">
                User Vignettes
              </Button>
              <Button color="inherit" component={Link} to="/choosedate">
                Choose Date
              </Button>
              <Button color="inherit" component={Link} to="/photographerlist">
                Photographer List
              </Button>
              <Button color="inherit" component={Link} to="/photoupload">
                Photo Upload
              </Button>
              <Button color="inherit" component={Link} to="/adduserlist">
                Add User List
              </Button>
              <Button color="inherit" component={Link} to="/userlist">
                User List
              </Button>
              <Button color="inherit" component={Link} to="/addgroup">
                Add Group
              </Button>
              <Button color="inherit" component={Link} to="/addfaculty">
                Add Faculty
              </Button>
              <Button color="inherit" component={Link} to="/adduniversity">
                Add University
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
