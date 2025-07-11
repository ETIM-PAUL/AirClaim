import React from 'react';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import { FaPlaneSlash, FaWallet, FaShieldAlt, FaCoins, FaGlobe, FaClock, FaRocket } from "react-icons/fa";
import { TbCancel, TbPlane } from "react-icons/tb";
import { BiSolidHourglassTop } from "react-icons/bi";
import { MdOutlineFlightTakeoff, MdOutlineFlightLand } from "react-icons/md";
import avatar1 from '../assets/avatar/avatar1.jpg';
import avatar2 from '../assets/avatar/avatar2.jpg';
import avatar3 from '../assets/avatar/avatar3.jpg';

const App: React.FC = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the FLR token reward system work?",
      answer:
        "When your flight is delayed and you initiate a claim, you'll be invited to play our prediction game. You'll select a series of numbers, and if they match our randomly generated numbers, you win FLR tokens. The more matches you get, the higher your reward. These tokens can be withdrawn to your crypto wallet or used for future insurance purchases."
    },
    {
      question: "How quickly will I receive compensation for delays?",
      answer:
        "For verified delays, compensation is typically processed within 24 hours of the claim. In many cases, you'll receive payment while still at the airport or shortly after landing. Our automated system tracks flight data in real-time, allowing for quick verification and processing."
    },
    {
      question: "Can I insure flights I've already booked?",
      answer:
        "Yes, you can purchase insurance for flights you've already booked as long as the departure is at least 24 hours away. Simply enter your flight details in the app, and we'll provide coverage options based on your itinerary."
    },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Flight Insurance",
      description: "Get affordable insurance for your flights that pays out automatically when delays are detected. No paperwork needed.",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: <FaCoins className="text-3xl" />,
      title: "Easy Claims",
      description: "We handle all the paperwork with airlines. Our app automatically detects delays and starts the claim process for you.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <FaRocket className="text-3xl" />,
      title: "FLR Token Rewards",
      description: "Win FLR tokens by predicting lucky numbers during the claim process. Add excitement to an otherwise frustrating delay!",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Real-time Tracking",
      description: "Monitor your flight status, insurance coverage, and claim progress in real-time through our intuitive app interface.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <FaGlobe className="text-3xl" />,
      title: "Global Coverage",
      description: "Available for flights worldwide with support for major airlines and airports across all continents.",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <FaWallet className="text-3xl" />,
      title: "Instant Payouts",
      description: "Receive compensation directly to your wallet or bank account as soon as your claim is approved.",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Insure Your Flight",
      description: "Enter your flight details in the app and purchase affordable insurance coverage in seconds.",
      icon: <MdOutlineFlightTakeoff className="text-2xl" />
    },
    {
      number: "02",
      title: "Monitor Status",
      description: "Our app automatically tracks your flight and alerts you of delays or cancellations.",
      icon: <BiSolidHourglassTop className="text-2xl" />
    },
    {
      number: "03",
      title: "Predict & Win",
      description: "If your flight is delayed, predict lucky numbers during the claim process for a chance to win FLR tokens.",
      icon: <FaCoins className="text-2xl" />
    },
    {
      number: "04",
      title: "Collect Payment",
      description: "Receive your compensation and any token rewards directly to your preferred payment method.",
      icon: <FaWallet className="text-2xl" />
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">✈</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Airclaim
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-green-400 transition-colors duration-300 font-medium">Features</a>
            <a href="#how-it-works" className="hover:text-green-400 transition-colors duration-300 font-medium">How It Works</a>
            <a href="#rewards" className="hover:text-green-400 transition-colors duration-300 font-medium">Rewards</a>
            <a href="#faq" className="hover:text-green-400 transition-colors duration-300 font-medium">FAQ</a>
          </nav>
          <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
            Connect Wallet
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Flight Delays? Get{" "}
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Insured & Rewarded
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Airclaim helps you get insurance for flight delay claim compensation, and win FLR tokens by predicting lucky numbers during your claim process.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                  Get Started
                </button>
                <button className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-xl font-semibold hover:bg-green-400 hover:text-black transition-all duration-300">
                  Learn More
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-black"></div>
                  ))}
                </div>
                <span>Join 10,000+ travelers already using Airclaim</span>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-80 h-96 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl transform rotate-6 shadow-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl transform -rotate-3 shadow-xl"></div>
                <div className="relative bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl p-6 shadow-2xl">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Flight Status</span>
                      <span className="text-red-400 font-semibold">Delayed (2h 15m)</span>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Flight: BA2490</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">JFK</span>
                        <div className="flex-1 h-px bg-gray-500"></div>
                        <span className="text-gray-400">LHR</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">🛡️ Insured</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Claim Status</p>
                      <p className="text-green-400 font-semibold">Processing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-6">Why Choose Airclaim</h2>
        <p className="text-center text-gray-400 mb-12">
          Airclaim offers a unique combination of flight insurance, compensation claims, and token rewards in one seamless experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`relative group bg-gradient-to-br ${feature.gradient} p-1 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105`}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-[#101010] rounded-2xl p-6 h-full flex flex-col items-center text-center transition-colors duration-300 group-hover:bg-black/80">
                <div className="mb-4 text-green-400">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-green-300">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
              {hoveredCard === idx && (
                <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-pulse pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">How Airclaim Works</h2>
        <p className="text-center text-gray-400 mb-12">
          Get insured, get compensated, and earn rewards in just a few simple steps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-green-400/20 transition-shadow duration-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white text-4xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-green-300">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLR Token Rewards Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">Win FLR Tokens While You Wait</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Turn frustration of flight delays into an opportunity to win cryptocurrency rewards. When your flight is delayed and you start a claim, you'll get to participate in our prediction game.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Predict a series of lucky numbers during your claim process</li>
              <li>Match numbers to win FLR tokens - the more matches, the bigger the prize</li>
              <li>Tokens are sent directly to your wallet within minutes</li>
              <li>No additional cost - included with every insurance claim</li>
            </ul>
            <button className="bg-gradient-to-r from-purple-400 to-pink-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              Learn About FLR Tokens
            </button>
          </div>
          <div className="relative">
            <div className="relative w-80 h-96 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl transform rotate-6 shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl transform -rotate-3 shadow-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl p-6 shadow-2xl">
                <div className="flex justify-around mb-4">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">7</span>
                  </div>
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">9</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-400">?</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-400">?</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">Prize: 50 FLR</p>
                <p className="text-sm text-gray-400 mb-2">Select your next number:</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      className="w-10 h-10 bg-gray-700 rounded-full text-white hover:bg-green-400"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mb-2">Your FLR Balance</p>
                <p className="text-lg font-bold mb-2">125 FLR</p>
                <p className="text-sm text-gray-400 mb-2">Previous Winnings</p>
                <p className="text-lg text-green-400 mb-2">75 FLR</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-400 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-sm text-gray-400 mt-1">65% chance of winning on this claim</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
        <h2 className="text-4xl font-bold text-center mb-6">Comprehensive Flight Coverage</h2>
        <p className="text-center text-gray-400 mb-12">
          Airchain provides insurance for various types of flight disruption, ensuring you're always protected.    </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-left">
            <div className="text-green-400 mb-2"><BiSolidHourglassTop className='text-3xl' /></div>
            <h1>Flight Delays</h1>
            <p className="text-gray-300 mb-10">
              Get compensation for delays starting from 1 hour. The longer the delay, the higher the payout
            </p>
            <div className="font-semibold text-white border-t border-gray-400  md:mx-8 lg:mx-1"></div>
            <div className="font-semibold text-white mt-2 flex justify-between ">Compensation starts at: <span className='text-green-300'>$50</span></div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-left">
            <div className="text-green-400 mb-2 w-16 h-16"><TbCancel className='text-3xl' /></div>
            <h1>Cancellations</h1>
            <p className="text-gray-300 mb-4 ">
              Full coverage for unexpected flight cancellations, including reimbursement for alternative arrangements.
            </p>
            <div className="font-semibold text-white border-t border-gray-400  md:mx-8 lg:mx-1"></div>
            <div className="font-semibold text-white mt-2 flex justify-between ">Compensation up to: <span className='text-green-300'>$500</span></div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-left">
            <div className="text-green-400 mb-2"><TbPlane className='text-3xl' /></div>
            <h1>Missed Connections</h1>
            <p className="text-gray-300 mb-4">
              Protection for missed connecting flights due to delays in your initial flight, including accommodation if needed.
            </p>
            <div className="font-semibold text-white border-t border-gray-400  md:mx-8 lg:mx-1"></div>
            <div className="flex justify-between font-semibold text-white mt-2">Compensation up to: <span className='text-green-300'>$300</span></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <h2 className="text-4xl font-bold text-center mb-6">What Our Users Say</h2>
        <p className="text-center text-gray-400 mb-12">
          Hear from travelers who have used Airclaim to turn flight delays into rewards.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-[#101010] border border-zinc-800 rounded-lg p-6 text-left">
            <div className="text-green-400 mb-2">★★★★★</div>
            <p className="text-gray-300 mb-4">
              "My flight was delayed by 3 hours, but I won 75 FLR tokens while waiting! The claim process was completely automated and the compensation arrived before I even landed."
            </p>
            <div className="avatar_container flex justify-start justify-center align-center">
              <img
                src={avatar1}
                alt={avatar1}
                className="w-15 h-15 rounded-full p-3  object-cover"
              />
              <div className='p-2'>

                <div className="font-semibold text-white">James Wilson</div>
                <div className="text-sm text-gray-500">Business Traveler</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-[#101010] border border-zinc-800 rounded-lg p-6 text-left">
            <div className="text-green-400 mb-2">★★★★★</div>
            <p className="text-gray-300 mb-4">
              "The prediction game made my 2-hour delay actually fun! I won some FLR tokens and the insurance payout covered my dinner at the airport. Brilliant concept!"
            </p>
            <div className="avatar_container flex justify-start justify-center align-center">
              <img
                src={avatar2}
                alt={avatar2}
                className="w-15 h-15 rounded-full p-3  object-cover"
              />
              <div className='p-2'>

                <div className="font-semibold text-white">Emily Chen</div>
                <div className="text-sm text-gray-500">Frequent Flyer</div>
              </div>
            </div>

          </div>

          {/* Testimonial 3 */}
          <div className="bg-[#101010] border border-zinc-800 rounded-lg p-6 text-left">
            <div className="text-green-400 mb-2">★★★★★</div>
            <p className="text-gray-300 mb-4">
              "I've tried other flight insurance apps, but Airclaim is by far the best. The token rewards are a unique touch, and their claim process is completely hassle-free."
            </p>
            <div className='justify-start justify-center align-center'>
            <img
                src={avatar3}
                alt={avatar3}
                className="w-15 h-15 rounded-full p-3  object-cover"
              />
              <div>
                <div className="font-semibold text-white">Michael Rodriguez</div>
                <div className="text-sm text-gray-500">Vacation Traveler</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-orange-500/10 to-red-500/10">
        <h2 className="text-4xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <p className="text-center text-gray-400 mb-12">
          Answers to common questions about Airclaim's insurance and rewards.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-[0_4px_12px_rgba(0,255,135,0.1)]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">{faq.question}</span>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-700 px-4 text-gray-400 ${isOpen ? 'max-h-40 pb-4' : 'max-h-0'}`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-12 py-10 border-t border-gray-800 mx-4 md:mx-8 lg:mx-16">

        <p className="text-center text-gray-400 mt-8">© 2023 Airclaim. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#privacy" className="text-gray-400 hover:text-green-400">Privacy</a>
          <a href="#terms" className="text-gray-400 hover:text-green-400">Terms</a>
          <a href="#cookies" className="text-gray-400 hover:text-green-400">Cookies</a>
        </div>
      </footer>
    </div>
  );
};

export default App;