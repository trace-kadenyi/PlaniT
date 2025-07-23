import { Listbox } from '@headlessui/react';

const priorities = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' },
];

export default function PrioritySelect({ selected, onChange }) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="w-full py-2 pl-3 pr-10 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-[#9B2C62]">
          {selected.label}
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {priorities.map((priority) => (
            <Listbox.Option
              key={priority.value}
              value={priority}
              className={({ active }) =>
                `cursor-pointer select-none px-4 py-2 text-sm ${
                  active ? 'bg-[#9B2C62] text-white' : 'text-gray-700'
                }`
              }
            >
              {priority.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
