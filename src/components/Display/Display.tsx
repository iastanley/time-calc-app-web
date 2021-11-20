import React from 'react';
import styled from 'styled-components';

interface Props {
  inputValue: string[];
  outputValue: string;
}

const OPERATOR_TOKENS = ['to', '+', '-'];

export function tokenToString(tokens: string[]): string {
  let output = ''
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (OPERATOR_TOKENS.includes(token)) {
      output += ` ${token} `;
    } else {
      output += token;
    }
  }
  return output;
}

export const Display: React.FC<Props> = ({ inputValue, outputValue }) => {
  return <DisplayWrapper>
    <DisplayInput type="text" value={tokenToString(inputValue)}/>
    <DisplayOutput type="text" value={outputValue}/>  
  </DisplayWrapper>;
}

const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #eee;
  border-radius: 20px;
  width: 100%;
  height: 40%;
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
  flex: 4;
  font-size: 36px;
`;

const DisplayOutput = styled(BaseInput)`
  flex: 1;
`;