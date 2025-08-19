// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleUSDT
 * @dev Simple ERC20 USDT token contract with 6 decimals
 * @dev Based on OpenZeppelin's ERC20 implementation
 */
contract SimpleUSDT is ERC20, Ownable {
    
    uint8 private _decimals = 6;
    
    constructor(uint256 initialSupply) ERC20("Tether USD", "USDT") Ownable(msg.sender) {
        // Mint initial supply to contract deployer
        // Convert to proper decimal format (multiply by 10^6 for 6 decimals)
        _mint(msg.sender, initialSupply * 10**_decimals);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * 10**_decimals);
    }
}