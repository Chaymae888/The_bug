'use client'



import {useState} from 'react'
import {motion} from 'framer-motion'
import { Button } from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import { Checkbox} from '@/components/ui/checkbox'
import {Eye,EyeOff , Github,Mail, Moon, Sun} from 'lucide-react'
import StickBug from '@/components/StickBug'
import styles from '@/components/StickBug.module.css'
import Image from 'next/image';
import logo_light from '@/public/images/bug-logo-light.png';
import logo_dark from '@/public/images/bug-logo-dark.png';
import { useTheme } from '@/context/ThemeContext'


const Login = () => {
  const { theme, toggleTheme } = useTheme()
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[showPassword,setShowPassword] = useState(false)
  const[remember,setRemember] = useState(false)
  return (
    <div className="relative min-h-screen w-full">
       <div className="absolute top-4 left-4 z-20">
      <Image 
        src={theme === 'dark' ? logo_dark : logo_light}
        alt="Logo"
        width={100} 
        height={50} 
        className="h-auto"
      />
    </div>
    <button 
        onClick={toggleTheme}
        className="absolute top-8 right-8 z-20 p-2 rounded-full bg-backgroundSecondary text-buttons dark:text-buttons"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div> <div className={styles['stickbug-container']}>
        <StickBug />
      </div>
      <div className='absolute p-6'></div>
       <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-backgroundSecondary shadow-md rounded-lg p-8 w-full max-w-md'>
          <div className='text-center space-y-2'>
            <h1 className='text-textPrimary tracking-tighter font-bold'>Welcome !</h1>
            <p className='text-sm text-borderColor font-regular'>Please enter your credentials to access to your account</p>
          </div>
          <form className='space-y-4 p-5'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-sm text-textPrimary font-semibold'>Email</Label>
              <Input type='email' id='email' placeholder='Enter your email' value={email} required onChange={(e) => setEmail(e.target.value)} className={'border-0 focus-visible:border-0 rounded-full focus-visible:ring-0 bg-backgroundPrimary placeholder:text-textSecondary' } />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-sm text-textPrimary font-semibold'>Password</Label>
              <div className='relative'>
              <Input type={showPassword ? 'text' : 'password'} id='password' placeholder='Enter your password' value={password} required onChange={(e) => setPassword(e.target.value)} className={'border-0 focus-visible:border-0 rounded-full focus-visible:ring-0 bg-backgroundPrimary placeholder:text-textSecondary' } />
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
                <Button type='submit' className='w-full bg-buttons text-white rounded-full hover:bg-buttonsHover'>Login</Button>

          </form>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t bg-borderColor'/>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-backgroundSecondary px-2 text-muted-foreground'>Or continue with</span>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 p-3'>
            <Button variant='outline' className='w-full bg-backgroundPrimary text-textSecondary rounded-full hover:bg-buttons hover:text-white'>
              <Github className='mr-2' />
              Github
            </Button>
            <Button variant='outline' className='w-full bg-backgroundPrimary text-textSecondary rounded-full hover:bg-buttons hover:text-white'>
              <Mail className='mr-2' />
              Google
            </Button>
          </div>
          <div className='text-center text-sm'>Don't have an account ? {""} <a href="#" className='text-textSecondary hover:text-buttons font-medium'> Sign up</a></div>
        </motion.div>
    </div>
    </div>
   
  )
}

export default Login