import React from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

// styled component for svg text
const Text = styled.text`
    font-size: 12px;
    font-family: Montserrat;
    text-anchor: middle;
`;

// --> React Class Component starts <--
class PieChart extends React.Component {

    constructor(props){
        super(props);

        // defining width, height and margin of pie chart
        this.previousWidth = 0;
        this.width = 250;
        this.height = 250;
        this.margin = 120;
        
        // binding createChart() with this
        this.createChart = this.createChart.bind(this);

        //an empty array for path string for arcs
        this.arcs = [];
        this.textPosition = [];

        //defining the state object
        this.state = {
            reload: false
        }
    }

    componentDidMount(){
        /* calling the this.createChart() function if data is loaded when component is mounted*/
        if(this.props.data.length !== 0)
            this.createChart();
    }

    componentDidUpdate(prevProps){
        // resizing according to screensize
        this.width = window.innerWidth>600?240:175;
        this.height = window.innerWidth>600?240:175;
        /* checking if the data is available and the same data isn't rendered*/
        if(this.props.data.length !== 0 && (this.props.lastUpdated !== prevProps.lastUpdated || this.previousWidth !== this.width)){
            this.createChart();
        }
    }

    createChart(){
        /* extracting data from props */
        const data = this.props.data;
        const draw = this.props.draw;
        const labels = this.props.color;

        /* creating a function that generates data for arcs*/
        const pie = d3.pie().value(d => data[d]);
        /* generating object for arcs*/
        const pieData = pie(draw);

        /* creating a function that generates path string from pieData*/
        const arc = d3.arc().innerRadius(0).outerRadius(this.width/2);
        /* generating path string from pieData */
        this.arcs = pieData.map(elt => arc(elt));

        this.textPosition = pieData.map((elt,i) => {
            const angle = elt.startAngle + (elt.endAngle-elt.startAngle)/2 - Math.PI/2;
            let x = Math.cos(angle)*(this.width/2+30);
            let y = Math.sin(angle)*(this.width/2+30);

            if(i === 2)
                y = y+18;

            const data = labels[elt.data].word;
            const color = labels[elt.data].color;

            return ({data,color,x,y});
        })

        this.previousWidth = this.width;

        /* updating state to trigger re-rendering of the component*/
        this.setState({
            reload: true
        })
    }

    render() {
        return (
            <svg 
                width={this.width + this.margin}
                height={this.height + this.margin}>
                <g transform={`translate(${(this.width+this.margin)/2},${(this.height+this.margin)/2})`}>
                    {
                        this.arcs.map((elt,i) => 
                            <g key={i}>
                                <path  
                                    d={elt} 
                                    fill={this.textPosition[i].color}
                                    stroke={this.textPosition[i].color}>
                                </path>
                                <Text
                                    x={this.textPosition[i].x}
                                    y={this.textPosition[i].y}
                                >
                                    {this.textPosition[i].data}
                                </Text>
                            </g>
                        )
                    }
                </g>
            </svg>
        );
    }
}
// --> React Class Component ends <--

export default PieChart;