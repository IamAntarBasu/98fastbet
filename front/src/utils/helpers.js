// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format odds
export const formatOdds = (odds) => {
  if (!odds) return '-';
  return parseFloat(odds).toFixed(2);
};

// Format stake size (e.g. 10000 -> 10K)
export const formatStakeSize = (size) => {
  if (!size) return '-';
  
  const num = parseFloat(size);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

// Check if a match is live
export const isMatchLive = (match) => {
  return match && (match.inplay || match.inplay_status === 1);
};

// Group matches by league
export const groupMatchesByLeague = (matches) => {
  if (!matches || !matches.length) return {};
  
  return matches.reduce((acc, match) => {
    const leagueName = match.league_name || 'Other';
    if (!acc[leagueName]) {
      acc[leagueName] = [];
    }
    acc[leagueName].push(match);
    return acc;
  }, {});
};

// Sort matches (live first, then by date)
export const sortMatches = (matches) => {
  if (!matches || !matches.length) return [];
  
  return [...matches].sort((a, b) => {
    // Live matches first
    if (isMatchLive(a) && !isMatchLive(b)) return -1;
    if (!isMatchLive(a) && isMatchLive(b)) return 1;
    
    // Then by date
    return new Date(a.event_date) - new Date(b.event_date);
  });
}; 