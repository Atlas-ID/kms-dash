'use client';

import { useState, useCallback } from 'react';
import { Frame, Navigation, TopBar } from '@shopify/polaris';
import {
    ListBulletedIcon,
    ChartVerticalFilledIcon,
    SettingsIcon,
    AppsIcon,
    ExitIcon
} from '@shopify/polaris-icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function PolarisLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

    const toggleMobileNavigationActive = useCallback(
        () => setIsMobileNavigationOpen((v) => !v),
        [],
    );

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const toggleUserMenu = useCallback(
        () => setUserMenuOpen((open) => !open),
        [],
    );

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={[
                {
                    items: [{ content: 'Log out', icon: ExitIcon, onAction: logout }],
                },
            ]}
            name="Admin User"
            detail="Administrator"
            initials="A"
            open={userMenuOpen}
            onToggle={toggleUserMenu}
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );

    const navigationMarkup = (
        <Navigation location={pathname}>
            <Navigation.Section
                items={[
                    {
                        label: 'API Keys',
                        icon: ListBulletedIcon,
                        onClick: () => router.push('/keys'),
                        selected: pathname === '/keys' || pathname.startsWith('/keys/'),
                    },
                    {
                        label: 'Integrations',
                        icon: AppsIcon,
                        onClick: () => router.push('/integrations'),
                        selected: pathname === '/integrations',
                    },
                    {
                        label: 'Analytics',
                        icon: ChartVerticalFilledIcon,
                        onClick: () => router.push('/statistics'),
                        selected: pathname === '/statistics',
                    },
                    {
                        label: 'Settings',
                        icon: SettingsIcon,
                        onClick: () => router.push('/settings'),
                        selected: pathname === '/settings',
                    },
                ]}
            />
        </Navigation>
    );

    const logo = {
        width: 100,
        topBarSource: '/logo.png',
        contextualSaveBarSource: '/logo.png',
        url: '/keys',
        accessibilityLabel: 'KeyMaster',
    };

    return (
        <Frame
            logo={logo}
            topBar={topBarMarkup}
            navigation={navigationMarkup}
            showMobileNavigation={isMobileNavigationOpen}
            onNavigationDismiss={toggleMobileNavigationActive}
        >
            {children}
        </Frame>
    );
}
