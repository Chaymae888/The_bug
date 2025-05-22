import { useAuthStore } from "@/lib/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LoginFormData , LoginSchema} from '@/lib/validation/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';


const useLogin = () => {
    const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(false)
    const { login } = useAuthStore()
    const router = useRouter()

    const handleLogin = async (formData: LoginFormData) => {
        try {
            await login(formData)
            router.push('/home')
        }
        catch (error) {
            console.error('Login failed:', error)
        }
    }

    const handleOAuthLogin = (provider: 'github' | 'google') => {
        window.location.href = `oauth2/authorization/${provider}`
    }

    return { register,handleSubmit : handleSubmit(handleLogin), errors , showPassword, setShowPassword,remember, setRemember, setValue, watch, handleOAuthLogin }
}
export default useLogin 