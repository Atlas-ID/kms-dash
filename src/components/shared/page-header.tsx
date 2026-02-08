'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export function PageHeader({
  title,
  description,
  children,
  showBackButton = false
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      {showBackButton && (
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hidden md:inline-flex">
          <ArrowLeft />
        </Button>
      )}

      <div className="flex-1">
        <h1 className="font-headline text-lg font-semibold md:text-xl">
          {title}
        </h1>
        {description && (
          <p className="hidden text-sm text-muted-foreground md:block">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
