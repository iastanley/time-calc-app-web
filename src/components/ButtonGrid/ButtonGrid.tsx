import React from 'react';
import styled from 'styled-components';
import * as btnColors from '../button-colors';

const buttonColor = {
  NUMBER: btnColors.BTN_GRAY,
  OPERATOR: btnColors.BTN_ORANGE,
  CONFIRM: btnColors.BTN_GREEN,
  CANCEL: btnColors.BTN_RED,
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
  color?: string;
}

const ButtonsArray: ButtonConfig[] = [
  {
    displayString: '1',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('1');
    }
  },
  {
    displayString: '2',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('2');
    }
  },
  {
    displayString: '3',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('3');
    }
  },
  {
    displayString: 'to',
    color: buttonColor.OPERATOR,
    callback: ({ updateInput }) => {
      updateInput('to');
    }
  },
  {
    displayString: '4',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('4');
    }
  },
  {
    displayString: '5',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('5');
    }
  },
  {
    displayString: '6',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('6');
    }
  },
  {
    displayString: '+',
    color: buttonColor.OPERATOR,
    callback: ({ updateInput }) => {
      updateInput('+');
    }
  },
  {
    displayString: '7',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('7');
    }
  },
  {
    displayString: '8',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('8');
    }
  },
  {
    displayString: '9',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('9');
    }
  },
  {
    displayString: '-',
    color: buttonColor.OPERATOR,
    callback: ({ updateInput }) => {
      updateInput('-');
    }
  },
  {
    displayString: ':',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput(':');
    }
  },
  {
    displayString: '0',
    color: buttonColor.NUMBER,
    callback: ({ updateInput }) => {
      updateInput('0');
    }
  },
  {
    displayString: 'C',
    color: buttonColor.CANCEL,
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
    color: buttonColor.CONFIRM,
    callback: ({ confirm }) => {
      confirm();
    }
  },

];

export const ButtonGrid: React.FC<Props> = (props) => {
  return <ButtonGridWrapper>
    {ButtonsArray.map((btnConfig: ButtonConfig) => {
      if (btnConfig.displayString !== 'C') {
        return <Button key={btnConfig.displayString} color={btnConfig.color} onClick={() => btnConfig.callback(props)}>{btnConfig.displayString}</Button>
      } else {
        return (
          <BackButton key={btnConfig.displayString} color={btnConfig.color} onClick={() => btnConfig.callback(props)}>
            {props.outputValue.length ? btnConfig.displayString : <BackSymbol></BackSymbol>}
          </BackButton>
        )
      }
      
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
  color: ${btnColors.BTN_TEXT_ACTIVE};

  &:hover {
    cursor: pointer;
  }
`;

const BackButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackSymbol = styled.div`
  width: 0; 
  height: 0; 
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent; 
  border-right: 24px solid ${btnColors.BTN_TEXT_ACTIVE};
  margin-right: 4px;
`;