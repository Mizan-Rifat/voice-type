import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface AccordionItemProps {
  title: string;
  isActive: boolean;
  onSelect: () => void;
  children: ReactNode;
}

const AccordionItem = ({ title, isActive, onSelect, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isActive
          ? 'border-blue-300 bg-blue-50/80 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <button
        type="button"
        onClick={toggleOpen}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
          {title}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <button
            type="button"
            onClick={onSelect}
            className={`mb-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isActive ? 'Selected' : 'Use this prompt'}
          </button>
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
