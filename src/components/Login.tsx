import { useState } from 'react';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import VoiceTypeLogo from './VoiceTypeLogo';

type Mode = 'login' | 'forgot';

const Login = () => {
  const { signIn, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const { error: signInError } = await signIn(email.trim(), password);
    if (signInError) {
      setError('Invalid email or password.');
    }
  };

  const handleForgot = async () => {
    const { error: resetError } = await sendPasswordReset(email.trim());
    if (resetError) {
      setError(resetError);
    } else {
      setMessage('If an account exists for this email, a reset link has been sent.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await handleLogin();
      } else {
        await handleForgot();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setMessage(null);
    setPassword('');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <VoiceTypeLogo />

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
        >
          <h2 className="mb-1 text-center text-2xl font-bold text-gray-800">
            {mode === 'login' ? 'Welcome back' : 'Reset your password'}
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            {mode === 'login'
              ? 'Sign in to continue to VoiceType.'
              : 'Enter your email to receive a reset link.'}
          </p>

          <div className="space-y-4">
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-700 outline-none transition-colors focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {mode === 'login' && (
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-700 outline-none transition-colors focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            {mode === 'login' ? 'Sign in' : 'Send reset link'}
          </button>

          <div className="mt-5 text-center">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Back to sign in
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
