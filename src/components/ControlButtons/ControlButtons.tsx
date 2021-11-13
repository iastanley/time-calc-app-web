import React from 'react';
import styled from 'styled-components';

export const ControlButtons: React.FC = () => {
  return <ControlButtonWrapper>
    <TimeControlButton isActive={true}>am</TimeControlButton>
    <TimeControlButton isActive={true}>pm</TimeControlButton>
    <TimeControlButton isActive={false}>24hr</TimeControlButton>
    <DurationControlButton>hr</DurationControlButton>
    <DurationControlButton>min</DurationControlButton>
    <DurationControlButton>sec</DurationControlButton>
  </ControlButtonWrapper>
}

const ControlButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr;
  height: 15%;
  width: 100%;
  column-gap: 10px;
  row-gap: 10px;
  padding: 10px 0;
`;

const ControlButton = styled.button`
  border: none;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
`

const DurationControlButton = styled(ControlButton)`
  background-color: rgba(242, 201, 76, 0.5);
`;

const TimeControlButton = styled(ControlButton)<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(86, 204, 242, 0.5)' : '#F1F1F1'};
  color: ${props => props.isActive ? 'inherit' : '#BDBDBD'};
`