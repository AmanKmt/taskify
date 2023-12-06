"use client"

import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const MobileSidebar = () => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    
    const onOpen = useMobileSidebar((state) => state.onOpen);
    const isOpen = useMobileSidebar((state) => state.isOpen);
    const onClose = useMobileSidebar((state) => state.onClose);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Button onClick={onOpen} className="md:hidden block mr-2" variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
            </Button>

            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className="p-2 pt-10">
                    <Sidebar storageKey="t-sidebar-mobile-state" />
                </SheetContent>
            </Sheet>
        </>
    );
};