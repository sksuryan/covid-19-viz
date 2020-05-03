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

class App extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            data: null
        }

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){
        /* calling fetchData function after component is mounted. */
        this.fetchGlobalData()
            .then(data => setTimeout(() => this.setState({data}),750))
            .catch(err => console.error(err));
    }

    loadData(countryCode){
        this.setState({data: null});
        if(countryCode === ''){
            this.fetchGlobalData()
                .then(data => setTimeout(() => this.setState({data}),750))
                .catch(err => console.error(err));
        } else {
            this.fetchData(countryCode)
                .then(data => setTimeout(() => this.setState({data}),750))
                .catch(err => console.error(err));
        }
    }

    async fetchGlobalData(){
        const API = `https://corona-api.com/timeline`;
        const response = await fetch(API);
        if(response.status !== 200) {
            throw new Error('Resource not found');
        }
        let data = await response.json();

        data = data.data;
        data = {name:'Global',timeline: data};
        data = {data};

        return data;
    }

    /* asynchronously fetching data from API */
    async fetchData(countryCode){
        const API = `https://corona-api.com/countries/${countryCode}?include=timeline`;
        const response = await fetch(API);
        if(response.status !== 200) {
            throw new Error('Resource not found');
        }
        const data = await response.json();
        return data;
    }

    render(){
        return (
            <div className="App">
                <Nav loadData={this.loadData}/>
                <Visualization data={this.state.data}/>
                <Text>This website uses data from APIs graciously provided by <a href='https://about-corona.net' rel="noopener noreferrer" target='_blank'>about-corona.net</a> and <a href='https://restcountries.eu/' rel="noopener noreferrer" target='_blank'>Rest Countries</a>.</Text>
                <Text>made with ❤ by <a href='https://thecodelife.science.blog' rel="noopener noreferrer" target='_blank'>@sksuryan</a></Text>
            </div>
        );
    }
}

export default App;
