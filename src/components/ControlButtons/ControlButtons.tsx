import React from 'react';
import styled from 'styled-components';

interface Props {
  updateInput: (char: string) => void;
  toggle24hrTime: () => void;
  is24hrTime: boolean;
}

export const ControlButtons: React.FC<Props> = ({ updateInput, toggle24hrTime, is24hrTime }) => {
  return <ControlButtonWrapper>
    <TimeControlButton 
      isActive={!is24hrTime} 
      onClick={() => updateInput('am')}>am</TimeControlButton>
    <TimeControlButton 
      isActive={!is24hrTime}
      onClick={() => updateInput('pm')}>pm</TimeControlButton>
    <TimeControlButton 
      isActive={is24hrTime}
      onClick={() => toggle24hrTime()}>24hr</TimeControlButton>
    <DurationControlButton onClick={() => updateInput('hr')}>hr</DurationControlButton>
    <DurationControlButton onClick={() => updateInput('min')}>min</DurationControlButton>
    <DurationControlButton onClick={() => updateInput('sec')}>sec</DurationControlButton>
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
  background-color: rgba(242, 201, 76);
`;

const TimeControlButton = styled(ControlButton)<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? 'rgba(86, 204, 242)' : '#F1F1F1'};
  color: ${props => props.isActive ? 'inherit' : '#BDBDBD'};
`