import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
  onLoginSuccess: () => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'LandCruiser79') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg m-4">
        <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-brand-green" />
            <h2 className="mt-6 text-3xl font-bold font-serif text-brand-green">
              Access Protected
            </h2>
            <p className="mt-2 text-md text-gray-600">
              Please enter the password to view the proposal builder.
            </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-base text-brand-brown shadow-sm transition duration-200 focus:border-brand-green focus:ring-2 focus:ring-brand-tan p-3"
              placeholder="Password"
              aria-label="Password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center" role="alert">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center bg-brand-green text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-800 transition-all duration-300 transform hover:scale-105"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection;
