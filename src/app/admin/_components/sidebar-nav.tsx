'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Building2, LayoutDashboard, Users, CircleDollarSign } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/companies', label: 'Companies', icon: Building2 },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/placements', label: 'Placements', icon: CircleDollarSign },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
