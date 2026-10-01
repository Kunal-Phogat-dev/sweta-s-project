import Link from 'next/link'
import { Home, Users, Receipt, PlusCircle, Settings } from 'lucide-react'

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-primary-600 active:text-primary-600">
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>
        <Link href="/contacts" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-primary-600 active:text-primary-600">
          <Users size={24} />
          <span className="text-[10px] mt-1 font-medium">Contacts</span>
        </Link>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="absolute -top-5 bg-primary-600 text-white rounded-full p-3 shadow-lg shadow-primary-500/30">
            <PlusCircle size={28} />
          </div>
        </div>
        <Link href="/cashbook" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-primary-600 active:text-primary-600">
          <Receipt size={24} />
          <span className="text-[10px] mt-1 font-medium">Cashbook</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-primary-600 active:text-primary-600">
          <Settings size={24} />
          <span className="text-[10px] mt-1 font-medium">Settings</span>
        </Link>
      </div>
    </nav>
  )
}
