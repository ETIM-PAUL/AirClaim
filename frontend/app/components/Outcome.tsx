import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon, XSquareIcon } from 'lucide-react';
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router';

const Outcome = ({ open, setOpen, mode, title, message }:any) => {
  const navigate = useNavigate();
    function Balloons() {
        // Simple CSS balloons floating up
        return (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute bottom-0 rounded-full opacity-70"
                style={{
                  left: `${(i * 12) % 100}%`,
                  width: `${18 + (i % 5) * 6}px`,
                  height: `${24 + (i % 5) * 6}px`,
                  background: i % 2 ? "#34d399" : "#22d3ee",
                  filter: "blur(0.2px)",
                  animation: `float-up ${6 + (i % 4)}s linear ${i * 0.2}s forwards`,
                  borderRadius: "9999px",
                }}
              />
            ))}
            <style>{`
              @keyframes float-up {
                0% { transform: translateY(0) scale(1); opacity: 0.95; }
                100% { transform: translateY(-120%) scale(1.05); opacity: 0; }
              }
            `}</style>
          </div>
        );
      }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={() => setOpen(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 text-white shadow-2xl relative overflow-hidden">
                {/* Balloons for win */}
                {mode === "win" && <Balloons />}

                <div className="flex items-start gap-3">
                  <div>
                    <Dialog.Title className="text-lg text-red-400 font-semibold">{title}</Dialog.Title>
                    <p className="mt-2 text-black">{message}</p>
                  </div>
                  <button onClick={() => setOpen(false)} className="ml-auto cursor-pointer text-black hover:text-green-500">
                    <XSquareIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {setOpen(false);navigate("/insured-flights")}}
                    className="w-full py-2 rounded-xl bg-black/40 hover:bg-black/60 cursor-pointer transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Outcome