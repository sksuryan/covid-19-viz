import React from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

// --> Styled Components start <--
/* a styled path component*/
const Path = styled.path`
    fill: none;
    stroke: ${props => props.stroke};
    stroke-width: 2px;
`;

/* a styled component for legend for graph */
const Legend = styled.div`
    display: grid;

    max-width: 1000px;
    margin: 0 auto;

    grid-auto-flow: column;
    grid-auto-columns: 250px;

    @media (max-width: 600px) {
        grid-auto-flow: row;
    }

    /* css for svg inside Legend */
    svg{
        width: 100%;
        height: 20px;
        margin-bottom: 8px;

        /* css for text inside svg inside Legend*/
        text{
            font-family: 'Montserrat';
            font-size: 14px;
        }
    }
`;
// --> Styled Components end <--

// --> React Class Component start <--
class LineGraph extends React.Component{
    constructor(props){
        super(props);

        /* references to access virtual DOM elements in D3*/
        this.xAxis = React.createRef();
        this.yAxis = React.createRef();

        /* Defining scales for D3.js */
        this.xScale = d3.scaleUtc();
        this.yScale = d3.scaleLinear();

        /* Defining width, height and margin of SVG */
        this.width = 700;
        this.previousWidth = 0;
        this.height = 475;
        this.margin = {
            left: 50,
            right: 25,
            top: 15,
            bottom: 75
        };

        /* empty string to use later*/
        this.pathData = [];

        /* Binding createGraph() with this */
        this.createGraph = this.createGraph.bind(this);

        this.state = {
            reload: true
        }
    }

    componentDidMount(){
        /* checking if this.props.data exists or not*/
        if(this.props.data)
            this.createGraph();
    }

    componentDidUpdate(prevProps){
        if(this.props.data) {
            /* retriving last updated value from previous props*/
            const prevUpdate = prevProps.data? prevProps.data.data.updated_at : null;
            /* retriving last updated value from current props*/
            const current = this.props.data.data.updated_at;
            /* checking if both of them are equal*/
            if(current !== prevUpdate || this.previousWidth !== this.width)
                this.createGraph();
        }
    }

    createGraph(){
        /* extracting data from props*/
        const data = this.props.data.data.timeline;
        const metric = this.props.metric;
        const toDraw = this.props.draw;

        this.pathData = [];

        /* setting up domain and range for X axis*/
        /* min and max of Date */
        const extent = d3.extent(data, d => Date.parse(d.date));
        this.xScale.domain(extent)
            .range([this.margin.left,this.width - this.margin.right]);

        /* setting up domain and range for y axis */
        this.yScale.domain(d3.extent(data, d => d[metric]))
            .range([this.height-this.margin.bottom,this.margin.top]);

        /* creating a xAxis function*/
        const xAxis = d3.axisBottom().scale(this.xScale);

        /* reducing the number of ticks by changing the tick format*/
        if(window.innerWidth < 600)
            xAxis.ticks(d3.utcMonth);

        /* creating a yAxis function */
        const yAxis = d3.axisLeft().scale(this.yScale);

        toDraw.forEach(elt => {
            this.pathData.push(
                d3.line()
                    .x(d => this.xScale(Date.parse(d.date)))
                    .y(d => this.yScale(d[elt]))(data)
            )
        });

        /* creating xAxis */
        d3.select(this.xAxis.current)
            .call(xAxis)
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
            });
        /* creating yAxis */
        d3.select(this.yAxis.current)
            .call(yAxis);

        /* saving the current width for comparision when width changes later */
        this.previousWidth = this.width;

        /* updating the state to trigger re-render*/
        this.setState({
            reload: true
        })
    }

    /* render() function returning necessary elements*/
    render(){
        const color = this.props.color;
        const draw = this.props.draw;
        return (
            <>
                <Legend>
                    {
                        draw.map((elt,i) => 
                            <svg key={i}>
                                <circle cx='60' cy='10' r='6' fill={color[elt].color}></circle>
                                <text x='80' y='14' className='legend'>{color[elt].label}</text>
                            </svg>
                        )
                    }
                </Legend>
                <svg width={this.width = window.innerWidth>800?700:window.innerWidth*0.8} height={this.height}>
                    {/* Path DOM element for line*/}
                    {
                        this.pathData.map( (elt,i) =>
                            <Path key={i} stroke={color[draw[i]].color} d={elt}/>
                        )
                    }
                    {/* xAxis */}
                    <g ref={this.xAxis} transform={`translate(0,${this.height-this.margin.bottom})`}></g>
                    {/* yAxis */}
                    <g ref={this.yAxis} transform={`translate(${this.margin.left},0)`}></g>
                </svg>
            </>
        );
    }
}

// --> React Class Component ends <--

export default LineGraph;