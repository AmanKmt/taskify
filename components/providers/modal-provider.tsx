'use client'

import { useEffect, useState } from "react";

import { ProModal } from "@/components/modals/pro-modal";
import { CardModal } from "@/components/modals/card-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    
    return (
        <>
            <CardModal />
            <ProModal />
        </>
    );
};