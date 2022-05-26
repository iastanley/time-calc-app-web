import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Display } from './Display/Display';
import { ControlButtons } from './ControlButtons/ControlButtons';
import { ButtonGrid } from './ButtonGrid/ButtonGrid';
import { TimeParser } from '../timeUtils/time-parser';

const Calculator: React.FC = () => {
  const [ inputValue, setInputValue ] = useState<string[]>([]);
  const [ outputValue, setOutputValue ] = useState('');
  const [ is24hrTime, setIs24hrTime ] = useState(false);

  const timeParserRef = useRef<TimeParser>();
  timeParserRef.current = new TimeParser(is24hrTime);

  useEffect(() => {
      timeParserRef.current?.set24hrTime(is24hrTime);
  }, [is24hrTime]);

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
    if (timeParserRef.current) {
      const output = timeParserRef.current.evaluateExpression(inputValue);
      setOutputValue(output);
    }
  }

  return <CalculatorWrapper>
    <Display inputValue={inputValue} outputValue={outputValue}/>
    <ControlButtons is24hrTime={is24hrTime} updateInput={handleUpdateInput} toggle24hrTime={handleToggle24hrTime}/>
    <ButtonGrid 
      updateInput={handleUpdateInput}
      removeInput={handleRemoveInput}
      clearInput={handleClearInput}
      confirm={handleConfirm}
      outputValue={outputValue}
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
  border-radius: 20px;
  padding: 15px 15px 30px 15px;
  background: #414141;

  @media (max-width: 800px) {
    margin: 0;
    width: 100%;
    height: 100vh;
    border-radius: initial;
  }
`;
CalculatorWrapper.displayName = 'Calculator';