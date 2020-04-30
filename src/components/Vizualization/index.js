import React from 'react';
import styled from 'styled-components';

import LineGraph from '../Graphs/LineGraph';
import PieChart from '../Graphs/PieChart';
import StatsText from '../StatsText';
import LoadingAnimation from '../LoadingAnimation';

const colors = {
    confirmed: {
        color: '#96ceb4',
        label: 'Confirmed Cases'
    },
    active: {
        color: '#ffcc5c',
        label: 'Active Cases'
    },
    deaths: {
        color: '#ff6f69',
        label: 'Death Cases',
    },
    recovered: {
        color: '#88d8b0',
        label: 'Recovered Cases'
    },
    new_confirmed: {
        color: '#ffcc5c',
        label: 'New Cases'
    },
    new_deaths: {
        color: '#ff6f69',
        label: 'New Death Cases'
    },
    new_recovered: {
        color: '#88d8b0',
        label: 'New Recovered Cases'
    }
}

//  --> Styled components start <--
/* A styled Wrapper div for every other element in the component*/
const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 80%;
    max-width: 80%;

    margin: 0 auto;
    margin-top: 20px;
`;

/* styled h1 for country name */
const Country = styled.h1`
    font-family: Lilita One;
    font-size: 36px;
    text-transform: uppercase;

    margin: 0;
`;

/* styled h1 for country name */
const Label = styled.h1`
    font-family: Lilita One;
    font-size: 28px;
    text-transform: uppercase;
    text-align: center;
    margin: 20px 0;
`;

const Seperator = styled.div`
    margin: 20px 0;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

//  --> Styled components end <--


// --> React Class Component starts <--
class Visualization extends React.Component{

    constructor(props){
        super(props);

        /* defining state object */
        this.state = {
            data: null,
            screenWidth: window.innerWidth,
        }

        /* binding this to the functions */
        this.updateWidth = this.updateWidth.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }    

    /* function to update state when window is resized*/
    updateWidth(){
        this.setState({
            screenWidth: window.innerWidth,
            }
        );
    }

    componentDidMount(){
        /* adding an event listener to trigger actions when window is resized*/
        window.addEventListener("resize", this.updateWidth);
        this.updateWidth();
        /* calling fetchData function after component is mounted. */
        this.fetchData('in')
            .then(data => setTimeout(() => this.setState({data}),750))
            .catch(err => console.error(err));
    }

    /* asynchronously fetching data from API */
    async fetchData(countryCode){
        const response = await fetch(`https://corona-api.com/countries/${countryCode}?include=timeline`);
        if(response.status !== 200) {
            throw new Error('Resource not found');
        }
        const data = await response.json();
        return data;
    }

    componentWillUnmount() {
        /* removing event listener when component closes*/
        window.removeEventListener('resize', this.updateWidth);
    }

    render(){
        /* gets required fields from the fetched data*/        
        const data = this.state.data;
        
        let latest = data?[
            {
                key: 'Active',
                value: data.data.timeline[0].active,
            },
            {
                key: 'Recovered',
                value: data.data.timeline[0].recovered,
            },
            {
                key: 'Deaths',
                value: data.data.timeline[0].deaths,
            }
        ]:[];

        let latest2 = data?[
            {
                label: 'Confirmed Cases: ',
                value: data.data.timeline[0].confirmed,
            },
            {
                label: 'Active Cases: ',
                value: data.data.timeline[0].active,
            },
            {
                label: 'Recovered Cases: ',
                value: data.data.timeline[0].recovered,
            },
            {
                label: 'Death Cases: ',
                value: data.data.timeline[0].deaths,
            }
        ]:null;

        return (
            <Wrapper>
                <Country>{this.state.data?this.state.data.data.name:'Loading'}</Country>
                {
                    this.state.data?(
                        <>
                            <Seperator>
                                {/* Stats */}
                                <StatsText data={latest2} divClass='horizontal-wrapper'/>
                                {/* Pie Chart */}
                                <PieChart data={latest} lastUpdated={data?data.data.timeline[0].updated_at:-1}/>
                            </Seperator>
                            <Seperator>
                                {/* Line Graph */}
                                <LineGraph 
                                    data={this.state.data} 
                                    screenWidth={this.state.screenWidth} 
                                    metric='confirmed' 
                                    draw={['confirmed','active']}
                                    color={colors}
                                />
                            </Seperator>
                            <Seperator>
                                <Label>New Cases per Day:</Label>
                                <LineGraph 
                                    data={this.state.data} 
                                    screenWidth={this.state.screenWidth} 
                                    metric='new_confirmed' 
                                    draw={['new_confirmed']}
                                    color={colors}
                                />
                            </Seperator>
                            <Seperator>
                            <Label>New Recovered Cases and Deaths per Day:</Label>
                            <LineGraph 
                                data={this.state.data} 
                                screenWidth={this.state.screenWidth} 
                                metric='new_recovered' 
                                draw={['new_recovered', 'new_deaths']}
                                color={colors}
                            />
                            </Seperator>
                        </>
                    ):(
                        <LoadingAnimation />
                    )
                }
            </Wrapper>
        );
    }
}

//  --> React Class component ends <--

export default Visualization;