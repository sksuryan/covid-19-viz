import React from 'react';
import styled from 'styled-components';

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

class Search extends React.Component{
    constructor(props){
        super(props);

        this.defaultSuggestion = 
            <Button 
                key={0} 
                onClick={() => this.onSuggestionSelect('')}
            >
                Global
            </Button>

        this.state = {
            search: '',
            suggestions: [this.defaultSuggestion]
        }

        this.updateSearch = this.updateSearch.bind(this);
    }

    onSuggestionSelect(countryCode){
        this.setState({search: '', suggestions: [this.defaultSuggestion]});
        this.props.loadData(countryCode);
    }

    updateSearch(e){
        const search = e.target.value;
        this.setState({search});
        if(search.length > 0){
            this.showSuggestions(search)
                .then(data => {
                    const suggestions = [];
                    for(let i = 0; i < (data.length>6?6:data.length); i++){
                        suggestions.push(
                            <Button 
                                key={i} 
                                onClick={() => this.onSuggestionSelect(data[i].alpha2Code)}>
                                    {data[i].name}
                            </Button>
                        );
                    }
                    this.setState({suggestions});
                })
                .catch(err => {
                    console.error(err);
                    const suggestions = [<Button key={0}>Country not found</Button>];
                    this.setState({suggestions});
                })
        } else {
            const suggestions = [this.defaultSuggestion];
            this.setState({suggestions});
        }
    }

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