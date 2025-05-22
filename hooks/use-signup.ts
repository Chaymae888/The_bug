import { useAuthStore } from "@/lib/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SignupSchema, SignupFormData } from '@/lib/validation/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';


const useSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });
  const [showPassword, setShowPassword] = useState(false)
  const { signup } = useAuthStore()
  const router = useRouter()

  const handleSignup = async (formData: SignupFormData) => {
    console.log('Signup attempt started');

    try {
      await signup(formData);
      router.push('/emailconfirmation');
    } catch (error) {
      console.error('Registration error:', error instanceof Error ? error.message : 'Signup failed');
    }
  };

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    window.location.href = `oauth2/authorization/${provider}`
  }

  return { register, handleSubmit: handleSubmit(handleSignup), errors, showPassword, setShowPassword, setValue, watch, handleOAuthLogin }
}
export default useSignup