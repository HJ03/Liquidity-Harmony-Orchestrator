import React, { useState } from 'react';
import "./App.css"

function App() {
  const [numPeople, setNumPeople] = useState(0); 
  // Keeps track of the number of people.

  const [transactions, setTransactions] = useState(Array.from({ length: numPeople }, () => Array(numPeople).fill(0)));
  // Represents the transactions among people.

  const [result, setResult] = useState([]);
  // Stores the result of the minimized cash flow .


  // Updates the number of people and resets the transactions when the number of people is changed
  const handleNumPeopleChange = (event) => {
    const newNumPeople = parseInt(event.target.value, 10);
    setNumPeople(newNumPeople);
    setTransactions(Array.from({ length: newNumPeople }, () => Array(newNumPeople).fill(0)));
  }; 

  
  // Updates the transactions array based on user input for each transaction.
  const handleTransactionChange = (person, receiver, value) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[person][receiver] = parseInt(value, 10);
    setTransactions(updatedTransactions);
  };


  // Validates input and performs cash flow minimization and sets the result.
  const handleSubmit = () => {
    // Validate input
    if (numPeople <= 0 || transactions.length !== numPeople) {
      alert('Please enter valid input.');
      return;
    }

    // Perform cash flow minimization
    const amount = Array(numPeople).fill(0);
    transactions.forEach((transaction, person) => {
      transaction.forEach((value, receiver) => {
        amount[person] -= value;
        amount[receiver] += value;
      });
    });

    // Display initial debts and credits
    console.log('Initial debts and credits:');
    for (let i = 0; i < numPeople; i++) {
      for (let j = 0; j < numPeople; j++) {
        if (i !== j && amount[i] + amount[j] !== 0) {
          console.log(`Person ${i} owes ${amount[i] + amount[j]} to Person ${j}`);
        }
      }
    }

    // Minimize cash flow
    const resultOutput = [];
    const minCashFlowRec = (amount) => {
      const mxCredit = amount.indexOf(Math.max(...amount));
      const mxDebit = amount.indexOf(Math.min(...amount));

      if (amount[mxCredit] === 0 && amount[mxDebit] === 0) {
        return;
      }

      const minAmount = Math.min(-amount[mxDebit], amount[mxCredit]);
      amount[mxCredit] -= minAmount;
      amount[mxDebit] += minAmount;

      resultOutput.push(`Person ${mxDebit} pays ${minAmount} to Person ${mxCredit}`);

      minCashFlowRec(amount);
    };

    minCashFlowRec(amount);

    // Display minimized cash flow
    console.log('Minimized cash flow:');
    resultOutput.forEach((line) => {
      console.log(line);
    });

    // Set result for display in the React component
    setResult(resultOutput);
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-start align-items-center vh-100 p-5">
      <div className='container w-auto contentBox align-self-end mt-5'>
        <div className="text-center p-5">
          <h1 className="mb-4">Liquidity Harmony Orchestrator</h1>
          <label className="mb-3">
            Enter the number of people:
            <input type="number" value={numPeople} onChange={handleNumPeopleChange} className="mx-2" />
          </label>
          <br />
          <label>
            Enter the transactions:
            {Array.from({ length: numPeople }).map((_, person) => (
              <div key={person} className="mb-2">
                {Array.from({ length: numPeople }).map((_, receiver) => (
                  // Exclude input fields where person is equal to receiver
                  (person !== receiver) && (
                    <input
                      key={receiver}
                      type="number"
                      placeholder={`Person ${person} to Person ${receiver}`}
                      onChange={(event) => handleTransactionChange(person, receiver, event.target.value)}
                      className="mx-2"
                    />
                  )
                ))}
              </div>
            ))}
          </label>
          <br />
          <button onClick={handleSubmit} className="btn btn-primary mt-3">Submit</button>

          <div className="mt-4">
            <h2>Result:</h2>
            {result.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
