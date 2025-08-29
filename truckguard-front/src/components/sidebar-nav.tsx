"use client";

import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { Activity, Book, Bot, Calendar, MapPin, Phone, Search, Truck, User, Users, Wallet } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar"
import SidebarItem from './sidebar-item';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';

type ActiveSessionLocalStorage = {
    time: number,
    id: string,
    isActive: boolean
}

export default function SidebarClient() {
    const pathname = usePathname();

    const { isMobile, setOpenMobile } = useSidebar()

    const handleNavClick = useCallback(() => {
        if (isMobile) {
            setOpenMobile(false)
        }
    }, [isMobile, setOpenMobile])

    const menuItems = [
        {
            label: 'Dashboard',
            icon: <Activity />,
            route: '/dashboard'
        },
        {
            label: 'Gestionar Viajes',
            icon: <MapPin />,
            // route: /${serverData.username}
            route: '/trips'
        },
        {
            label: 'Gestionar Camiones',
            icon: <Truck />,
            route: '/trucks'
        },
        {
            label: 'Gestión de Conductores',
            icon: <Users />,
            route: '/drivers'
        }
    ]

    return (
        <Sidebar className=''>
            {/* <div className=''> */}
            <SidebarHeader className='flex items-center py-4 dark:bg-[#272727] bg-[#fafafa]'>
                <Link
                    className="flex items-center space-x-2"
                    href="/"
                >
                    <div className="p-2 bg-sky-400 rounded-lg flex items-center justify-center">
                        <Book className="h-4 w-4 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-sky-400">
                        Pagession
                    </h1>
                </Link>
            </SidebarHeader>
            <SidebarContent className='dark:bg-[#272727] bg-[#fafafa]'>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                menuItems.map((menuItem, menuIndex) => (
                                    <SidebarItem
                                        key={menuIndex}
                                        itemName={menuItem.label}
                                        itemIcon={menuItem.icon}
                                        itemActive={pathname === menuItem.route}
                                        itemHref={menuItem.route}
                                        handleClick={handleNavClick}
                                    />
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


            </SidebarContent>
        </Sidebar>
    )
}