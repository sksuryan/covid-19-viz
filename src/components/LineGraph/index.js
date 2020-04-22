import React from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

/* a styled path component*/
const Path = styled.path`
    fill: none;
    stroke: #4682b4;
    stroke-width: 2px;
`;

class LineGraph extends React.Component{
    constructor(props){
        super(props);

        /* references to access virtual DOM elements in D3*/
        this.xAxis = React.createRef();
        this.yAxis = React.createRef();
        this.line = React.createRef();

        /* Defining scales for D3.js */
        this.xScale = d3.scaleUtc();
        this.yScale = d3.scaleLinear();

        /* Defining width, height and margin of SVG */
        this.width = 700;
        this.previousWidth = 0;
        this.height = 500;
        this.margin = {
            left: 50,
            right: 25,
            top: 50,
            bottom: 50
        };

        /* empty string to use later*/
        this.pathData = '';

        /* Binding createGraph() with this */
        this.createGraph = this.createGraph.bind(this);

        this.state = {
            loading: true
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
            const screenWidth = this.props.screenWidth;
            this.previousWidth = this.width;
            if (screenWidth > 800) {
                this.width = 700;
            } else {
                this.width = screenWidth*0.8;
            }

            if(current !== prevUpdate || this.previousWidth !== this.width)
                this.createGraph();
        }
    }

    createGraph(){
        const data = this.props.data.data.timeline;

        console.log(this.width);

        /* setting up domain and range for X axis*/
        this.xScale.domain(d3.extent(data, d => Date.parse(d.date)))
            .range([this.margin.left,this.width - this.margin.right]);
        /* setting up domain and range for y axis */
        this.yScale.domain(d3.extent(data, d => d.confirmed))
            .range([this.height-this.margin.bottom,this.margin.top]);

        /* creating a xAxis function*/
        const xAxis = d3.axisBottom().scale(this.xScale);
        /* creating a yAxis function */
        const yAxis = d3.axisLeft().scale(this.yScale);

        /* setting up line object that creates line string for confirmed cases */
        const line = d3.line()
            .x(d => this.xScale(Date.parse(d.date)))
            .y(d => this.yScale(d.confirmed));

        /* setting up line object that creates line string for active cases */
        // const secondLine = d3.line()
        //     .x(d => this.xScale(Date.parse(d.date)))
        //     .y(d => this.yScale(d.active));


        /* creating xAxis */
        d3.select(this.xAxis.current)
            .transition()
            .duration(1000)
            .call(xAxis)
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
            });
        /* creating yAxis */
        d3.select(this.yAxis.current).transition().duration(1000).call(yAxis);

        /* generating path string */
        this.pathData = line(data);
        
        /* adding Path string to path element*/
        d3.select(this.line.current)
            .transition()
            .duration(1000)
            .attr('d', this.pathData);

        this.setState({
            loading: false
        });
    }

    /* render() function returning necessary elements*/
    render(){   
        return (
            <svg width={this.width} height={this.height}>
                {/* Path DOM element for line*/}
                <Path ref={this.line} />
                {/* xAxis */}
                <g ref={this.xAxis} transform={`translate(0,${this.height-this.margin.bottom})`}></g>
                {/* yAxis */}
                <g ref={this.yAxis} transform={`translate(${this.margin.left},0)`}></g>
            </svg>
        );
    }
}

export default LineGraph;