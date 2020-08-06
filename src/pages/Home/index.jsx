import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  Button
} from 'react-bootstrap';

const Home = () => (
  <div className="d-flex vh-100 align-items-center justify-content-center">
    <Button
      variant="primary"
      as={Link}
      to="/worksheet"  
    >
      Worksheet
    </Button>
  </div>
);

export default Home;