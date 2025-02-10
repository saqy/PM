import React from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';

interface SelectProps {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  value: MultiValue<{ value: string; label: string }>;
  onChange: (
    selectedOptions: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => void;
}

export const CustomSelect: React.FC<SelectProps> = ({
  label,
  error,
  options,
  value,
  onChange,
}) => {
  const errorStyles = error
    ? { borderColor: 'red', boxShadow: '0 0 0 1px red' }
    : {};

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <Select
        value={value}
        onChange={onChange}
        options={options}
        isMulti
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#4C9AFF' : '#D1D5DB',
            borderWidth: '2px',
            boxShadow: state.isFocused ? '0 0 0 1px #4C9AFF' : 'none',
            '&:hover': { borderColor: state.isFocused ? '#4C9AFF' : '#D1D5DB' },
            ...errorStyles,
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#4C9AFF',
            color: 'white',
            borderRadius: '5px',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: 'white',
            padding: '0 6px',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'white',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'red',
              color: 'white',
            },
          }),
          placeholder: (base) => ({
            ...base,
            color: '#6B7280',
          }),
        }}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
