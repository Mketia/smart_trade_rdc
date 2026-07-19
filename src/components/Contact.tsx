import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactProps {
}

export const Contact: React.FC<ContactProps> = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-zinc-900 dark:text-white font-display">
          Contact Us
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Get in touch with the SmartTrade RDC team for support, inquiries, or feedback.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-start gap-4">
            <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Email</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">support@smarttrade.cd</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-start gap-4">
            <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Phone</h4>
              <a href="tel:+250798263372" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-500 transition-colors">+250 798 263 372</a>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-zinc-150 dark:border-zinc-850 flex items-start gap-4">
            <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Office</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Goma, North Kivu, DRC</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 glass-panel p-8 rounded-2xl border border-zinc-150 dark:border-zinc-850">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center">
                <Send className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Message Sent!</h3>
              <p className="text-zinc-500 dark:text-zinc-400">We will get back to you as soon as possible.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="px-6 py-2 bg-brand-500 text-white font-bold rounded-xl text-sm cursor-pointer"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Name</label>
                  <input required type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors text-zinc-900 dark:text-white" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Email</label>
                  <input required type="email" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors text-zinc-900 dark:text-white" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Subject</label>
                <input required type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors text-zinc-900 dark:text-white" placeholder="How can we help?" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Message</label>
                <textarea required rows={5} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors text-zinc-900 dark:text-white resize-none" placeholder="Your message here..." />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all cursor-pointer"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
