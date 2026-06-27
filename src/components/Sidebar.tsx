import { Menu, PanelLeft, PanelLeftClose, X } from 'lucide-react';
import { useState } from 'react';
import type { Prompt } from '../data/prompts';
import AccordionItem from './AccordionItem';

interface SidebarProps {
  prompts: Prompt[];
  selectedId: string;
  onSelect: (id: string) => void;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

interface SidebarContentProps {
  prompts: Prompt[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCollapse?: () => void;
}

const SidebarContent = ({ prompts, selectedId, onSelect, onCollapse }: SidebarContentProps) => (
  <div className="flex flex-col gap-3">
    <div className="mb-2 flex items-start justify-between gap-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">AI Prompts</h2>
        <p className="mt-1 text-sm text-gray-500">Select a prompt to rewrite your text.</p>
      </div>
      {onCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={20} />
        </button>
      )}
    </div>

    {prompts.map(prompt => (
      <AccordionItem
        key={prompt.id}
        title={prompt.title}
        isActive={selectedId === prompt.id}
        onSelect={() => onSelect(prompt.id)}
      >
        <p className="mb-3 text-sm text-gray-600">{prompt.description}</p>
        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
          {prompt.prompt}
        </div>
      </AccordionItem>
    ))}
  </div>
);

const Sidebar = ({
  prompts,
  selectedId,
  onSelect,
  isExpanded,
  onExpandedChange,
}: SidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50 md:hidden"
        aria-label="Open prompts menu"
      >
        <Menu size={18} />
        Prompts
      </button>

      {!isExpanded && (
        <button
          type="button"
          onClick={() => onExpandedChange(true)}
          className="fixed left-4 top-4 z-40 hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50 md:flex"
          aria-label="Expand sidebar"
        >
          <PanelLeft size={18} />
          Prompts
        </button>
      )}

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close prompts menu"
          />
          <aside className="absolute left-0 top-0 h-screen w-[min(100%,320px)] overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Prompts</h2>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent prompts={prompts} selectedId={selectedId} onSelect={handleSelect} />
          </aside>
        </div>
      )}

      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen w-72 overflow-y-auto border-r border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-transform duration-300 md:block ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          prompts={prompts}
          selectedId={selectedId}
          onSelect={onSelect}
          onCollapse={() => onExpandedChange(false)}
        />
      </aside>
    </>
  );
};

export default Sidebar;
