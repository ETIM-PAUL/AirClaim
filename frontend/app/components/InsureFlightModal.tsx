import React, { useState } from 'react';
import { WithContext as ReactTags, Tag } from 'react-tag-input';
import Swal from 'sweetalert2';
interface FlightFormData {
  aircraftCode: string;
  flightNumber: string;
  insurancePrice: number;
  passengerWalletAddresses: string[];
}

interface InsureFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FlightFormData) => void;
}

const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const InsureFlightModal: React.FC<InsureFlightModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [aircraftCode, setAircraftCode] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [insurancePrice, setInsurancePrice] = useState<any>('');
  const [passengerWalletAddresses, setPassengerWalletAddresses] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData: FlightFormData = {
        aircraftCode,
        flightNumber,
        insurancePrice: typeof insurancePrice === 'string' ? parseFloat(insurancePrice) : insurancePrice,
        passengerWalletAddresses: passengerWalletAddresses.map(tag => tag.text),
      };

      // Validation
      if (
        !formData.aircraftCode ||
        !formData.flightNumber ||
        !formData.insurancePrice ||
        !formData.passengerWalletAddresses.length
      ) {
        setError('Please fill in all fields correctly.');
        return;
      }

      // Validate wallet addresses format (basic check)
      const isValidWalletAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);
      if (!formData.passengerWalletAddresses.every(isValidWalletAddress)) {
        setError('Please enter valid wallet addresses (0x format)');
        return;
      }

      try {
        // Submit form data
        await onSubmit(formData);
        // Show success alert after 100ms
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          showCancelButton: false,
          timer: 2000,
          text: 'Flight insurance submitted successfully!',
        }).then(() => {
          // Reset form input fields
          setAircraftCode('');
          setFlightNumber('');
          setInsurancePrice('');
          setPassengerWalletAddresses([]);
          setIsSubmitting(false);
        });
        onClose();
      }, 1000);
      } catch (error) {
        setError('An error occurred while submitting the form');
        console.error(error);
        setIsSubmitting(false);
      }


    } catch (error) {
      setError('An error occurred while submitting the form');
      console.error(error);
      setIsSubmitting(false);
    }
  };
  {/* If the modal is not open, don't render anything */}
  if (!isOpen) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black opacity-80 flex items-center justify-center z-50">
      </div>

      <div className='fixed inset-0 flex items-center justify-center z-50'>
        <form
          className={`bg-white rounded-lg shadow-2xl p-6 w-full max-w-md space-y-4 cursor-pointer ${
            isSubmitting
          }`}
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl text-black font-bold mb-4">Insure Flight</h2>
          {error && <div className="text-red-600 mb-2">{error}</div>}

          <div>
            <label className="block  text-black text-sm font-medium mb-1">Airline ICAO</label>
            <input
              className="w-full p-2 text-black border border-black rounded"
              value={aircraftCode}
              placeholder='Airline ICAO code'
              onChange={e => setAircraftCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block  text-black text-sm font-medium mb-1">Flight Number</label>
            <input
              className="w-full p-2  text-black border border-black rounded"
              value={flightNumber}
              placeholder='Flight number in the form AA123'
              onChange={e => setFlightNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm  text-black font-medium mb-1">Ticket Price (ETH)</label>
            <input
              type="number"
              className="w-full p-2 border  text-black border-black rounded"
              value={insurancePrice}
              placeholder='Enter ticket price in ETH'
              onChange={e => setInsurancePrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm  text-black font-medium mb-1">Passengers' Wallet Addresses</label>
            <ReactTags
              tags={passengerWalletAddresses}
              delimiters={delimiters}
              handleDelete={i => setPassengerWalletAddresses(passengerWalletAddresses.filter((_, idx) => idx !== i))}
              handleAddition={tag => setPassengerWalletAddresses([...passengerWalletAddresses, tag])}
              placeholder="Add wallet addresses"
              classNames={{
                tags: 'ReactTags__tags text-black',
                tagInput: 'border py-2 border-black mt-2 rounded-md ReactTags__tagInput text-black',
                tagInputField: 'w-full focus:outline-none px-2 ReactTags__tagInputField',
                selected: 'ReactTags__selected w-full items-center',
                tag: 'bg-gray-500 rounded-sm p-1 text-white mr-1 ReactTags__tag',
                remove: 'ReactTags__remove bg-red-400 text-center  hover:bg-red-600 mx-1',
                suggestions: 'ReactTags__suggestions',
                activeSuggestion: 'ReactTags__activeSuggestion'
              }}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            {isSubmitting ? (
              <div className="flex items-center justify-center w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4C2AA0]"></div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4C2AA0] text-white rounded hover:bg-[#3B1F7A]"
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsureFlightModal;