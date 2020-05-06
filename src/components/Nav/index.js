import React from 'react'
import styled from 'styled-components';

import Search from '../Search';

// --> Styled components start <--
//Styled component for Logo
const Logo = styled.h1`
    font-family: Lilita One;
    font-size: 22px;
    color: #000;
    text-decoration: none;

    margin: 0;
    padding: 16px 0 8px 0;

    &:focus {
        outline: none;
    }

    .by-line{
        font-family: 'Montserrat';
        font-size: 12px;
        font-weight: Lighter;

        margin: 0;

        @media (max-width: 600px) {
            font-size: 11px
        }
    }

    @media (max-width: 600){
        font-weight: lighter;
        font-size: 12px;
    }
`;

// A wrapper component for the Nav
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 90%;
    margin: 18px auto;

    @media (max-width: 800px){
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }
`;
// --> Styled components end <--

// Functional Nav component
const Nav = (props) => {
    return (
        <Wrapper>
            <Logo as='a' href='#'>
                CoViz.
                <h1 className='by-line'>by @sksuryan</h1>
            </Logo>
            <Search loadData={props.loadData}></Search>
        </Wrapper>
    );
}

export default Nav;