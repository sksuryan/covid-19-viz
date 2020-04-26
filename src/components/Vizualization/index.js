import React from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

import LineGraph from '../LineGraph';
import PieChart from '../PieChart';

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

/* A styled component to style stats*/
const Cases = styled.div`
    display: flex;
    align-self: center;
    justify-content: ${props => props.justify?props.justify:'center'};

    width: ${props => props.width?props.width:'none'};

    flex-direction: ${props => props.dir?props.dir:'row'};

    margin-top: ${props => props.margin?props.margin:0};

    @media (max-width: 800px){
        flex-direction: column;
        justify-content: center;
        width: fit-content;
    }

    /* keeps label and value in the same line*/
    .horizontal-wrapper{
        display: flex;
        align-self: center;
        justify-content: center;

        padding: 6px 30px;
    }

    /* seperates labels and values */
    .vertical-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 6px 12px;
    }

    /* styles the value, a class count should be given to the value*/
    .count {
        font-family: 'Lilita One';
        font-size: 18px;

        margin: 0;
    }

    /* styles the label, a class type should be given to the label*/
    .type {
        font-family: 'Montserrat';
        font-size: 16px;

        padding: 0 6px 0 0;
        margin: 0;
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
        const {new_confirmed, new_recovered, new_deaths} = this.state.data?this.state.data.data.timeline[0]
            :{
                new_confirmed: null, 
                new_recovered: null, 
                new_deaths: null
            };
        
        const data = this.state.data;

        const lastUpdated = data?data.data.timeline[0].updated_at:-1;
        
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

        let latest2 = data?{
            confirmed: data.data.timeline[0].confirmed,
            active: data.data.timeline[0].active,
            recovered: data.data.timeline[0].recovered,
            deaths: data.data.timeline[0].deaths,
        }:null;

        return (
            <Wrapper>
                <Country>{this.state.data?this.state.data.data.name:'Loading'}</Country>
                <Cases>
                    <div className='horizontal-wrapper'>
                        <h1 className='type'>New Confirmed Cases: </h1>
                        <h1 className='count'>{new_confirmed !== null? new_confirmed : 'NA'}</h1>
                    </div>
                    <div className='horizontal-wrapper'>
                        <h1 className='type'>New Recovered Cases: </h1>
                        <h1 className='count'>{new_recovered !== null? new_recovered : 'NA'}</h1>
                    </div>
                    <div className='horizontal-wrapper'>
                        <h1 className='type'>New Death Cases: </h1>
                        <h1 className='count'>{new_deaths !== null? new_deaths : 'NA'}</h1>
                    </div>
                </Cases>
                <LineGraph data={this.state.data} screenWidth={this.state.screenWidth}/>
                <Cases width='750px' justify='space-evenly' margin='40px'>
                    <PieChart data={latest} lastUpdated={lastUpdated}/>
                    <Cases dir='column'>
                        <div className='vertical-wrapper'>
                            <h1 className='type'>Confirmed Cases: </h1>
                            <h1 className='count'>{latest2? latest2.confirmed : 'NA'}</h1>
                        </div>
                        <div className='vertical-wrapper'>
                            <h1 className='type'>Active Cases: </h1>
                            <h1 className='count'>{latest2? latest2.active : 'NA'}</h1>
                        </div>
                        <div className='vertical-wrapper'>
                            <h1 className='type'>Recovered Cases: </h1>
                            <h1 className='count'>{latest2? latest2.recovered : 'NA'}</h1>
                        </div>
                        <div className='vertical-wrapper'>
                            <h1 className='type'>Death Cases: </h1>
                            <h1 className='count'>{latest2? latest2.deaths : 'NA'}</h1>
                        </div>
                    </Cases>
                </Cases>
                {/* temporary elements */}
                {/* <button onClick={this.handleClick} value='in'>in</button>
                <button onClick={this.handleClick} value='us'>us</button>
                <button onClick={this.handleClick} value='cn'>cn</button> */}
            </Wrapper>
        );
    }
}

//  --> React Class component ends <--

export default Visualization;