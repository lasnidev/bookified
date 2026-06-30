'use client'
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const navItems = [
  {label:'Library', href:'/'},
  {label:'Add New', href:'/books/new'}
]

const Navbar = () => {
  const pathName = usePathname();
  const {user} = useUser();

  return (
    <header className='navbar '>
      <div className='wrapper navbar-height py-4 flex justify-between  items-center' >
        <Link href='/' className='flex gap-0.5 items-center'>
         <Image src="/assets/logo.png" alt='Bookified' width={42} height={26}/>
         <span className='logo-text'>Bookified</span>
        </Link>

        <div className='flex items-center justify-between'>
           <nav className=' flex gap-7.5 items-center justify-center pr-10'>
          {navItems.map(({label, href})=> {
            const isActive = pathName === href || (href != '/' && pathName.startsWith(href));

            return (
              <Link 
              href={href} 
              key={label}
              className={`nav-link-base ${isActive ? 'nav-link-active' : 'text-black hover:opacity-70'}`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className='nav-auth '>
          <Show when='signed-out'>
            <SignInButton mode='modal'>
              <button className='nav-auth-secondary'>Sign in</button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <button className='nav-auth-primary'>Sign up</button>
            </SignUpButton>
          </Show>
          <Show when='signed-in'>
            <UserButton />
            {user?.firstName && 
            <Link href='/subscriptions' className='nav-user-name'>{user.firstName}
            </Link>
            }
          </Show>
        </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
