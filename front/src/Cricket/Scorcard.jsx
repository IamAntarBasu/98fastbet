import React from 'react'

const Scorcard = () => {
  return (
    <div className="scorecard">
        <LiveScoreContainer>
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              width="100%"
              height="100%"
              title="Live Score"
              style={{ border: "none" }}
            ></iframe>
          ) : (
            <PlaceholderText>Live Score Not Available</PlaceholderText>
          )}
        </LiveScoreContainer>
      </div>
  )
}

export default Scorcard