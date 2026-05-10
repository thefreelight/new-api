import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type AuthPasswordFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  ref?: React.Ref<HTMLInputElement>
  inputClassName?: string
  toggleClassName?: string
}

export function AuthPasswordField({
  className,
  ref,
  inputClassName,
  toggleClassName,
  disabled,
  ...props
}: AuthPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <Input
        type={showPassword ? 'text' : 'password'}
        ref={ref}
        disabled={disabled}
        className={cn('pr-12', inputClassName)}
        {...props}
      />
      <Button
        type='button'
        size='icon'
        variant='ghost'
        disabled={disabled}
        className={cn(
          'absolute end-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-xl text-slate-500 hover:bg-slate-900/5 hover:text-slate-900 dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white',
          toggleClassName
        )}
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label='Toggle password visibility'
      >
        {showPassword ? (
          <Eye className='h-4 w-4' aria-hidden='true' />
        ) : (
          <EyeOff className='h-4 w-4' aria-hidden='true' />
        )}
      </Button>
    </div>
  )
}
