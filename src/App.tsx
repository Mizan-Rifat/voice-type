import { useState } from 'react';
import CleanLayout from './components/Layout';
import VoiceTypeLogo from './components/VoiceTypeLogo';
import InputSection from './components/InputSection';
import HistorySidebar from './components/HistorySidebar';
import Sidebar from './components/Sidebar';
import { PROMPTS } from './data/prompts';
import useHistory from './hooks/useHistory';

const App = () => {
  const [selectedPromptId, setSelectedPromptId] = useState(PROMPTS[0].id);
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

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Type or speak, submit, then rewrite with AI.</p>
        </div>
      </CleanLayout>
    </div>
  );
};

export default App;
