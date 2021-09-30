import React from 'react';
import * as parser from './timeUtils/expression-parser';

const App: React.FC = () => {
  parser.parseExpression('04:00pm + 5hr', false);
  return <div>Time Calculator!!!</div>;
}

export default App;