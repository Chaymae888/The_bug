'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from "@/lib/stores/useAuthStore"

export const useEmailConfirmation = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {exchangeToken}=useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');
        console.log('[Confirmation] Initializing with token:', token);

        if (!token) {
            console.error('[Confirmation] Error: No token found in URL parameters');
            toast.error('No confirmation token provided');
            router.push('/signup');
            return;
        }

        const verifyAndExchangeToken = async () => {
            try {
                console.log('[Confirmation] Exchanging token for JWT');
                await exchangeToken(token);

                console.log('[Confirmation] JWT token stored successfully');

                toast.success('Email confirmed successfully!');
                router.push('/home');

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Confirmation failed';
                console.error('[Confirmation] Verification Error:', {
                    error: err,
                    message: errorMessage,
                    timestamp: new Date().toISOString()
                });
                toast.error(errorMessage);
                router.push(`/signup?error=${encodeURIComponent(errorMessage)}`);
            }
        };

        verifyAndExchangeToken();
    }, [searchParams, router, exchangeToken]);
};