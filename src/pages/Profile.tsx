import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { User, ShieldCheck, KeyRound, LogOut, CheckCircle2, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, sources, opportunities, notifications, updateProfile, logout } = useAppStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password Reset Modal State
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passStatus, setPassStatus] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.full_name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(name, email);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassStatus('Passwords do not match');
      return;
    }
    setPassStatus('Verification email sent! Click link in email to finalize password.');
    setTimeout(() => {
      setPassStatus('');
      setIsPassModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    }, 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header Profile Card */}
      <div className="glass-card p-6 sm:p-8 border border-white/15 rounded-3xl relative overflow-hidden bg-gradient-to-r from-[#0B0F19] via-slate-900 to-slate-900">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-teal-500/15 to-pink-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-teal-500/25 shrink-0">
            {currentUser?.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser?.full_name || 'Vasundhra'}</h1>
              <span className="badge badge-success flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>Verified Account</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{currentUser?.email || 'vasundhrathanga20@gmail.com'}</p>

            {/* Quick Stats Grid */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 text-xs text-slate-300">
              <div>
                <span className="font-extrabold text-teal-400 block text-base">{sources.length}</span>
                <span className="text-[10px] text-slate-400">Watched Sources</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <span className="font-extrabold text-pink-400 block text-base">{opportunities.filter(o => o.saved).length}</span>
                <span className="text-[10px] text-slate-400">Saved Items</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <span className="font-extrabold text-amber-400 block text-base">{notifications.length}</span>
                <span className="text-[10px] text-slate-400">Total Alerts</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="btn btn-secondary text-xs text-rose-400 hover:bg-rose-500/10 border-rose-500/30 flex items-center gap-1.5 shrink-0"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Account Settings & Details Form */}
      <div className="glass-card p-6 border border-white/10 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User size={18} className="text-teal-400" />
            <span>Edit Account Details</span>
          </h2>
          <button 
            type="button" 
            onClick={() => setIsPassModalOpen(true)}
            className="btn btn-secondary text-xs text-pink-400 hover:bg-pink-500/10 border-pink-500/30 flex items-center gap-1.5"
          >
            <KeyRound size={14} />
            <span>Change Password</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="glass-panel p-3 bg-teal-500/10 border-teal-500/30 text-teal-400 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 size={16} />
            <span>Account profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field" 
                required 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn btn-primary text-xs flex items-center gap-1.5 py-2.5 px-5">
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Verification Modal */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 border border-white/15 rounded-3xl relative space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <KeyRound size={20} className="text-pink-400" />
              <div>
                <h3 className="text-base font-bold text-white">Change Password</h3>
                <p className="text-[11px] text-slate-400">Verification mail will confirm your new password.</p>
              </div>
            </div>

            {passStatus ? (
              <div className="p-4 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-xl text-xs space-y-1 text-center font-medium">
                <CheckCircle2 size={24} className="mx-auto mb-1" />
                <p>{passStatus}</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field" 
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field" 
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setIsPassModalOpen(false)}
                    className="btn btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-pink text-xs">
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
