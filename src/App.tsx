import React from 'react';
import Calculator from './components/Calculator';
import { TimeParser } from './timeUtils/time-parser';

const App: React.FC = () => {
  const timeParser = new TimeParser();
  timeParser.parseExpression('04:00pm + 5hr');
  return <Calculator />;
}

export default App;