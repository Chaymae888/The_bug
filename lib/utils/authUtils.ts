
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const handleRequireLogin = (toastTitle: string, router: ReturnType<typeof useRouter>) => {
  router.push('/login');
  setTimeout(() => {
    toast("You must be logged in to " + toastTitle + " on The Bug", {
      description: "Login here or create a new account",
    });
  }, 100);
};