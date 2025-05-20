'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Github, Mail } from 'lucide-react'
import useSignup from '@/hooks/use-signup'

export default function Signup() {
  const { register, handleSubmit, errors, showPassword, setShowPassword, handleOAuthLogin } = useSignup()

  
  
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-backgroundSecondary shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <div className="text-center space-y-2">
          <h1 className="text-textPrimary tracking-tighter font-bold">Join The bug</h1>
          <p className="text-sm text-borderColor font-regular">
            By clicking “Sign up”, you agree to our terms of service and acknowledge you have read our privacy policy.
          </p>
        </div>
  
        <form className='space-y-4 p-5' onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='username' className='text-sm text-textPrimary font-semibold'>Username</Label>
            <Input type='username' id='username' placeholder='Enter your usrname' className='border-0 focus-visible:border-0 rounded-full focus-visible:ring-0 bg-backgroundPrimary placeholder:text-textSecondary' {...register('username')} />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-sm text-textPrimary font-semibold'>Email</Label>
            <Input type='email' id='email' placeholder='Enter your email'  className='border-0 focus-visible:border-0 rounded-full focus-visible:ring-0 bg-backgroundPrimary placeholder:text-textSecondary' {...register('email')} />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password' className='text-sm text-textPrimary font-semibold'>Password</Label>
            <div className='relative'>
              <Input type={showPassword ? 'text' : 'password'} id='password' placeholder='Enter your password' className='border-0 focus-visible:border-0 rounded-full focus-visible:ring-0 bg-backgroundPrimary placeholder:text-textSecondary' {...register('password')}/>
              <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                {showPassword ? <EyeOff className='text-textSecondary' /> : <Eye className='text-textSecondary' />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          <Button type='submit' className='w-full bg-buttons text-white rounded-full hover:bg-buttonsHover'>Signup</Button>
  
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
          >
            <Github className="mr-2" />
            Github
          </Button>
          <Button
            variant="outline"
            className="w-full bg-backgroundPrimary text-textSecondary rounded-full hover:bg-buttons hover:text-white"
          >
            <Mail className="mr-2" />
            Google
          </Button>
        </div>
  
        <div className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-textSecondary hover:text-buttons font-medium">
            Log in
          </a>
        </div>
      </motion.div>
    )
}
