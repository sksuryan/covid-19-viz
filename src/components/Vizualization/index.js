import React from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

import LineGraph from '../LineGraph';

/* A styled Wrapper div for every other element in the component*/
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 80%;

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
    justify-content: center;

    flex-direction: ${props => props.screenWidth>800?'row':'column'};

    /* keeps label and value in the same line*/
    .horizontal-wrapper{
        display: flex;
        align-self: center;
        justify-content: center;

        padding: 6px 30px;
    }

    .vertical-wrapper {
        display: flex;
        align-self: center;
        justify-content: center;
        flex-direction: column;
        
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

class Visualization extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            data: null,
        }

        // this.handleClick = this.handleClick.bind(this);

    }

    componentDidMount(){
        /* requests for fetching data upon website is rendered completely */
        d3.json('https://corona-api.com/countries/us?include=timeline')
            .then((data) => this.setState({data}))
            .catch((err) => console.log(err));
    }

    /* a temporary function */
    // handleClick(e){
    //     d3.json(`https://corona-api.com/countries/${e.target.value}?include=timeline`)
    //         .then((data) => this.setState({data}))
    //         .catch((err) => console.log(err));
    // }

    render(){

        /* gets required fields from the fetched data*/
        const {new_confirmed, new_recovered, new_deaths} = this.state.data?this.state.data.data.timeline[0]
            :{
                new_confirmed: null, 
                new_recovered: null, 
                new_deaths: null
            };

        return (
            <Wrapper>
                <Country>{this.state.data?this.state.data.data.name:'Loading'}</Country>
                <Cases screenWidth={this.props.screenWidth}>
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
                <LineGraph data={this.state.data} screenWidth={this.props.screenWidth}/>
                {/* temporary elements */}
                {/* <button onClick={this.handleClick} value='in'>in</button>
                <button onClick={this.handleClick} value='us'>us</button>
                <button onClick={this.handleClick} value='cn'>cn</button> */}
            </Wrapper>
        );
    }
}

export default Visualization;