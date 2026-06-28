import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import CleanLayout from './Layout';
import VoiceTypeLogo from './VoiceTypeLogo';
import InputSection from './InputSection';
import HistorySidebar from './HistorySidebar';
import Sidebar from './Sidebar';
import { PROMPTS } from '../data/prompts';
import useHistory from '../hooks/useHistory';
import { useAuth } from '../context/auth-context';

const SELECTED_PROMPT_KEY = 'voice-type:selected-prompt';

const getStoredPromptId = () => {
  try {
    const stored = localStorage.getItem(SELECTED_PROMPT_KEY);
    if (stored && PROMPTS.some(prompt => prompt.id === stored)) {
      return stored;
    }
  } catch {
    // localStorage unavailable (e.g. private browsing)
  }
  return PROMPTS[0].id;
};

const Workspace = () => {
  const { user, signOut } = useAuth();
  const [selectedPromptId, setSelectedPromptId] = useState(getStoredPromptId);

  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_PROMPT_KEY, selectedPromptId);
    } catch {
      // ignore write failures
    }
  }, [selectedPromptId]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [historySidebarExpanded, setHistorySidebarExpanded] = useState(true);

  const { entries, submitEntry, addRewriteItem, deleteItem, deleteEntry } = useHistory();

  const selectedPrompt = PROMPTS.find(prompt => prompt.id === selectedPromptId) ?? PROMPTS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <CleanLayout
        sidebarExpanded={sidebarExpanded}
        historySidebarExpanded={historySidebarExpanded}
        sidebar={
          <Sidebar
            prompts={PROMPTS}
            selectedId={selectedPromptId}
            onSelect={setSelectedPromptId}
            isExpanded={sidebarExpanded}
            onExpandedChange={setSidebarExpanded}
          />
        }
        rightSidebar={
          <HistorySidebar
            entries={entries}
            isExpanded={historySidebarExpanded}
            onExpandedChange={setHistorySidebarExpanded}
            onDeleteItem={deleteItem}
            onDeleteEntry={deleteEntry}
          />
        }
      >
        <VoiceTypeLogo />

        <InputSection
          selectedPrompt={selectedPrompt}
          onSubmit={submitEntry}
          onRewriteComplete={addRewriteItem}
        />

        <div className="mt-12 flex flex-col items-center gap-3 text-center text-gray-400 text-sm">
          <p>Type or speak, submit, then rewrite with AI.</p>
          <div className="flex items-center gap-3">
            {user?.email && <span className="text-gray-500">{user.email}</span>}
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </CleanLayout>
    </div>
  );
};

export default Workspace;
