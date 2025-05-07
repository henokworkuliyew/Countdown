'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Calendar,
  Clock,
  Home,
  ImageIcon,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'

export function SidebarNavigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const mainNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Countdown', href: '/countdown', icon: Clock },
    { name: 'Memories', href: '/memories', icon: ImageIcon },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Events', href: '/events', icon: Calendar },
  ]

  const accountNavItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  if (!session) return null

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            BDU
          </div>
          <span className="font-bold text-lg">CS Countdown</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href))
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {session && (
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  session.user.image || '/placeholder.svg?height=40&width=40'
                }
                alt={session.user.name || 'User'}
              />
              <AvatarFallback>
                {session.user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <div className="font-medium truncate">{session.user.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {session.user.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  )
}
