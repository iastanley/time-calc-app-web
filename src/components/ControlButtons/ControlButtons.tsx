import React from 'react';
import styled from 'styled-components';

export const ControlButtons: React.FC = () => {
  return <ControlButtonWrapper></ControlButtonWrapper>
}

const ControlButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10%;
  width: 100%;
`;