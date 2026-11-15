import React, { useState } from 'react';
import { X, ShieldAlert, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CyberButton } from '../common/CyberButton';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(username || email, password);
        setSuccess('Logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        await register(username, email, password);
        setSuccess('Account created and logged in!');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#101014] border border-[#FF3038]/50 rounded-2xl shadow-[0_0_40px_rgba(255,48,56,0.3)] p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#FF3038]/20">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-[#FF3038]" />
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {isLogin ? 'OPERATOR SIGN IN' : 'CREATE DEFENDER ACCOUNT'}
              </h3>
              <p className="text-xs text-[#A0A0A8]">Track learning progress & certifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#A0A0A8] hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#A0A0A8] mb-1.5">
              {isLogin ? 'Username or Email' : 'Username'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#A0A0A8] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={isLogin ? 'e.g. cyber_cadet or email' : 'Choose a username'}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#07070A] border border-[#FF3038]/30 focus:border-[#FF3038] text-sm text-white placeholder-[#666672] focus:outline-none transition"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A8] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0A0A8] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#07070A] border border-[#FF3038]/30 focus:border-[#FF3038] text-sm text-white placeholder-[#666672] focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-[#A0A0A8] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A0A0A8] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#07070A] border border-[#FF3038]/30 focus:border-[#FF3038] text-sm text-white placeholder-[#666672] focus:outline-none transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <CyberButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </CyberButton>
          </div>
        </form>

        {/* Toggle between login and register */}
        <div className="mt-5 pt-4 border-t border-[#FF3038]/20 text-center text-xs text-[#A0A0A8]">
          {isLogin ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-[#FF5555] font-semibold hover:underline"
              >
                Create one now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-[#FF5555] font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
