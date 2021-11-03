import React from 'react';
import { TimeParser } from './timeUtils/time-parser';

const App: React.FC = () => {
  const timeParser = new TimeParser();
  timeParser.parseExpression('04:00pm + 5hr');
  return <div>Time Calculator!!!</div>;
}

export default App;