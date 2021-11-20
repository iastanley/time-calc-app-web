import React from 'react';
import styled from 'styled-components';

enum ButtonColor {
  NUMBER = '#e1e1e1',
  OPERATOR = 'rgba(242, 153, 74, 0.5)',
  CONFIRM = 'rgba(111, 207, 151, 0.5)',
  CANCEL = 'rgba(235, 87, 87, 0.5)',
};

interface Props {
  updateInput: (token: string) => void;
  removeInput: () => void;
  clearInput: () => void;
  confirm: () => void;
  outputValue: string;
}

interface ButtonConfig {
  displayString: string;
  callback: (props: Props) => void;
  color?: ButtonColor;
}

const ButtonsArray: ButtonConfig[] = [
  {
    displayString: '1',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('1');
    }
  },
  {
    displayString: '2',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('2');
    }
  },
  {
    displayString: '3',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('3');
    }
  },
  {
    displayString: 'to',
    color: ButtonColor.OPERATOR,
    callback: ({ updateInput }) => {
      updateInput(' to ');
    }
  },
  {
    displayString: '4',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('4');
    }
  },
  {
    displayString: '5',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('5');
    }
  },
  {
    displayString: '6',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('6');
    }
  },
  {
    displayString: '+',
    color: ButtonColor.OPERATOR,
    callback: ({ updateInput }) => {
      updateInput('+');
    }
  },
  {
    displayString: '7',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('7');
    }
  },
  {
    displayString: '8',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('8');
    }
  },
  {
    displayString: '9',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('9');
    }
  },
  {
    displayString: '-',
    color: ButtonColor.OPERATOR,
    callback: ({ updateInput }) => {
      updateInput('-');
    }
  },
  {
    displayString: ':',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput(':');
    }
  },
  {
    displayString: '0',
    color: ButtonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('0');
    }
  },
  {
    displayString: '<',
    color: ButtonColor.CANCEL,
    callback: ({ removeInput, clearInput, outputValue }) => {
      if (outputValue.length) {
        clearInput();
      } else {
        removeInput();
      }
    }
  },
  {
    displayString: '=',
    color: ButtonColor.CONFIRM,
    callback: ({ confirm }) => {
      confirm();
    }
  },

];

export const ButtonGrid: React.FC<Props> = (props) => {
  const formatBackButton = (btnDisplayString: string): string => {
    if (btnDisplayString !== '<') {
      return btnDisplayString;
    }

    return props.outputValue.length ? 'C' : '<';
  } 

  return <ButtonGridWrapper>
    {ButtonsArray.map((btnConfig: ButtonConfig) => {
      return <Button key={btnConfig.displayString} color={btnConfig.color} onClick={() => btnConfig.callback(props)}>{formatBackButton(btnConfig.displayString)}</Button>
    })}
  </ButtonGridWrapper>
}

const ButtonGridWrapper = styled.div`
  height: 45%;
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