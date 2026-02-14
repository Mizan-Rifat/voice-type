import CleanLayout from './components/Layout';
import VoiceTypeLogo from './components/VoiceTypeLogo';
import InputSection from './components/InputSection';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center pt-20">
      <CleanLayout>
        <VoiceTypeLogo />

        <InputSection />

        {/* Footer/Helper Text */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Type or speak to see the magic happen.</p>
        </div>
      </CleanLayout>
    </div>
  );
}

export default App;
