import React, { useState } from 'react';
import '../styles/date.css';

interface FlightFormData {
  flightNumber: string;
  flightID: number;
  predictedNumber: number;
}

interface InsureFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FlightFormData) => void;
  loading: boolean;
}


const CustomModal: React.FC<InsureFlightModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightID, setFlightID] = useState<number>();
  const [predictedNumber, setPredictedNumber] = useState<number>();
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData: FlightFormData = {
      flightNumber,
      flightID,
      predictedNumber,
    } as FlightFormData;

    if (
      !formData.flightNumber ||
      formData.flightID === undefined || formData.flightID === null
    ) {
      setError('Please fill in all fields correctly.');
      return;
    }

    onSubmit(formData);
  };

  if(!isOpen) return null;

  return (  
    <div>
      <div className="fixed inset-0 bg-black opacity-80 flex items-center justify-center z-50">
      </div>

      <div className='fixed inset-0 flex items-center justify-center z-50'>
        <form
          className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md space-y-4 cursor-pointer"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl text-black font-bold mb-4">Claim Flight Insurance</h2>
          {error && <div className="text-red-600 mb-2">Please note that if the flight</div>}  
          <div>
          <div className="text-red-600 my-2">Predict a number between 1-20 to stand a chance of winning 1 C2FLR. If your prediction is wrong, you forfeit 50% of your insurance.</div>
            <label className="block  text-black text-sm font-medium mb-1">Prediction</label>
            <input
              className="w-full p-2  text-black border border-black rounded"
              value={predictedNumber}
              placeholder='Leave blank if you do not want to predict'
              type='number'
              onChange={e => setPredictedNumber(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block  text-black text-sm font-medium mb-1">InsuranceFlight ID</label>
            <input
              className="w-full p-2  text-black border border-black rounded"
              value={flightID}
              placeholder='Insurance Flight ID'
              type='number'
              onChange={e => setFlightID(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block  text-black text-sm font-medium mb-1">Flight Number</label>
            <input
              className="w-full p-2  text-black border border-black rounded"
              value={flightNumber}
              type='text'
              placeholder='Aircraft Flight number in the form AA123'
              onChange={e => setFlightNumber(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
          <button
              type="button"
              disabled={loading}
              className="px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"

              disabled={loading}
              className="px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed py-2 bg-[#4C2AA0] text-white rounded hover:bg-[#3B1F7A]"
            >
              Claim Insurance
            </button>
        
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomModal;