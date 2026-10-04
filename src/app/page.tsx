'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Receipt, Users, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary-200 selection:text-primary-900">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">LedgerLite</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full transition-all shadow-sm hover:shadow active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-medium mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              Now available for everyone
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
            >
              Smart accounting for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                modern businesses
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10"
            >
              Track sales, manage expenses, and keep an eye on your cashflow in real-time. Built specifically for business owners who hate complex accounting software.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link 
                href="/signup" 
                className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-all hover:shadow-lg active:scale-95 w-full sm:w-auto"
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                className="flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-full transition-all active:scale-95 w-full sm:w-auto"
              >
                View demo
              </button>
            </motion.div>
          </div>

          {/* Hero Image Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-20 relative mx-auto max-w-4xl"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary-100/50 to-transparent -mx-20 -top-20 -bottom-20 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="aspect-[16/9] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
              {/* Fake Browser Chrome */}
              <div className="h-10 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              {/* Fake App Content */}
              <div className="flex-1 p-8 flex items-center justify-center bg-slate-50">
                <div className="text-slate-400 font-medium flex flex-col items-center gap-4">
                  <BarChart3 className="w-16 h-16 opacity-20" />
                  <p>Your beautiful dashboard goes here</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need, nothing you don't</h2>
            <p className="text-lg text-slate-600">Ditch the spreadsheets. LedgerLite automates your daily bookkeeping.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Receipt className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Invoicing</h3>
              <p className="text-slate-600 leading-relaxed">
                Create and send professional invoices in seconds. Track who owes you money and when it's due.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Customer CRM</h3>
              <p className="text-slate-600 leading-relaxed">
                Keep all your customer and supplier details in one place. View complete transaction histories instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-600 leading-relaxed">
                Your financial data is encrypted and securely backed up to the cloud. You own your data forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">LedgerLite</span>
          </div>
          <p className="text-slate-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} LedgerLite Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
