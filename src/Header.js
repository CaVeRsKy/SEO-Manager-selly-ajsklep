import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Menedżer SEO
          </Typography>
          <Button color="inherit">Strona główna</Button>
          <Button color="inherit">O nas</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
