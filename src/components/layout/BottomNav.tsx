"use client"

import Link from 'next/link'
import { Home, Users, Receipt, PlusCircle, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/contacts', icon: Users, label: 'Contacts' },
    { href: '/add', icon: PlusCircle, label: 'Add', isPrimary: true },
    { href: '/cashbook', icon: Receipt, label: 'Cashbook' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16 relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          if (item.isPrimary) {
            return (
              <div key="primary" className="flex flex-col items-center justify-center w-full h-full relative z-10">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -top-6 bg-primary-600 text-white rounded-full p-3 shadow-lg shadow-primary-500/40 cursor-pointer"
                >
                  <item.icon size={28} />
                </motion.div>
              </div>
            )
          }

          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex flex-col items-center justify-center w-full h-full relative ${isActive ? 'text-primary-600' : 'text-slate-500'}`}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center justify-center relative"
              >
                <item.icon size={24} className={`transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-slate-500 group-hover:text-primary-500'}`} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-2 w-1 h-1 bg-primary-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
