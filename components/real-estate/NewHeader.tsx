import React, { useState } from 'react';
import { Menu, Phone, User, ChevronDown, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  'Home','Listings','Members','Blog','Pages','Contact'
];

export default function NewHeader(){
  const [open,setOpen] = useState(false);
  return (
    <header className='w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between gap-4'>
          {/* Logo */}
          <div className='flex items-center gap-3 shrink-0'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl border font-bold'>
              JH
            </div>
            <span className='text-2xl font-semibold tracking-tight'>JustHome</span>
          </div>

          {/* Desktop Nav */}
          <nav className='hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-700'>
            {navItems.map((item,idx)=>(
              <a key={item} href='#' className='flex items-center gap-1 hover:text-black transition-colors'>
                {item}
                {idx < 5 && item !== 'Contact' && <ChevronDown className='h-4 w-4'/>}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className='hidden md:flex items-center gap-3 shrink-0'>
            <div className='flex items-center gap-2 text-sm font-medium text-zinc-700'>
              <Phone className='h-4 w-4'/>
              <span>+68 685 88666</span>
            </div>
            <button className='flex h-10 w-10 items-center justify-center rounded-full border hover:bg-zinc-50'>
              <User className='h-4 w-4'/>
            </button>
            <Button className='rounded-full px-6 h-11 bg-zinc-100 text-black hover:bg-zinc-200'>
              Add Property
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className='lg:hidden flex items-center gap-2'>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon' className='rounded-full'>
                  <Menu className='h-5 w-5'/>
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[300px] sm:w-[360px]'>
                <div className='mt-8 space-y-6'>
                  <div className='text-xl font-semibold'>JustHome</div>
                  <nav className='space-y-4'>
                    {navItems.map(item => (
                      <a key={item} href='#' className='block text-base font-medium text-zinc-700 hover:text-black'>{item}</a>
                    ))}
                  </nav>
                  <div className='pt-4 border-t space-y-4'>
                    <div className='flex items-center gap-2 text-sm'>
                      <Phone className='h-4 w-4'/> +68 685 88666
                    </div>
                    <Button className='w-full rounded-full'>Add Property</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
