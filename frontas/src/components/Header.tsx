import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
          <Button color="inherit" component={Link} to="/addmaster">
            Add Master
          </Button>
          <Button color="inherit" component={Link} to="/adduserlist">
            Add User List
          </Button>
          <Button color="inherit" component={Link} to="/photographerlist">
            Photographer List
          </Button>
          <Button color="inherit" component={Link} to="/editorpage">
            Editor List
          </Button>
          <Button color="inherit" component={Link} to="/uservignettes">
            User Vignettes
          </Button>
          <Button color="inherit" component={Link} to="/adminorders">
            Admin Orders
          </Button>
          <Button color="inherit" component={Link} to="/choosedate">
            Choose Date
          </Button>
          <Button color="inherit" component={Link} to="/adminlist">
            Admin List
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;