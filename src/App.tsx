import { Loader2 } from 'lucide-react';
import { useAuth } from './context/auth-context';
import Login from './components/Login';
import UpdatePassword from './components/UpdatePassword';
import Workspace from './components/Workspace';

const App = () => {
  const { user, loading, isRecovery } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (isRecovery) {
    return <UpdatePassword />;
  }

  if (!user) {
    return <Login />;
  }

  return <Workspace />;
};

export default App;
