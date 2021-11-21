import React from 'react';
import styled from 'styled-components';
import { tokenToString } from '../../timeUtils/time-parser';

interface Props {
  inputValue: string[];
  outputValue: string;
}

export const Display: React.FC<Props> = ({ inputValue, outputValue }) => {
  return <DisplayWrapper>
    <DisplayInput type="text" value={tokenToString(inputValue)} onChange={() => {}}/>
    <DisplayOutput>{outputValue}</DisplayOutput>  
  </DisplayWrapper>;
}

const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #eee;
  border-radius: 20px;
  width: 100%;
  height: 38%;
`;

const BaseInput = styled.input`
  background: none;
  border: none;
  padding 4px 12px;
  &:focus {
    outline: none;
  }
`;

const DisplayInput = styled(BaseInput)`
  font-size: 36px;
  margin-top: 10%;
`;

const DisplayOutput = styled.div`
  font-size: 30px;
  padding 4px 12px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5%;
`;