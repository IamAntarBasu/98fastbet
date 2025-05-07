import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const OverMarketContext = createContext();

export const useOverMarket = () => {
  const context = useContext(OverMarketContext);
  if (!context) {
    throw new Error('useOverMarket must be used within an OverMarketProvider');
  }
  return context;
};

// Pure function to calculate profit/loss for YES bet
const calculateYesBetPL = (stake, odds, runs) => {
  const parsedStake = parseFloat(stake);
  const parsedOdds = parseFloat(odds);
  const parsedRuns = parseFloat(runs);

  if (isNaN(parsedStake) || isNaN(parsedOdds) || isNaN(parsedRuns)) {
    throw new Error('Invalid input values for YES bet calculation');
  }

  return {
    profit: (parsedStake * parsedOdds) / 100,
    loss: -parsedStake,
    exposure: parsedStake,
    runs: parsedRuns
  };
};

// Pure function to calculate profit/loss for NO bet
const calculateNoBetPL = (stake, odds, runs) => {
  const parsedStake = parseFloat(stake);
  const parsedOdds = parseFloat(odds);
  const parsedRuns = parseFloat(runs);

  if (isNaN(parsedStake) || isNaN(parsedOdds) || isNaN(parsedRuns)) {
    throw new Error('Invalid input values for NO bet calculation');
  }

  return {
    profit: parsedStake,
    loss: -(parsedStake * parsedOdds) / 100,
    exposure: (parsedStake * parsedOdds) / 100,
    runs: parsedRuns
  };
};

// Calculate net position for multiple bets at same run value
const calculateNetPosition = (yesBets, noBets) => {
  if (!yesBets?.length && !noBets?.length) {
    return { maxProfit: 0, maxLoss: 0, netExposure: 0, cancelableAmount: 0 };
  }

  // Calculate YES position
  const yesPosition = yesBets.reduce((acc, bet) => {
    const pl = calculateYesBetPL(bet.stake, bet.odds, bet.runs);
    return {
      profit: acc.profit + pl.profit,
      loss: acc.loss + pl.loss,
      exposure: acc.exposure + pl.exposure,
      runs: pl.runs,
      stake: (acc.stake || 0) + parseFloat(bet.stake),
      odds: bet.odds // Store odds for profit calculation
    };
  }, { profit: 0, loss: 0, exposure: 0, runs: yesBets[0]?.runs || 0, stake: 0, odds: yesBets[0]?.odds });

  // Calculate NO position
  const noPosition = noBets.reduce((acc, bet) => {
    const pl = calculateNoBetPL(bet.stake, bet.odds, bet.runs);
    return {
      profit: acc.profit + pl.profit,
      loss: acc.loss + pl.loss,
      exposure: acc.exposure + pl.exposure,
      runs: pl.runs,
      stake: (acc.stake || 0) + parseFloat(bet.stake),
      odds: bet.odds // Store odds for profit calculation
    };
  }, { profit: 0, loss: 0, exposure: 0, runs: noBets[0]?.runs || 0, stake: 0, odds: noBets[0]?.odds });

  // Special handling when YES run <= NO run
  let cancelableAmount = 0;
  let netExposure = 0;

  if (yesBets.length > 0 && noBets.length > 0) {
    const yesRuns = parseFloat(yesPosition.runs);
    const noRuns = parseFloat(noPosition.runs);
    
    if (yesRuns <= noRuns) {
      // When YES run is less than or equal to NO run, bets can be matched
      const minStake = Math.min(yesPosition.stake, noPosition.stake);
      cancelableAmount = minStake;
      
      // Calculate profits for the matched portion
      const yesProfit = (minStake * parseFloat(yesPosition.odds)) / 100;
      const noProfit = (minStake * parseFloat(noPosition.odds)) / 100;
      
      // Calculate exposure as the difference between profits
      const profitDifference = Math.abs(yesProfit - noProfit);
      
      // Calculate remaining unmatched stakes
      const remainingYesStake = yesPosition.stake - minStake;
      const remainingNoStake = noPosition.stake - minStake;
      
      // Calculate exposure for unmatched portion
      let unmatchedExposure = 0;
      if (remainingYesStake > 0) {
        unmatchedExposure = remainingYesStake * (parseFloat(yesPosition.odds) / 100);
      } else if (remainingNoStake > 0) {
        unmatchedExposure = remainingNoStake * (parseFloat(noPosition.odds) / 100);
      }
      
      // Total exposure is profit difference plus unmatched exposure
      netExposure = profitDifference + unmatchedExposure;
      
    } else {
      // When YES run > NO run, calculate exposure normally
      netExposure = Math.max(yesPosition.exposure, noPosition.exposure);
    }
  } else {
    // If only YES or NO bets exist
    netExposure = Math.max(yesPosition.exposure, noPosition.exposure);
  }

  // Calculate maximum profit and loss
  const maxProfit = Math.max(
    yesPosition.profit + noPosition.loss,
    noPosition.profit + yesPosition.loss
  );
  
  const maxLoss = Math.min(
    yesPosition.loss + noPosition.profit,
    noPosition.loss + yesPosition.profit
  );

  return {
    maxProfit,
    maxLoss,
    netExposure,
    cancelableAmount
  };
};

