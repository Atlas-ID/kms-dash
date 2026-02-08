'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { KeySquare, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export function DashboardSidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <KeySquare className="h-6 w-6" />
          </div>
          <span className="font-headline text-lg font-bold">KeyMaster</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint} />}
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-foreground">Admin</span>
            <span className="text-muted-foreground">admin@keymaster.dev</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={() => router.push('/settings')}>
            <Settings /> Settings
          </Button>
          <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={handleLogout}>
            <LogOut /> Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
