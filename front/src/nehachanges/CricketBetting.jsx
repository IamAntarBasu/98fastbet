import React, { useState } from 'react';
import './CricketBetting.css';

const CricketBetting = () => {
  const [selectedMarket, setSelectedMarket] = useState('match');
  const [currentStake, setCurrentStake] = useState('');
  const [selectedBet, setSelectedBet] = useState(null);
  const [balance, setBalance] = useState(10000); 
  const [exposure, setExposure] = useState(0); 
  const [betHistory, setBetHistory] = useState([]); 
  const [backProfit, setBackProfit] = useState(0); 
  const [layProfit, setLayProfit] = useState(0); 
  const [count, setCount] = useState(0);
  const [team1Winnings, setTeam1Winnings] = useState(0); 
  const [team2Winnings, setTeam2Winnings] = useState(0); 

  const markets = {
    match: {
      title: 'Match Odds',
      options: [
        { 
          team: 'NEW ZEALAND',
          back: 1.330,  // Converted from 0.330 to decimal odds
          lay: 1.300,   // Converted from 0.300 to decimal odds
          selectionId: 1,
          selectionid: 1,
          status: 'ACTIVE',
          remark: ''
        },
        { 
          team: 'AUSTRALIA',
          back: 1.330,
          lay: 1.300,
          selectionId: 2,
          selectionid: 2,
          status: 'ACTIVE',
          remark: ''
        }
      ]
    }
  };

  

  const handleStakeChange = (value) => {
    setCurrentStake(value);
  };

  const handleBetSelect = (teamIndex, type, odds) => {
    setSelectedBet({
      teamIndex,
      type,
      odds,
      selectionId: markets.match.options[teamIndex].selectionId,
      selectionid: markets.match.options[teamIndex].selectionid,
      status: markets.match.options[teamIndex].status,
      team_name: markets.match.options[teamIndex].team
    });
  };

  const handlePlaceBet = () => {
    if (!selectedBet || !currentStake) {
      alert('Please select a bet and enter a stake.');
      return;
    }

    const stake = parseFloat(currentStake);
    if (isNaN(stake) || stake <= 0) {
      alert('Invalid stake amount.');
      return;
    }

    const { teamIndex, type, odds, selectionId, selectionid, status, team_name } = selectedBet;
    const profit = Math.round(stake * (odds - 1));

    // First, revert all exposure back to balance
    if (exposure > 0) {
      setBalance(prevBalance => prevBalance + exposure);
      setExposure(0);
    }

    if (type === 'back') {
      if (stake > balance) {
        alert('Insufficient balance.');
        return;
      }
      
      // Add new back profit to existing back profit
      const newBackProfit = backProfit + profit;
      setBackProfit(newBackProfit);
      
      setCount(layProfit === 0 ? 1 : 0)
      const newBalance = layProfit === 0 ? balance - stake :( balance+exposure) - Math.abs(newBackProfit - layProfit);
      setBalance(newBalance);
      
      const newExposure = layProfit === 0 ? exposure + stake : Math.abs(newBackProfit - layProfit);
      setExposure(newExposure);

      // Update team winnings for back bet
      if (teamIndex === 0) {
        setTeam1Winnings((newBackProfit - layProfit));
        setTeam2Winnings(prev => prev + (-stake));
      } else {
        setTeam2Winnings((newBackProfit - layProfit));
        setTeam1Winnings(prev => prev + (-stake));
      }
      
      console.log('Back Profit:', newBackProfit);
      console.log('Lay Profit:', layProfit);
    } else if (type === 'lay') {
      if (profit > balance) {
        alert('Insufficient balance.');
        return;
      }
      
      // Add new lay profit to existing lay profit
      const newLayProfit = layProfit + profit;
      setLayProfit(newLayProfit);
      setBalance(prevBalance => prevBalance - Math.abs(backProfit - newLayProfit));
      setExposure(Math.abs(backProfit - newLayProfit));

      // Update team winnings for lay bet
      if (teamIndex === 0) {
        setTeam1Winnings((backProfit - newLayProfit));
        setTeam2Winnings(prev => prev + stake);
      } else {
        setTeam2Winnings((backProfit - newLayProfit));
        setTeam1Winnings(prev => prev + stake);
      }
      
      console.log('Back Profit:', backProfit);
      console.log('Lay Profit:', newLayProfit);
    }

    // Update bet history with API data
    setBetHistory(prevHistory => [...prevHistory, { 
      teamIndex, 
      type, 
      odds, 
      stake,
      selectionId,
      selectionid,
      status,
      team_name,
      remark: ''
    }]);

    console.log('Placing bet:', { 
      selectedBet, 
      stake, 
      backProfit, 
      layProfit,
      selectionId,
      selectionid,
      status,
      team_name
    });
    console.log('Team 1 Winnings:', team1Winnings);
    console.log('Team 2 Winnings:', team2Winnings);
    alert(`Bet placed successfully on ${team_name} with ${type} at odds ${odds} and stake ${stake}`);
  };

  const calculateMatchProfitLoss = (teamIndex) => {
    if (!selectedBet || !currentStake) return { back: '', lay: '' };
    
    const stake = parseFloat(currentStake);
    if (isNaN(stake)) return { back: '', lay: '' };

    const { teamIndex: selectedTeamIndex, type } = selectedBet;

    if (teamIndex === selectedTeamIndex) {
      if (type === 'back') {
        const profit = backProfit + (Math.round(stake * (selectedBet.odds - 1)));
        return {
          back: `+${Math.abs(layProfit - profit)}`,
          lay: ''
        };
      } else {
        const newLayProfit = layProfit + (Math.round(stake * (selectedBet.odds - 1)));
        return {
          back: '',
          lay: `-${Math.abs(backProfit - newLayProfit)}`
        };
      }
    } else {
      if (type === 'back') {
        return {
          back: `-${stake}`,
          lay: ''
        };
      } else {
        const profit = Math.round(stake * (selectedBet.odds - 1));
        return {
          back: '',
          lay: `+${stake}`
        };
      }
    }
  };

  return (
    <div className="cricket-betting-container">
      <div className="market-header">
        <div className="exposure-info">
          <span>exposure {exposure}Rs</span>
          <span className="balance">balance {balance}Rs</span>
        </div>
        <h2>Match Odds</h2>
      </div>

      <div className="market-container">
        <div className="odds-grid">
          <div className="odds-header">
            <span>Team</span>
            <span>Back</span>
            <span>Lay</span>
            <span>Back (Lagai)</span>
            <span>Lay (Khaai)</span>
          </div>
          {markets.match.options.map((option, index) => {
            const results = calculateMatchProfitLoss(index);

            return (
              <div key={index} className="odds-row">
                <div className="team-info">
                  <span className="team-name">{option.team}</span>
                  <span className={`winning ${index === 0 ? team1Winnings >= 0 : team2Winnings >= 0 ? 'positive' : 'negative'}`}>
                    {index === 0 ? 
                      (team1Winnings >= 0 ? `+${team1Winnings}` : team1Winnings) :
                      (team2Winnings >= 0 ? `+${team2Winnings}` : team2Winnings)
                    }
                  </span>
                </div>
                <span className="back-result">{results.back}</span>
                <span className="lay-result">{results.lay}</span>
                <button 
                  className={`back-btn ${selectedBet?.teamIndex === index && selectedBet?.type === 'back' ? 'selected' : ''}`}
                  onClick={() => handleBetSelect(index, 'back', option.back)}
                >
                  {option.back.toFixed(2)}
                </button>
                <button 
                  className={`lay-btn ${selectedBet?.teamIndex === index && selectedBet?.type === 'lay' ? 'selected' : ''}`}
                  onClick={() => handleBetSelect(index, 'lay', option.lay)}
                >
                  {option.lay.toFixed(2)}
                </button>
              </div>
            );
          })}
        </div>

        <div className="stake-container">
          <input
            type="number"
            value={currentStake}
            onChange={(e) => handleStakeChange(e.target.value)}
            placeholder="Enter stake"
          />
        </div>

        <div className="place-bet-container">
          <button onClick={handlePlaceBet}>Place Bet</button>
        </div>

        <div className="quick-stakes">
          <button onClick={() => handleStakeChange('1000')}>+1k</button>
          <button onClick={() => handleStakeChange('2000')}>+2k</button>
          <button onClick={() => handleStakeChange('5000')}>+5k</button>
          <button onClick={() => handleStakeChange('10000')}>+10k</button>
          <button onClick={() => handleStakeChange('20000')}>+20k</button>
          <button onClick={() => handleStakeChange('25000')}>+25k</button>
          <button onClick={() => handleStakeChange('50000')}>+50k</button>
          <button onClick={() => handleStakeChange('75000')}>+75k</button>
          <button onClick={() => handleStakeChange('90000')}>+90k</button>
          <button onClick={() => handleStakeChange('95000')}>+95k</button>
          <button onClick={() => setCurrentStake('')}>clear</button>
        </div>
      </div>
    </div>
  );
};

export default CricketBetting;