import { useState } from "react";
import { FaPlane, FaCalendarAlt, FaMapMarkerAlt, FaUserFriends, FaDollarSign, FaCheckCircle, FaPlus, FaTicketAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import Sidebar from "~/components/Sidebar";

const InsureFlightPage = () => {
  const [flightData, setFlightData] = useState({
    flightNumber: "",
    airline_icao: "",
    insuredAmount: "",
  });
  const [economyPrice, setEconomyPrice] = useState(0);
  const [businessPrice, setBusinessPrice] = useState(0);
  const [firstClassPrice, setFirstClassPrice] = useState(0);
  const [numberOfPassengers, setNumberOfPassengers] = useState(0);
  const [currentTab, setCurrentTab] = useState("flightDetails");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [passengers, setPassengers] = useState<
    { name: string; ticketType: string; ticketPrice: string }[]
  >([]);
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    ticketType: "Economy",
    ticketPrice: "",
  });

  const ticketPrices:any = {
    "Economy": 100,
    "Business": 200,
    "First Class": 300,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlightData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePassengerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPassenger((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddPassenger = () => {
    if (newPassenger.name && newPassenger.ticketType) {
      setPassengers([...passengers, newPassenger]);
      setNewPassenger({ name: "", ticketType: "Economy", ticketPrice: ticketPrices[newPassenger.ticketType] });
    }
  };

  const proceed = () => {
    if(flightData.flightNumber && flightData.airline_icao && economyPrice && businessPrice && firstClassPrice && numberOfPassengers > 0 && currentTab === "flightDetails") {
      setCurrentTab("passengers");
    } else {
      toast.error("Please fill all the fields");
    }
  };

  const confirmationPrompt = () => {
    setShowConfirmationModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-500">
              Insure a Flight
            </h1>
            <p className="text-gray-400 mt-1">Provide details to insure a new flight</p>
          </div>
        </div>
        <hr className="border-gray-800 mb-8" />

        {/* Flight Insurance Form */}
        <div className="bg-[#101112] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="md:flex w-full gap-6">
            
          {currentTab === "flightDetails" && (
            <div className="w-full flex items-center">
            <div className="md:w-1/2 py-6">
            {/* Flight Number */}
            <h2 className="text-xl font-bold mb-4">Flight Details</h2>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                <FaPlane className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <label htmlFor="flightNumber" className="text-gray-400">Flight Number</label>
                <input
                  type="text"
                  id="flightNumber"
                  name="flightNumber"
                  value={flightData.flightNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all mt-1"
                  required
                />
              </div>
            </div>

            {/* Airline */}
            <div className="flex items-center gap-3 mt-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                <FaPlane className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <label htmlFor="airline" className="text-gray-400">Airline ICAO</label>
                <input
                  type="text"
                  id="airline_icao"
                  name="airline_icao"
                  value={flightData.airline_icao}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all mt-1"
                  required
                />
              </div>
            </div>

            {/* Economy Price */}
            <div className="flex items-center gap-3 mt-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                <FaDollarSign className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <label htmlFor="economyPrice" className="text-gray-400">Economy Price</label>
                <input
                  type="number"
                  id="economyPrice"
                  name="economyPrice"
                  value={economyPrice}
                  onChange={(e:any) => setEconomyPrice(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all mt-1"
                  required
                />
              </div>
            </div>

            {/* Business Price */}
            <div className="flex items-center gap-3 mt-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                <FaDollarSign className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <label htmlFor="businessPrice" className="text-gray-400">Business Price</label>
                <input
                  type="number"
                  id="businessPrice"
                  name="businessPrice"
                  value={businessPrice}
                  onChange={(e:any) => setBusinessPrice(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all mt-1"
                  required
                />
              </div>
            </div>

            {/* First Class Price */}
            <div className="flex items-center gap-3 mt-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                <FaDollarSign className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <label htmlFor="firstClassPrice" className="text-gray-400">First Class Price</label>
                <input
                  type="number"
                  id="firstClassPrice"
                  name="firstClassPrice"
                  value={firstClassPrice}
                  onChange={(e:any) => setFirstClassPrice(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all mt-1"
                  required
                />
              </div>
            </div>

            {/* Number of Passengers */}
            <div className="flex items-center gap-3 mt-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                <FaUserFriends className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <label htmlFor="numberOfPassengers" className="text-gray-400">Number of Passengers</label>
                <input
                  type="number"
                  id="numberOfPassengers"
                  name="numberOfPassengers"
                  value={numberOfPassengers}
                  onChange={(e:any) => setNumberOfPassengers(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all mt-1"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => proceed()}
              className="w-full cursor-pointer bg-gradient-to-r from-green-500 to-cyan-600 py-3 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-cyan-700 transition-all transform hover:scale-105 mt-4"
            >
              Proceed
            </button>
            </div>

            <div className="w-1/2 flex justify-center">
                <div className="md:w-lg px-8 py-6 bg-gradient-to-br from-gray-900 via-black to-gray-950 shadow-xl text-center rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">Flight Insurance Criteria</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <FaMapMarkerAlt className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">Insurance of flight is available for all locations in the world. The number of passengers and prices of tickets will determine the price of the insurance.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <FaClock className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">The default delay time is 1 hour. If the delay time is more than 1 hour, the insurance will be valid.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <FaPlane className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">If flight is cancelled, the insurance will be valid.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <FaCheckCircle className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">If flight takes off without any delay or cancellation, the premium can be claimed back by the insurer.</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            )}

            {currentTab === "passengers" && (
            <div className="w-full flex items-center">
            <div className="md:w-1/2">
            {/* Add Passenger Section */}
            <div className="bg-[#101112] rounded-2xl py-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Add Passengers</h2>
              <div className="space-y-4">
                {/* Passenger Name */}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                    <FaUserFriends className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="passengerName" className="text-gray-400">Passenger Address</label>
                    <input
                      type="text"
                      id="passengerName"
                      name="name"
                      value={newPassenger.name}
                      onChange={handlePassengerInputChange}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all mt-1"
                      required
                    />
                  </div>
                </div>

                {/* Ticket Type */}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                    <FaTicketAlt className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="ticketType" className="text-gray-400">Ticket Type</label>
                    <select
                      id="ticketType"
                      name="ticketType"
                      value={newPassenger.ticketType}
                      onChange={handlePassengerInputChange}
                      className="w-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all mt-1"
                      required
                    >
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="First Class">First Class</option>
                    </select>
                  </div>
                </div>


                <div className="flex items-center gap-3">
                    <button
                    type="button"
                    onClick={() => setCurrentTab("flightDetails")}
                    className="w-full cursor-pointer mt-6 bg-gray-400 py-3 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-cyan-700 transition-all transform hover:scale-105"
                    >
                    <FaArrowLeft className="inline-block mr-2" />
                    Back
                    </button>
                    <button
                    type="button"
                    onClick={handleAddPassenger}
                    className="w-full cursor-pointer mt-6 bg-gradient-to-r from-green-500 to-cyan-600 py-3 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-cyan-700 transition-all transform hover:scale-105"
                    >
                    <FaPlus className="inline-block mr-2" />
                    Add Passenger
                    </button>
                </div>

                {passengers.length > 0 && (
                <button
                type="button"
                onClick={confirmationPrompt}
                className="w-full cursor-pointer mt-6 bg-gradient-to-r from-green-500 to-cyan-600 py-3 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-cyan-700 transition-all transform hover:scale-105"
                >
                <FaPlane className="inline-block mr-2" />
                Proceed
                </button>
                )}
              </div>
            </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
            <div className="md:w-lg px-8 py-6 bg-gradient-to-br from-gray-900 via-black to-gray-950 shadow-xl text-center rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Passengers</h2>
              {passengers.length > 0 && (
              <div className="">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="py-2">Name</th>
                        <th>Ticket Type</th>
                        <th>Ticket Price (FLR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passengers.map((passenger, idx) => (
                        <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900 transition">
                          <td className="py-2 font-semibold">{passenger.name}</td>
                          <td>{passenger.ticketType}</td>
                          <td>{passenger.ticketType === "Economy" ? economyPrice : passenger.ticketType === "Business" ? businessPrice : firstClassPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            </div>
            </div>
            </div>
            )}
          </div>
        </div>
      </main>

      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="md:w-lg px-8 py-6 bg-gradient-to-br from-gray-900 via-black to-gray-950 shadow-xl text-center rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Confirmation</h2>
            <p className="text-gray-400">Are you sure you want to proceed?</p>
            <p className="text-red-400">The total price of the insurance is {passengers.reduce((total, passenger) => {
              const ticketPrice = passenger.ticketType === "Economy" ? economyPrice : 
                                 passenger.ticketType === "Business" ? businessPrice : 
                                 firstClassPrice;
              return total + (ticketPrice * 0.1);
            }, 0)} FLR</p>
            <div className="flex items-center gap-3">
                <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                className="w-full cursor-pointer mt-6 bg-gray-400 py-3 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-cyan-700 transition-all transform hover:scale-105"
                >
                <FaArrowLeft className="inline-block mr-2" />
                Back
                </button>
                <button className="w-full cursor-pointer mt-6 bg-gradient-to-r from-green-500 to-cyan-600 py-3 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-cyan-700 transition-all transform hover:scale-105">
                    Proceed
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsureFlightPage;