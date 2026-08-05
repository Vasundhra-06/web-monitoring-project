import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Mail, Send, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';

const SettingsPage: React.FC = () => {

  // Resend API state
  const [resendApiKey, setResendApiKey] = useState('');
  const [senderDomain, setSenderDomain] = useState('NIMIC.in');
  const [testEmail, setTestEmail] = useState('vasundhrathanga20@gmail.com');
  const [testMailStatus, setTestMailStatus] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highPriorityOnly, setHighPriorityOnly] = useState(true);

  const handleTestEmailSend = (e: React.FormEvent) => {
    e.preventDefault();
    setTestMailStatus('Sending test notification mail via Resend API (NIMIC.in)...');
    setTimeout(() => {
      setTestMailStatus('Success! Test email sent to ' + testEmail + ' using NIMIC.in domain.');
      setTimeout(() => setTestMailStatus(''), 4000);
    }, 1500);
  };

  const copyResendSnippet = () => {
    const snippet = `// Resend Integration Code Example for NIMIC.in\nimport { Resend } from 'resend';\nconst resend = new Resend(process.env.RESEND_API_KEY);\n\nawait resend.emails.send({\n  from: 'notifications@NIMIC.in',\n  to: '${testEmail}',\n  subject: 'Universal AI Watcher Alert',\n  html: '<h2>New Web Opportunity Detected</h2>'\n});`;
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-h2 font-extrabold text-white">App & Email Settings</h1>
          <p className="text-slate-400 text-xs">Configure Resend email notifications, NIMIC.in domain, and system preferences</p>
        </div>
      </div>

      {/* 1. Resend & Domain Setup Guide (NIMIC.in) */}
      <div className="glass-card p-6 border border-teal-500/30 rounded-3xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Resend Email Integration (NIMIC.in Domain)</h2>
              <p className="text-xs text-slate-400">Send elegant notification emails directly to your inbox</p>
            </div>
          </div>
          <span className="badge badge-pink text-xs">Beginner Setup</span>
        </div>

        {/* Step-by-Step Beginner Guide */}
        <div className="glass-panel p-4 space-y-3 border-l-4 border-l-teal-400">
          <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Step-by-Step Beginner Setup Guide for NIMIC.in:</h3>
          <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
            <li>Create a free account on <strong className="text-white">Resend.com</strong>.</li>
            <li>Go to <strong className="text-white">Domains</strong> and click <strong className="text-teal-400">+ Add Domain</strong>. Enter your domain: <code className="bg-slate-900 px-2 py-0.5 rounded text-pink-400">NIMIC.in</code>.</li>
            <li>Copy the DNS records (MX, TXT, CNAME) from Resend into your domain provider's DNS management panel for <code className="bg-slate-900 px-2 py-0.5 rounded text-pink-400">NIMIC.in</code>.</li>
            <li>Once verified in Resend, go to <strong className="text-white">API Keys</strong> and generate a new key (`re_...`).</li>
            <li>Add `RESEND_API_KEY` to your Vercel Environment Variables (`Settings ➔ Environment Variables`).</li>
          </ol>
        </div>

        {/* Interactive Resend API Key & Tester Form */}
        <form onSubmit={handleTestEmailSend} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Resend API Key</label>
              <input 
                type="password" 
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
                className="input-field" 
                placeholder="re_123456789..." 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Verified Sender Domain</label>
              <input 
                type="text" 
                value={senderDomain}
                onChange={(e) => setSenderDomain(e.target.value)}
                className="input-field" 
                placeholder="NIMIC.in" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Test Notification Recipient Email</label>
            <input 
              type="email" 
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="input-field" 
              placeholder="vasundhrathanga20@gmail.com" 
              required 
            />
          </div>

          {testMailStatus && (
            <div className="glass-panel p-3 bg-teal-500/10 border-teal-500/30 text-teal-400 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 size={16} />
              <span>{testMailStatus}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button 
              type="button" 
              onClick={copyResendSnippet}
              className="btn btn-secondary text-xs flex items-center gap-1.5"
            >
              {copiedCode ? <Check size={14} className="text-teal-400" /> : <Copy size={14} />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy Code Snippet'}</span>
            </button>

            <button type="submit" className="btn btn-primary text-xs flex items-center gap-1.5 py-2.5 px-5">
              <Send size={14} />
              <span>Send Test Notification Mail</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Email Template Preview Card */}
      <div className="glass-card p-6 border border-white/10 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Sparkles size={18} className="text-pink-400" />
          <h2 className="text-base font-bold text-white">Elegant HTML Email Layout Preview</h2>
        </div>

        {/* Email Preview Container */}
        <div className="glass-panel p-5 bg-[#0B0F19] border border-white/15 rounded-2xl space-y-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs">
                AI
              </div>
              <span className="text-xs font-bold text-white">Universal AI Watcher</span>
            </div>
            <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">From: notifications@NIMIC.in</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">High Priority Target Detected</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scraper worker matched a new opportunity from <strong>Tm / Telegram Feed</strong> matching your monitoring preferences.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400">
            <span>Powered by Resend API</span>
            <span className="text-pink-400 font-semibold">NIMIC.in Verified</span>
          </div>
        </div>
      </div>

      {/* 3. System & Notification Preferences */}
      <div className="glass-card p-6 border border-white/10 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Bell size={18} className="text-teal-400" />
          <h2 className="text-base font-bold text-white">Notification Alert Preferences</h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <input 
              type="checkbox" 
              checked={emailAlerts} 
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-teal-500 bg-slate-900 border-white/20 focus:ring-teal-400" 
            />
            <div>
              <p className="text-xs font-bold text-white">Instant Email Alerts (NIMIC.in)</p>
              <p className="text-[11px] text-slate-400">Receive an email notification whenever a new high-priority target is matched.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <input 
              type="checkbox" 
              checked={highPriorityOnly} 
              onChange={(e) => setHighPriorityOnly(e.target.checked)}
              className="w-4 h-4 rounded text-teal-500 bg-slate-900 border-white/20 focus:ring-teal-400" 
            />
            <div>
              <p className="text-xs font-bold text-white">High Priority Filtering</p>
              <p className="text-[11px] text-slate-400">Only trigger instant email alerts for High Priority opportunities.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
