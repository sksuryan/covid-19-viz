import React from 'react'
import styled from 'styled-components';

const Logo = styled.h1`
    font-family: Lilita One;
    font-size: 18px;
    color: #000;
    text-decoration: none;

    margin: 0;
    padding: 16px 0 8px 0;

    &:focus {
        outline: none;
    }

    .by-line{
        font-family: 'Montserrat';
        font-size: 14px;
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

const Wrapper = styled.div`
    display: flex;
    justify-content: spaced-around;
    align-items: center;

    width: 90%;
    margin: 0 auto;
`;

const Nav = (props) => {
    return (
        <Wrapper>
            <Logo as='a' href='#'>
                COVID-19<br/>VISUALIZED
                <h1 className='by-line'>by Messy Parameters</h1>
            </Logo>
        </Wrapper>
    );
}

export default Nav;