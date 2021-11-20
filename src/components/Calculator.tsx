import React, { useState } from 'react';
import styled from 'styled-components';
import { Display } from './Display/Display';
import { ControlButtons } from './ControlButtons/ControlButtons';
import { ButtonGrid } from './ButtonGrid/ButtonGrid';

const Calculator: React.FC = () => {
  const [ inputValue, setInputValue ] = useState<string[]>([]);
  const [ outputValue, setOutputValue ] = useState('');
  const [ is24hrTime, setIs24hrTime ] = useState(false);

  const handleUpdateInput = (token: string) => {
    setInputValue(inputValue.concat(token));
  }

  const handleRemoveInput = () => {
    setInputValue(inputValue.slice(0, -1));
  }

  const handleClearInput = () => {
    setInputValue([]);
    setOutputValue('');
  }

  const handleToggle24hrTime = () => {
    setIs24hrTime(!is24hrTime);
  }

  const handleConfirm = () => {
    console.log('current input', inputValue);
    setOutputValue('output');
  }

  return <CalculatorWrapper>
    <Display inputValue={inputValue} outputValue={outputValue}/>
    <ControlButtons is24hrTime={is24hrTime} updateInput={handleUpdateInput} toggle24hrTime={handleToggle24hrTime}/>
    <ButtonGrid 
      updateInput={handleUpdateInput}
      removeInput={handleRemoveInput}
      clearInput={handleClearInput}
      confirm={handleConfirm}
      />
  </CalculatorWrapper>;
}

export default Calculator;

const CalculatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 800px;
  margin: 150px auto;
  border: 2px solid #ddd;
  border-radius: 20px;
  padding: 15px;

  @media (max-width: 800px) {
    margin: 0;
    width: 100%;
    height: 100vh;
    border: none;
  }
`;
CalculatorWrapper.displayName = 'Calculator';