import React from 'react';
import Tooltip from './Tooltip';

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  unit?: string;
  step?: number;
  tooltipText?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', unit, step, tooltipText }) => {
  return (
    <div>
      <div className="flex items-center mb-1">
        <label htmlFor={name} className="text-base font-semibold text-brand-green">
          {label}
        </label>
        {tooltipText && <Tooltip text={tooltipText} />}
      </div>
      <div className="relative">
        {unit === 'R' && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <span className="text-gray-500 text-base">{unit}</span>
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          step={step}
          className={`block w-full rounded-lg border border-gray-300 bg-gray-50 text-base text-brand-brown shadow-sm transition duration-200
                     focus:border-brand-green focus:ring-2 focus:ring-brand-tan 
                     ${unit === 'R' ? 'pl-8' : 'pl-4'} ${unit && unit !== 'R' ? 'pr-12' : 'pr-4'} py-2.5`}
        />
        {unit && unit !== 'R' && (
           <div className="pointer-events-none absolute inset-y-0 right-0 pr-4 flex items-center">
            <span className="text-gray-500 text-base">{unit}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
