'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Github, Mail } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import {useRouter} from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const router = useRouter()
  const { login} = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      console.log('Login successful')
      router.push('/home') 
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'Login failed')
  }
  }

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    window.location.href = `oauth2/authorization/${provider}`
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-backgroundSecondary shadow-md rounded-lg p-8 w-full max-w-md"
    >
      <div className="text-center space-y-2">
        <h1 className="text-textPrimary tracking-tighter font-bold">Welcome !</h1>
        <p className="text-sm text-borderColor font-regular">
          Please enter your credentials to access to your account
        </p>
      </div>

      <form className='space-y-4 p-5'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm text-textPrimary font-semibold'>Email</Label>
          <Input type='email' id='email' placeholder='Enter your email' value={email} required onChange={(e) => setEmail(e.target.value)} className={'border-0 focus-visible:border-0 rounded-full focus-visible:ring-0 bg-backgroundPrimary placeholder:text-textSecondary'} />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password' className='text-sm text-textPrimary font-semibold'>Password</Label>
          <div className='relative'>
            <Input type={showPassword ? 'text' : 'password'} id='password' placeholder='Enter your password' value={password} required onChange={(e) => setPassword(e.target.value)} className={'border-0 focus-visible:border-0 rounded-full focus-visible:ring-0 bg-backgroundPrimary placeholder:text-textSecondary'} />
            <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              {showPassword ? <EyeOff className='text-textSecondary' /> : <Eye className='text-textSecondary' />}
            </button>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='remember'
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
              className={`w-4 h-4 border rounded focus:ring-0 focus:ring-offset-0
    ${remember ? 'bg-buttons border-buttons' : 'bg-backgroundSecondary border-gray-300'}
    dark:${remember ? 'bg-buttons border-buttons' : 'bg-backgroundSecondary border-gray-600'}
  `}
            /><Label htmlFor='remember' className='text-sm text-textPrimary font-semibold'>Remember me</Label>
          </div>
          <a href='#' className='text-sm text-textSecondary font-medium hover:text-buttons'>Forgot password?</a>
        </div>
        <Button  onClick={handleLogin} type='submit' className='w-full bg-buttons text-white rounded-full hover:bg-buttonsHover'>Login</Button>

      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t bg-borderColor" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-backgroundSecondary px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-3">
        <Button
          variant="outline"
          className="w-full bg-backgroundPrimary text-textSecondary rounded-full hover:bg-buttons hover:text-white"
          onClick={() => handleOAuthLogin('github')}
        >
          <Github className="mr-2" />
          Github
        </Button>
        <Button
          variant="outline"
          className="w-full bg-backgroundPrimary text-textSecondary rounded-full hover:bg-buttons hover:text-white"
          onClick={()=>handleOAuthLogin('google')}
        >
          <Mail className="mr-2" />
          Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&#39;t have an account?{" "}
        <a href="/signup" className="text-textSecondary hover:text-buttons font-medium">
          Sign up
        </a>
      </div>
    </motion.div>
  )
}