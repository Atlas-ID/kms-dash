'use client';

import { usePathname } from 'next/navigation';
import { BarChart, KeyRound, Lightbulb, Settings, Home } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';

const navItems = [
  { href: '/keys', label: 'API Keys', icon: KeyRound },
  { href: '/statistics', label: 'Statistics', icon: BarChart },
  { href: '/suggest-scopes', label: 'Suggest Scopes', icon: Lightbulb },
  { href: '/settings', label: 'Settings', icon: Settings, hideInNav: true },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.filter(item => !item.hideInNav).map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <a>
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
