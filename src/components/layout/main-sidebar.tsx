
"use client";

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { LayoutDashboard, Wallet, Settings } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

export function MainSidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/expenses',
      label: 'Expenses',
      icon: Wallet,
    },
     {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <div className="p-2 flex items-center gap-2">
                <h1 className="text-xl font-semibold">VizExpense</h1>
            </div>
            <div className="sm:hidden flex items-center gap-2">
                <SidebarTrigger />
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {mounted && user && (
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                >
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        {(!mounted || loading) ? null : user ? (
          <UserNav />
        ) : (
          <div className="flex flex-col gap-2">
             <Button asChild variant="outline"><a href="/login">Login</a></Button>
             <Button asChild><a href="/signup">Sign Up</a></Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
