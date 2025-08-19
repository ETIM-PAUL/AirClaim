import { ethers } from 'ethers';
import React, { useState } from 'react';
import IWNat from 'IWNat.json';
import { interfaceToAbi } from "@flarenetwork/flare-periphery-contract-artifacts";
import { FTSOV2_ABI } from '~/utils';

const FLRToUSDTModal = ({ 
  isOpen, 
  onClose, 
  getBalance,
  fetchWFLRBalance,
  balance,
}:any) => {
    const [amount, setAmount] = useState('');
    const [usdtAmount, setUsdtAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [txHash, setTxHash] = useState('');
    

    const handleSendToken = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        
        if (parseFloat(amount) > parseFloat(balance)) {
            setError('Insufficient balance');
            return;
        }
        
        setLoading(true);
        setError('');
        
    try {
      const WNAT_ADDRESS = "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273"
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(WNAT_ADDRESS, IWNat?.abi, signer);

      // Deposit 0.1 ETH
      const depositAmount = ethers.parseEther(amount).toString();
      const tx:any = await contract.deposit({ value: depositAmount });
      await tx.wait();
      console.log("Deposited native token to WNAT", tx);
      setTxHash(tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccess(true);
        // Refresh token balance
        await getBalance();
        await fetchWFLRBalance();
      } else {
        throw new Error('Transaction failed');
      }
      
    } catch (err:any) {
      setError(err.reason || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setAmount('');
    setError('');
    setSuccess(false);
    setTxHash('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleConversion = async (amount:any) => {
    const FTSOV2_ADDRESS = "0x3d893C53D9e8056135C26C8c638B76C8b60Df726";
    const FEED_IDS = [
      "0x01464c522f55534400000000000000000000000000", // FLR/USD
      "0x014254432f55534400000000000000000000000000", // BTC/USD
      "0x014554482f55534400000000000000000000000000", // ETH/USD
    ];
    setAmount(amount)

    // ABI for FtsoV2

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    // Set up contract instance
    const ftsov2 = new ethers.Contract(FTSOV2_ADDRESS, FTSOV2_ABI, provider);
    // Fetch current feeds
    const res = await ftsov2.getFeedsById.staticCall(FEED_IDS);
    // Log results
    console.log("Feeds:", res[0]);
    console.log("Decimals:", res[1]);
    console.log("Timestamp:", res[2]);
  };

  const setMaxAmount = () => {
    setAmount(balance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-50 transition-opacity"
        onClick={!loading ? handleClose : undefined}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Swap FLR Tokens for USDT Tokens
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {success ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Transaction Sent!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Successfully deposited <span className="font-semibold">{amount} FLR</span>
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-6">
                <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
                <p className="text-sm font-mono text-gray-700 break-all">
                  {txHash}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          ) : (
            /* Send Form */
            <div className="space-y-6">
              {/* Token Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Token:</span>
                  <span className="font-semibold text-green-700">Flare Native Token (FLR)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Available:</span>
                  <span className="font-semibold text-green-700">{balance}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Send
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleConversion(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    disabled={loading}
                    step="any"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">FLR</span>
                    <button
                      onClick={setMaxAmount}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                      disabled={loading}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction Preview */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">Confirm Transaction</p>
                      <p className="text-yellow-700">
                        You are about to convert <span className="font-semibold">{amount} FLR </span> to{' '}
                        <span className="font-bold">USDT</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Loading State Info */}
              {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
                    <p className="text-sm text-blue-700">
                      Please confirm the transaction in your wallet and wait for confirmation...
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendToken}
                  disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(balance)}
                  className="flex-1 bg-[#9e74eb] text-white py-3 px-4 rounded-lg hover:bg-[#9e74jb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Proceed'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FLRToUSDTModal;