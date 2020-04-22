import React from 'react';

import Nav from './components/Nav'
import Visualization from './components/Vizualization'

class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      screenWidth: window.innerWidth,
    }

    this.updateWidth = this.updateWidth.bind(this);
  }

  componentDidMount(){
    window.addEventListener("resize", this.updateWidth);
    this.updateWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }

  updateWidth(){
    this.setState({
      screenWidth: window.innerWidth,
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Nav />
        <Visualization screenWidth={this.state.screenWidth}/>
      </div>
    );
  }
}

export default App;
