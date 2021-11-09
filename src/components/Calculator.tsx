import React from 'react';
import styled from 'styled-components';
import { Display } from './Display/Display';
import { ControlButtons } from './ControlButtons/ControlButtons';
import { ButtonGrid } from './ButtonGrid/ButtonGrid';

const Calculator: React.FC = () => {
  return <CalculatorWrapper>
    <Display />
    <ControlButtons />
    <ButtonGrid />
  </CalculatorWrapper>;
}

export default Calculator;

const CalculatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 800px;
  margin: 150px auto;
  border: 2px solid #aaaaaa;
  border-radius: 20px;
  padding: 15px;
`;
CalculatorWrapper.displayName = 'Calculator';