// Pure function to calculate exposure based on bet type and amounts
const calculateExposure = (currentBet, existingBets = []) => {
  const { type, stake, odds, runs } = currentBet;
  
  // First bet scenario
  if (existingBets.length === 0) {
    if (type === 'yes') {
      const { exposure } = calculateYesBetPL(parseFloat(stake), parseFloat(odds), parseFloat(runs));
      return exposure;
    } else {
      const { exposure } = calculateNoBetPL(parseFloat(stake), parseFloat(odds), parseFloat(runs));
      return exposure;
    }
  }

  // Multiple bets scenario
  const allBets = [...existingBets, currentBet];
  const { maxLoss } = calculateNetPosition(allBets.filter(bet => bet.type === 'yes'), allBets.filter(bet => bet.type === 'no'));
  return Math.abs(maxLoss);
};

export const OverMarketProvider = ({ children }) => {
  const [overMarketBets, setOverMarketBets] = useState([]);
  const [overTeam1Winnings, setOverTeam1Winnings] = useState(0);
  const [overTeam2Winnings, setOverTeam2Winnings] = useState(0);
  const [overExposure, setOverExposure] = useState(() => {
    const savedExposure = localStorage.getItem('overMarketExposure');
    return savedExposure ? parseFloat(savedExposure) : 0;
  });
  const [sessionBets, setSessionBets] = useState({});
  const [initialBalance, setInitialBalance] = useState(null);
  const [runValues, setRunValues] = useState({});

  // Function to calculate net position for a specific run value
  const calculateNetPositionForRun = useCallback((bets, currentRuns) => {
    if (!bets || !currentRuns) return { maxProfit: 0, maxLoss: 0, netExposure: 0, cancelableAmount: 0 };

    const yesBets = bets.filter(bet => bet.type.toLowerCase() === 'yes' && bet.runs === currentRuns);
    const noBets = bets.filter(bet => bet.type.toLowerCase() === 'no' && bet.runs === currentRuns);

    return calculateNetPosition(yesBets, noBets);
  }, []);

  // Calculate total exposure across all run values
  const calculateTotalExposure = useCallback(() => {
    let totalExposure = 0;
    Object.values(runValues).forEach((value) => {
      if (value.backStake && value.backRate) {
        totalExposure += value.backStake;
      }
      if (value.layStake && value.layRate) {
        totalExposure += value.layStake;
      }
    });
    
    // Update the exposure in localStorage
    localStorage.setItem('overMarketExposure', totalExposure.toString());
    setOverExposure(totalExposure);
    
    return totalExposure;
  }, [runValues]);

  // Add a function to load saved exposure when component mounts
  useEffect(() => {
    const savedExposure = localStorage.getItem('overMarketExposure');
    if (savedExposure) {
      setOverExposure(parseFloat(savedExposure));
    }
  }, []);

  const handleOverBetPlacement = useCallback((bet, stake, balance, setBalance, setExposure) => {
    try {
      if (!bet || !stake) {
        throw new Error('Please select a bet and enter a stake.');
      }

      const parsedStake = parseFloat(stake);
      const parsedOdds = parseFloat(bet.odds);
      const parsedRuns = parseFloat(bet.rate);

      if (isNaN(parsedStake) || parsedStake <= 0) {
        throw new Error('Invalid stake amount.');
      }

      if (isNaN(parsedOdds) || parsedOdds <= 0) {
        throw new Error('Invalid odds value.');
      }

      if (isNaN(parsedRuns)) {
        throw new Error('Invalid runs value.');
      }

      // Set initial balance on first bet if not set
      if (initialBalance === null) {
        setInitialBalance(balance);
      }

      // Create current bet object
      const currentBet = {
        type: bet.type.toLowerCase(),
        stake: parsedStake,
        odds: parsedOdds,
        runs: parsedRuns,
        timestamp: new Date().toISOString()
      };

      // Get existing bets and add new bet
      const existingBets = sessionBets[parsedRuns] || [];
      const updatedBets = [...existingBets, currentBet];

      // Calculate new position
      const { maxProfit, maxLoss, netExposure, cancelableAmount } = calculateNetPositionForRun(updatedBets, parsedRuns);

      // Calculate total exposure across all run values
      const otherRunsExposure = Object.entries(sessionBets)
        .filter(([runs]) => parseFloat(runs) !== parsedRuns)
        .reduce((total, [runs, bets]) => {
          const { netExposure } = calculateNetPositionForRun(bets, parseFloat(runs));
          return total + netExposure;
        }, 0);

      const totalExposure = netExposure + otherRunsExposure;

      // Validate balance
      if (totalExposure > balance) {
        throw new Error('Insufficient balance for this exposure.');
      }

      // Update session bets
      setSessionBets(prev => ({
        ...prev,
        [parsedRuns]: updatedBets
      }));

      // Update balance and exposure
      const newBalance = (initialBalance || balance) - totalExposure;
      setBalance(newBalance);
      if (setExposure) setExposure(totalExposure);

      // Add bet to history with detailed information
      const betRecord = {
        ...bet,
        ...currentBet,
        maxProfit: maxProfit.toFixed(2),
        maxLoss: maxLoss.toFixed(2),
        netExposure: netExposure.toFixed(2),
        cancelableAmount: cancelableAmount.toFixed(2),
        totalExposure: totalExposure.toFixed(2),
        balance: newBalance.toFixed(2),
        marketType: 'overMarket'
      };

      setOverMarketBets(prev => [...prev, betRecord]);

      // Update run values for exposure calculation
      setRunValues(prev => ({
        ...prev,
        [parsedRuns]: {
          backStake: bet.type.toLowerCase() === 'yes' ? parsedStake : 0,
          backRate: bet.type.toLowerCase() === 'yes' ? parsedOdds : 0,
          layStake: bet.type.toLowerCase() === 'no' ? parsedStake : 0,
          layRate: bet.type.toLowerCase() === 'no' ? parsedOdds : 0
        }
      }));

      return true;
    } catch (error) {
      console.error('Error placing over market bet:', error);
      alert(error.message);
      return false;
    }
  }, [sessionBets, initialBalance, calculateNetPositionForRun]);

  return (
    <OverMarketContext.Provider value={{
      overMarketBets,
      overTeam1Winnings,
      overTeam2Winnings,
      overExposure,
      handleOverBetPlacement,
      sessionBets,
      initialBalance,
      calculateNetPositionForRun,
      calculateTotalExposure
    }}>
      {children}
    </OverMarketContext.Provider>
  );
}; 