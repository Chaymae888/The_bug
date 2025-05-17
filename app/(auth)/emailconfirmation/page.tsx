'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/useAuthStore'

export default function WaitingConfirmationEmail() {
    const router = useRouter()
    const {confirmEmail, isAuthenticated ,accessToken } = useAuthStore();

    useEffect(() => {
     if (accessToken) {
      confirmEmail(accessToken).catch(error => {
        console.error('Confirmation failed:', error);
      });
     }
    }, [confirmEmail, accessToken]);

    useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] w-2/3 bg-backgroundSecondary rounded-[10px]">
      <div className="text-buttons text-7xl font-semibold mb-4 text-center">Please confirm your email to login</div>
    </div>
  )
}
