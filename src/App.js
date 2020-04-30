import React from 'react';

import Nav from './components/Nav'
import Visualization from './components/Vizualization'
import styled from 'styled-components';

const Text = styled.p`
  font-family: Montserrat;
  font-size: 14px;

  text-align: center;

  margin: 0 auto;

  margin-top: 30px;
  margin-bottom: 20px;

  max-width: 80%;

  overflow-wrap: break-word;

  a{
    color: #000;
  }
`;

function App(){
  return (
    <div className="App">
      <Nav />
      <Visualization />
      <Text>This website uses data from API graciously provided by <a href='https://about-corona.net'>about-corona.net</a>.</Text>
    </div>
  );
}

export default App;
