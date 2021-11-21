import React from 'react';
import styled from 'styled-components';
import * as btnColors from '../button-colors';

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
    <NowControlButton onClick={() => updateInput('now')}>now</NowControlButton>
  </ControlButtonWrapper>
}

const ControlButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 2fr;
  grid-template-rows: 1fr 1fr;
  height: 18%;
  width: 100%;
  column-gap: 10px;
  row-gap: 10px;
  padding: 10px 0;
`;

const ControlButton = styled.button`
  border: none;
  border-radius: 25px;
  font-size: 20px;
  cursor: pointer;
`

const DurationControlButton = styled(ControlButton)`
  background-color: ${btnColors.BTN_YELLOW};
`;

const NowControlButton = styled(ControlButton)`
  background-color: ${btnColors.BTN_GREEN};
`;

const TimeControlButton = styled(ControlButton)<{ isActive: boolean }>`
  background-color: ${props => props.isActive ? btnColors.BTN_BLUE : btnColors.BTN_INACTIVE};
  color: ${props => props.isActive ? 'inherit' : btnColors.BTN_TEXT_INACTIVE};
`