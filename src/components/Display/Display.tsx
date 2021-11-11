import React from 'react';
import styled from 'styled-components';

export const Display: React.FC = () => {
  return <DisplayWrapper></DisplayWrapper>;
}

const DisplayWrapper = styled.div`
  background: #eee;
  border-radius: 20px;
  width: 100%;
  height: 40%;
`;