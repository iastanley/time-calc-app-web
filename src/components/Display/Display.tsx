import React from 'react';
import styled from 'styled-components';

export const Display: React.FC = () => {
  return <DisplayWrapper></DisplayWrapper>;
}

const DisplayWrapper = styled.div`
  background: #e1e1e1;
  border-radius: 10px;
  width: 100%;
  height: 40%;
`;