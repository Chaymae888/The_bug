'use client'
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useEmailConfirmation } from '@/hooks/use-emailConfirmation';

export default function ConfirmationEmailSuccessful() {
    useEmailConfirmation();

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="mt-4 text-lg">Verifying your email...</p>
        </div>
    );
}