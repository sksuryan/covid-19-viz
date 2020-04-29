import React from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

import LineGraph from '../LineGraph';
import PieChart from '../PieChart';
import StatsText from '../StatsText';

//  --> Styled components start <--
/* A styled Wrapper div for every other element in the component*/
const Wrapper = styled.div`
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

    padding: 20px 0;
`;

/* A styled component to Wrap PieChart and Stats*/
const PieChartWrapper = styled.div`
    display: flex;
    align-self: center;
    justify-content: ${props => props.justify?props.justify:'center'};

    width: ${props => props.width?props.width:'none'};

    flex-direction: row;

    margin-top: ${props => props.margin?props.margin:0};

    @media (max-width: 800px){
        flex-direction: column;
        justify-content: center;
        width: fit-content;
    }
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

        this.handleClick = this.handleClick.bind(this);
        /* binding this to the function */
        this.updateWidth = this.updateWidth.bind(this);
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
        /* requests for fetching data upon website is rendered completely */
        d3.json('https://corona-api.com/countries/in?include=timeline')
            .then((data) => this.setState({data}))
            .catch((err) => console.log(err));
    }

    componentWillUnmount() {
        /* removing event listener when component closes*/
        window.removeEventListener('resize', this.updateWidth);
    }

    /* a temporary function */
    handleClick(e){
        d3.json(`https://corona-api.com/countries/${e.target.value}?include=timeline`)
            .then((data) => this.setState({data}))
            .catch((err) => console.log(err));
    }

    render(){
        /* gets required fields from the fetched data*/        
        const data = this.state.data;

        const newData = data?[
            {
                label: 'New Confirmed Cases: ',
                value: data.data.timeline[0].new_confirmed,
            },
            {
                label: 'New Recovered Cases: ',
                value: data.data.timeline[0].new_recovered,
            },
            {
                label: 'New Death Cases: ',
                value: data.data.timeline[0].new_deaths,
            }
        ]:[];
        
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
                            {/* Stats */}
                            <StatsText data={newData} divClass='horizontal-wrapper'/>
                            {/* Line Graph */}
                            <LineGraph data={this.state.data} screenWidth={this.state.screenWidth}/>
                            <PieChartWrapper width='750px' justify='space-evenly' margin='40px'>
                                {/* Pie Chart */}
                                <PieChart data={latest} lastUpdated={data?data.data.timeline[0].updated_at:-1}/>
                                {/* Stats */}
                                <StatsText data={latest2} divClass='vertical-wrapper' dir='column'/>
                            </PieChartWrapper>
                        </>
                    ):(
                        <></>
                    )
                }
            </Wrapper>
        );
    }
}

//  --> React Class component ends <--

export default Visualization;