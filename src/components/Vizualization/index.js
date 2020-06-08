import React from 'react';
import styled from 'styled-components';

import LineGraph from '../Graphs/LineGraph';
import PieChart from '../Graphs/PieChart';
import StatsText from '../StatsText';
import LoadingAnimation from '../LoadingAnimation';

// labels and colors for various type of data.
const colors = {
    confirmed: {
        color: '#96ceb4',
        label: 'Confirmed Cases',
        word: 'Confirmed'
    },
    active: {
        color: '#ffcc5c',
        label: 'Active Cases',
        word: 'Active'
    },
    deaths: {
        color: '#ff6f69',
        label: 'Death Cases',
        word: 'Deaths'
    },
    recovered: {
        color: '#88d8b0',
        label: 'Recovered Cases',
        word: 'Recovered'
    },
    new_confirmed: {
        color: '#ffcc5c',
        label: 'New Confirmed Cases'
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

const TextWrapper = styled.p`
    font-family: Montserrat;

    font-size: 16px;

    @media (max-width: 800px){
        font-size: 14px;
    }

    text-align: center;

    margin: 30vh auto;

    max-width: 80%;

    overflow-wrap: break-word;
`;

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
const Country = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;

    img {
        height: 32px;
        width: auto;
        outline: solid black 1px;
        @media (max-width: 600px) {
            height: 26px;
        }
    }

    h1 {
        font-family: Lilita One;
        font-size: 36px;
        text-transform: uppercase;
        text-align: center;

        @media (max-width: 600px) {
            font-size: 28px;
        }

        margin: 0 10px 0 0;
    }
`;

/* styled h1 for country name */
const Label = styled.h1`
    font-family: Montserrat;
    font-size: 20px;
    text-align: center;
    margin: 20px 0;

    @media (max-width: 600px) {
        font-size: 18px;
    }
`;

// a seperator div to give space between elements
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
            screenWidth: window.innerWidth,
        }

        /* binding this to the functions */
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
    }

    componentWillUnmount() {
        /* removing event listener when component closes*/
        window.removeEventListener('resize', this.updateWidth);
    }

    render(){
        /* gets required fields from the fetched data*/        
        const data = this.props.data;
        const flag = this.props.flag;
        return (
            <Wrapper>
                <Country>
                    <h1>{data?data.data.name:'Loading'}</h1>
                    {flag?<img src={flag} width='60' height='60' alt=''></img>:<></>}
                </Country>
                {
                    data?(
                        (data.data.timeline.length>0)?(
                            <>
                                <Seperator>
                                    {/* Stats */}
                                    <StatsText 
                                        data={data?data.data.timeline[0]:[]}
                                        display={['confirmed','active','recovered','deaths']}
                                        labels={colors} 
                                        divClass='horizontal-wrapper'
                                    />
                                    {/* Pie Chart */}
                                    <PieChart
                                        data={data?data.data.timeline[0]:[]} 
                                        lastUpdated={data?data.data.timeline[0].updated_at:-1}
                                        draw={['active','recovered','deaths']}
                                        color={colors}
                                    />
                                </Seperator>
                                <Seperator>
                                    {/* Line Graph */}
                                    <LineGraph 
                                        data={data} 
                                        screenWidth={this.state.screenWidth} 
                                        draw={['confirmed','active']}
                                        color={colors}
                                    />
                                </Seperator>
                                <Seperator>
                                    <Label>New Cases per Day:</Label>
                                    <LineGraph 
                                        data={data} 
                                        screenWidth={this.state.screenWidth} 
                                        draw={['new_confirmed']}
                                        color={colors}
                                    />
                                </Seperator>
                                <Seperator>
                                    <Label>New Recovered Cases and Deaths per Day:</Label>
                                    <LineGraph 
                                        data={data} 
                                        screenWidth={this.state.screenWidth} 
                                        draw={['new_recovered', 'new_deaths']}
                                        color={colors}
                                    />
                                </Seperator>
                            </>
                        ):(
                            // if there are no cases recorded in a country
                            <TextWrapper>No Case Reported :)</TextWrapper>
                        )
                    ):(
                        // if data is being loaded, or null
                        <LoadingAnimation />
                    )
                }
            </Wrapper>
        );
    }
}

//  --> React Class component ends <--

export default Visualization;