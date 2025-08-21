# AirClaim: Revolutionizing Flight Delay Insurance with Blockchain Technology

AirClaim represents a paradigm shift in the flight insurance industry, leveraging blockchain technology on the Flare network to create a transparent, efficient, and trustless system for flight delay compensation. This innovative platform addresses the longstanding frustrations of traditional flight insurance: complex claim processes, delayed payouts, and lack of transparency. It allows passengers to play a mini game of predicting numbers and winning FLR token prizes.

The App has a Games Lounge (A reward earning lounge for passengers to earn tokens while awaiting to be boarded. Users can also play the games to win more FLR tokens for their selves)

## Core Technology and Infrastructure

At its foundation, AirClaim utilizes smart contracts deployed on the Flare network, specifically on the Coston2 testnet as indicated in the project configuration. The primary contract, `insuredFlightsAgency.sol`, manages the entire insurance lifecycle from insurance creation to claims processing (either in USDT or FLR). The `BattleShip.sol` contract handles the Battleship game. While `LuckySpin.sol` contract runs the LuckySpin - Roullete game

The system integrates with Flare's Data Contract (FDC) protocol and AviationStack API, which serves as a decentralized oracle network providing verified real-time flight data. This integration is crucial as it allows the platform to access trusted external data about flight statuses without relying on centralized authorities.

Currently the system delayed insurance time is set to 30 minutes, 

## Insurance Mechanism

The insurance process begins when a user insures a flight by calling the `insureFlight` function. This requires several key pieces of information:
- Aircraft ICAO code
- Flight number
- Passenger addresses
- Flight price
- Proof of flight status from the FDC

The premium calculation follows a straightforward formula: the sum total of 10% of each passenger ticket price plus a base insurance fee. This transparent pricing model ensures users understand exactly the insurance system works.

When a flight is insured, the system creates an `InsuredFlight` struct containing all relevant flight details, including departure and arrival airports, flight date, and initial status. Each insured flight receives a unique ID for tracking purposes.

<img src="/dashboard.png" alt="Airclaim Dashboard">
</br>
</br>
<img src="/insured_flights.png" alt="Airclaim Flights">

## Real-time Flight Monitoring

One of AirClaim's most powerful features is its ability to monitor flight statuses in real-time. The `checkFlightDelay` function allows either the insurer or insured passengers to verify the current status of a flight using data from aviation APIs.

The verification process works as follows:
1. Either the admin, or the insurer or the first passenger starts the flight status verification
2. The system fetches data through Flare's Data Contract protocol
3. The data is verified using cryptographic proofs
4. If the flight is delayed beyond the threshold (default 30 minutes), the status is updated insurance claim is triggered for passengers to claim their insurances

This monitoring can occur at 10-minute intervals, ensuring timely updates while preventing excessive API calls.

</br>
<img src="/flight_details.png" alt="Airclaim Insued Flight Details">

## Automated Claims Processing

When a flight is confirmed delayed beyond the threshold, the smart contract automatically updates the flight status using Flare FDC Web2Json flow. Passengers can then claim their compensation by calling the `claimInsurance` function with their insured flight ID.

The claims process includes several validation checks:
- Verifying the flight status is no longer "scheduled"
- Confirming the passenger is insured for that flight
- Ensuring the flight delay exceeds the threshold
- Checking the passenger hasn't already claimed compensation

Also passenger has an option of winning extra prizes if they can predict a number between 1-20. If the prediction is correct, they win 2FLR Token, otherwise, they loose 50% of their insurance claim.

The passengers also have an option of receiving their insurance claim in USDT (The app uses FTSOv2 to calculate the rate of USDT to FLR, it then transfers the equivalent in USDT to the passenger. If the app USDT balance is below the required amount, then payment is made in FLR)
</br>
<img src="/prior_claim.png" alt="Airclaim Flights">

</br>
Upon successful validation, the contract automatically transfers the compensation amount (10% of their flight ticket price) directly to the passenger's wallet. This entire process occurs without human intervention, eliminating the bureaucracy and delays associated with traditional insurance claims.
</br>
<img src="/claimResult.png" alt="Claim Modal">

## Games Lounge (LuckySpin - Roulette)

The Games lounge LuckySpin is a game that allows users (Be it passengers or random users get to win FLR tokens by trying to match as many numbes they can predict in a 5-piece prediction game)

<img src="/roulette.png" alt="Lucky Spin UI">


The rules of the game are as follows:

- Enter 5 different numbers between 1-20
- Stake at most 2 FLR to play one round
- Click "Spin the Wheel" to start the game
- Using FLR Secure Randomness, we will randomly get 5 numbers
-Match 3 numbers: Win * 5 of your staked FLR
-Match 4 numbers: Win * 10 of your staked FLR
-Match all 5 numbers: Win * 25 of your staked FLR
-Less than 3 matches: No prize

## Games Lounge (BattleShip)

The Games lounge BattleShip is a game that allows users (Be it passengers or random users get to win FLR tokens by trying to predict the exact box a drone will dropped  Box 0 - Box 15). A successful prediction doubles your staked amount.

<img src="/battleship.png" alt="Battle Ship UI">

## Wallet Feature

The Wallet UI allows users to view their FLR, WFLR and USDT tokens balance.
There is a built in functionality for users to deposit their FLR tokens for WFLR, as well as withdrawing it for FLR tokens.

This WFLR tokens can be used for voting on FLR proposals, and other governance features on the Flare Network as a Flare Ecosystem User.

<img src="/wallet.png" alt="Displaying tokens balances">
</br>
</br>
</br>
<img src="/getWflr.png" alt="Deposiitng FLR for WFLR">

## Frontend Integration

The project includes a modern web interface built with React and Typescript, allowing users to interact with the smart contracts seamlessly. The frontend interacts with the blockchain using ethers.js and manages wallet connections through a custom provider.

Key frontend features include:
- Flight search and insurance purchase
- Real-time flight status monitoring
- Insurance policy management
- Claim submission and tracking
- Games Lounge to win FLR incentives

The interface is designed to be user-friendly, abstracting away the complexity of blockchain interactions while maintaining full transparency about the insurance process.

## Security Considerations

AirClaim implements several security measures to protect both users and the platform:
- Ownership controls for administrative functions
- Time-based rate limiting for flight status checks
- Cryptographic verification of flight data
- Validation checks throughout the insurance lifecycle
- Validation of secured randomness of numbers

The smart contracts follow best practices for Solidity development, as evidenced by the project's adherence to solhint recommendations and compiler version specifications.

## Future Potential

While currently deployed on Flare's testnet, AirClaim has significant potential for mainstream adoption. The platform could expand to cover additional travel disruptions beyond delays and cancellations, such luggage lost, diverted flights, more games in the lounge.

More different data assets that allows passengers have options of assets to claim funds (ETH, XRP, SOL, etc).

An automated server-side cron job that does the checks and update of flight details, making the process fully automatic.

Integration with more data sources and airlines could further enhance the platform's capabilities, potentially revolutionizing how travel insurance operates globally. The transparent, automated nature of blockchain-based insurance could significantly reduce operational costs for insurers while providing better service to travelers.

By eliminating intermediaries and automating claims processing, AirClaim represents not just an improvement to existing flight insurance but a fundamental reimagining of how risk can be managed in the travel industry through decentralized technology.