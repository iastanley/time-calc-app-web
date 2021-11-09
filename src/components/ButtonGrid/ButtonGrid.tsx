import React from 'react';
import styled from 'styled-components';

enum ButtonColor {
  NUMBER = '#C4C4C4',
  OPERATOR = 'rgba(242, 153, 74, 0.5)',
  CONFIRM = 'rgba(111, 207, 151, 0.5)',
  CANCEL = 'rgba(235, 87, 87, 0.5)',
};

interface ButtonConfig {
  displayString: string;
  callback?: () => void;
  color?: ButtonColor;
}

const ButtonsArray: ButtonConfig[] = [
  {
    displayString: '1',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '2',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '3',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: 'to',
    color: ButtonColor.OPERATOR,
  },
  {
    displayString: '4',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '5',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '6',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '+',
    color: ButtonColor.OPERATOR,
  },
  {
    displayString: '7',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '8',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '9',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '-',
    color: ButtonColor.OPERATOR,
  },
  {
    displayString: '.',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '0',
    color: ButtonColor.NUMBER,
  },
  {
    displayString: '<',
    color: ButtonColor.CANCEL,
  },
  {
    displayString: '=',
    color: ButtonColor.CONFIRM,
  },

];

export const ButtonGrid: React.FC = () => {
  return <ButtonGridWrapper>
    {ButtonsArray.map((btnConfig: ButtonConfig) => {
      return <Button color={btnConfig.color}>{btnConfig.displayString}</Button>
    })}
  </ButtonGridWrapper>
}

const ButtonGridWrapper = styled.div`
  height: 50%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  column-gap: 10px;
  row-gap: 10px;
`;

const Button = styled.button`
  border: none;
  border-radius: 20px;
  background: ${props => props.color};
  font-size: 30px;

  &:hover {
    cursor: pointer;
  }
`;