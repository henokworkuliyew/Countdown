'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  Calendar,
  Clock,
  Home,
  ImageIcon,
  LogOut,
  Menu,
  MessageSquare,
  User,
  X,
  Settings,
} from 'lucide-react'

export default function MainNavigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  // Simulate fetching notifications
  useEffect(() => {
    if (session) {
      // This would be replaced with an actual API call
      setNotificationCount(Math.floor(Math.random() * 5))
    }
  }, [session])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Countdown', href: '/countdown', icon: Clock },
    { name: 'Memories', href: '/memories', icon: ImageIcon },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Events', href: '/events', icon: Calendar },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-16 items-center px-4 border-b bg-white">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            BDU
          </div>
          <span className="font-bold text-lg">CS Countdown</span>
        </Link>

        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors flex items-center space-x-1 hover:text-blue-600 ${
                  isActive ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          {status === 'loading' ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : !session ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          session.user.image ||
                          '/placeholder.svg?height=32&width=32'
                        }
                        alt={session.user.name || 'User'}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          session.user.image ||
                          '/placeholder.svg?height=32&width=32'
                        }
                        alt={session.user.name || 'User'}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex h-16 items-center px-4 border-b bg-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            BDU
          </div>
          <span className="font-bold text-lg">CS Countdown</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {session && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-16 items-center px-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                BDU
              </div>
              <span className="font-bold text-lg">CS Countdown</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={toggleMobileMenu}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="mt-2 px-2">
            <div className="space-y-1 py-4">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-4 text-base font-medium rounded-md hover:bg-gray-100 ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    <item.icon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {session ? (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4 py-3">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          session.user.image ||
                          '/placeholder.svg?height=40&width=40'
                        }
                        alt={session.user.name || 'User'}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {session.user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {session.user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                    onClick={toggleMobileMenu}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      toggleMobileMenu()
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 pb-3 px-4">
                <div className="flex flex-col gap-2">
                  <Button className="w-full" asChild>
                    <Link href="/auth/login" onClick={toggleMobileMenu}>
                      Log in
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/signup" onClick={toggleMobileMenu}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
