import React from 'react';
import styled, { keyframes } from 'styled-components';

const Animate = keyframes`
    0%{
        height: 0;
    }
    50%{
        height: 40px;
    }
    100%{
        height: 0px;    
    }
`;

const Wrapper = styled.div`
    margin: 17% auto;
    display: flex;
    align-items: center;

    height: 40px;

    .element {
        width: 6px;
        height: 40px;
        border-radius: 10px;

        background: black;
        margin: 3px;

        animation: ${Animate} 0.6s infinite;

        &:nth-child(2){
            animation-delay: 0.2s;
        }

        &:nth-child(3){
            animation-delay: 0.4s;
        }
    }
`;

const LoadingAnimation = () => {
    return (
        <Wrapper>
            <div className='element'></div>
            <div className='element'></div>
            <div className='element'></div>
        </Wrapper>
    )
}

export default LoadingAnimation;