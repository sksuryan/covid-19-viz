import React from 'react';
import styled from 'styled-components';

// --> Styled components start <--
//Styled component for Search wrapper
const SearchWrapper = styled.div`
    position: relative;
    display: inline-block;
    align-self: center;

    form{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px black solid;

        input{
            font-size: 14px;
            font-family: Montserrat;
            border: none;
            outline: none;
            width: 240px;
        }

        .search {
            background: none;
            border: none;
            outline: none;
            img {
                width: 20px;
                height: 20px;
            }
            margin-left: 16px;
            cursor: pointer;
        }
    }

    @media (max-width: 800px) {
        margin: 32px;
     }
`;

//style component for suggestions
const Suggestions = styled.div`
    position: absolute;
    display: none;
    z-index: 1;
    margin: 4px;
    width: 100%;
    background: white;

    ${SearchWrapper}:focus-within &{
        display: block;
    }
    
    &:hover {
        display: block;
    }
`;

//styled component for a suggestion
const Button = styled.a`
    display: block;
    padding: 12px;
    margin-bottom: 2px;
    border-radius: 10px;
    border: 1px solid #C0C0C0;

    font-size: 14px;
    font-family: Montserrat;
    font-weight: 600;

    widows: 100%;
    word-break: break-all;
    background: white;
    transition: all ease 0.4s;
    cursor: pointer;

    @media (min-width: 800px) {
        &:hover{
            transform: scale(1.05);
        }
    }
`;
// --> Styled components end <--

// Search component
class Search extends React.Component{
    constructor(props){
        super(props);

        //default suggestion
        this.defaultSuggestion =
            [ 
                <Button key='0'
                    onClick={() => this.onSuggestionSelect('default')}
                >
                    <i className="fas fa-map-marker-alt" style={{marginRight: '8px'}}></i>My Location
                </Button>,
                <Button key='1'
                    onClick={() => this.onSuggestionSelect('')}
                >
                    <i className="fas fa-globe" style={{marginRight: '8px'}}></i>Global
                </Button>                
            ]

        // state containing search query and suggestions
        this.state = {
            search: '',
            suggestions: [...this.defaultSuggestion]
        }

        //binding updateSearch with this.
        this.updateSearch = this.updateSearch.bind(this);
    }

    // update data once a suggestion is selected
    onSuggestionSelect(countryCode){
        this.setState({search: '', suggestions: [this.defaultSuggestion]});
        this.props.loadData(countryCode);
    }

    // updates suggestions based on query
    updateSearch(e){
        const search = e.target.value;
        //rerending input form
        this.setState({search});
        //fetching search query
        if(search.length > 0){
            this.showSuggestions(search)
                .then(data => {
                    const suggestions = [];
                    for(let i = 0; i < (data.length>6?6:data.length); i++){
                        // creating JSX for suggestions
                        suggestions.push(
                            <Button 
                                key={i} 
                                onClick={() => this.onSuggestionSelect(data[i].alpha2Code)}>
                                    {data[i].name}
                            </Button>
                        );
                    }
                    // updating state for rerender
                    this.setState({suggestions});
                })
                .catch(err => {
                    console.error(err);
                    //country not found suugestion if fetch returns a 404
                    const suggestions = [<Button key={0}>Country not found</Button>];
                    this.setState({suggestions});
                })
        } else {
            this.setState({suggestions: this.defaultSuggestions});
        }
    }

    // fetches and results query results
    async showSuggestions(search){
        const API = `https://restcountries.eu/rest/v2/name/${search}?fields=name;alpha2Code;flag`;
        const response = await fetch(API);
        if(response.status === 404)
            throw new Error('Country not found');
        const data = await response.json();
        return data;
    }

    render(){
        return(
            <SearchWrapper>
                    <form className='form' onSubmit={(e) => e.preventDefault()}>
                        {/* input form */}
                        <input
                            className='input'
                            type='text'
                            placeholder='Search'
                            onChange={this.updateSearch}
                            value={this.state.search}
                        >
                        </input>
                        <button className='search' type='submit'><img src='search.svg' alt=''/></button>
                    </form>
                    <Suggestions>
                            {this.state.suggestions}
                    </Suggestions>
            </SearchWrapper>
        );
    }
}

export default Search;