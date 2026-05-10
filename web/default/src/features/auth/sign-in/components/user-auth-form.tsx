import { useEffect, useMemo, useState } from 'react'
import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Loader2, LogIn, KeyRound, ScanFace } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  buildAssertionResult,
  prepareCredentialRequestOptions,
  isPasskeySupported as detectPasskeySupport,
} from '@/lib/passkey'
import { cn } from '@/lib/utils'
import { useStatus } from '@/hooks/use-status'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Turnstile } from '@/components/turnstile'
import { login, wechatLoginByCode } from '@/features/auth/api'
import { AuthPasswordField } from '@/features/auth/components/auth-password-field'
import { LegalConsent } from '@/features/auth/components/legal-consent'
import { OAuthProviders } from '@/features/auth/components/oauth-providers'
import { loginFormSchema } from '@/features/auth/constants'
import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect'
import { useTurnstile } from '@/features/auth/hooks/use-turnstile'
import { beginPasskeyLogin, finishPasskeyLogin } from '@/features/auth/passkey'
import type { AuthFormProps } from '@/features/auth/types'

const fieldInputClassName =
  'h-12 rounded-2xl border-slate-900/10 bg-white/90 px-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] focus-visible:border-[#a66a18]/40 focus-visible:ring-[#a66a18]/15 dark:border-white/10 dark:bg-white/[0.05] dark:text-white'

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: AuthFormProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [wechatCode, setWeChatCode] = useState('')
  const [agreedToLegal, setAgreedToLegal] = useState(false)
  const [passkeySupported, setPasskeySupported] = useState(false)
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false)
  const [isWeChatDialogOpen, setIsWeChatDialogOpen] = useState(false)
  const [isWeChatSubmitting, setIsWeChatSubmitting] = useState(false)
  const legalConsentErrorMessage = t('Please agree to the legal terms first')
  const loginFailedMessage = t('Login failed')

  const { status } = useStatus()
  const passkeyLoginEnabled = Boolean(
    status?.passkey_login ?? status?.data?.passkey_login
  )
  const {
    isTurnstileEnabled,
    turnstileSiteKey,
    turnstileToken,
    setTurnstileToken,
    validateTurnstile,
  } = useTurnstile()
  const { handleLoginSuccess, redirectTo2FA } = useAuthRedirect()

  const hasUserAgreement = Boolean(status?.user_agreement_enabled)
  const hasPrivacyPolicy = Boolean(status?.privacy_policy_enabled)
  const requiresLegalConsent = hasUserAgreement || hasPrivacyPolicy
  const passkeyButtonDisabled =
    isPasskeyLoading ||
    !passkeySupported ||
    (requiresLegalConsent && !agreedToLegal)
  const hasWeChatLogin = Boolean(status?.wechat_login)

  useEffect(() => {
    if (requiresLegalConsent) {
      setAgreedToLegal(false)
    } else {
      setAgreedToLegal(true)
    }
  }, [requiresLegalConsent])

  useEffect(() => {
    detectPasskeySupport()
      .then(setPasskeySupported)
      .catch(() => setPasskeySupported(false))
  }, [])

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const wechatQrCodeUrl = useMemo(() => {
    return (
      status?.wechat_qrcode ||
      status?.wechat_qr_code ||
      status?.wechat_qrcode_image_url ||
      status?.wechat_qr_code_image_url ||
      status?.wechat_account_qrcode_image_url ||
      status?.WeChatAccountQRCodeImageURL ||
      status?.data?.wechat_qrcode ||
      status?.data?.WeChatAccountQRCodeImageURL ||
      ''
    )
  }, [status])

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    if (requiresLegalConsent && !agreedToLegal) {
      toast.error(legalConsentErrorMessage)
      return
    }

    if (!validateTurnstile()) return

    setIsLoading(true)
    try {
      const res = await login({
        username: data.username,
        password: data.password,
        turnstile: turnstileToken,
      })

      if (res.success) {
        if (res.data?.require_2fa) {
          redirectTo2FA()
          return
        }

        await handleLoginSuccess(res.data as { id?: number } | null, redirectTo)
        toast.success(t('Welcome back!'))
      }
    } catch (_error) {
      // Errors are handled by global interceptor
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenWeChatDialog = () => {
    if (requiresLegalConsent && !agreedToLegal) {
      toast.error(legalConsentErrorMessage)
      return
    }

    setIsWeChatDialogOpen(true)
  }

  const handleWeChatDialogChange = (open: boolean) => {
    setIsWeChatDialogOpen(open)
    if (!open) {
      setWeChatCode('')
      setIsWeChatSubmitting(false)
    }
  }

  async function handleWeChatLogin() {
    if (!wechatCode.trim()) {
      toast.error(t('Please enter the verification code'))
      return
    }

    setIsWeChatSubmitting(true)
    try {
      const res = await wechatLoginByCode(wechatCode)
      if (res?.success) {
        await handleLoginSuccess(res.data as { id?: number } | null, redirectTo)
        toast.success(t('Signed in via WeChat'))
        handleWeChatDialogChange(false)
      } else {
        toast.error(res?.message || loginFailedMessage)
      }
    } catch (_error) {
      toast.error(loginFailedMessage)
    } finally {
      setIsWeChatSubmitting(false)
    }
  }

  async function handlePasskeyLogin() {
    if (requiresLegalConsent && !agreedToLegal) {
      toast.error(legalConsentErrorMessage)
      return
    }

    if (!passkeySupported) {
      toast.error(t('Passkey is not supported on this device'))
      return
    }

    if (!navigator?.credentials) {
      toast.error(t('Passkey is not available in this browser'))
      return
    }

    setIsPasskeyLoading(true)
    try {
      const begin = await beginPasskeyLogin()
      if (!begin.success) {
        throw new Error(begin.message || t('Failed to start Passkey login'))
      }

      const publicKey = prepareCredentialRequestOptions(
        begin.data?.options ?? begin.data
      )

      const credential = (await navigator.credentials.get({
        publicKey,
      })) as PublicKeyCredential | null

      if (!credential) {
        toast.info(t('Passkey login was cancelled'))
        return
      }

      const assertion = buildAssertionResult(credential)
      if (!assertion) {
        throw new Error(t('Invalid Passkey response'))
      }

      const finish = await finishPasskeyLogin(assertion)
      if (!finish.success) {
        throw new Error(finish.message || t('Failed to complete Passkey login'))
      }

      if (!finish.data) {
        throw new Error(t('Missing user data from Passkey login response'))
      }

      await handleLoginSuccess(
        finish.data as { id?: number } | null,
        redirectTo
      )
      toast.success(t('Signed in with Passkey'))
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast.info(t('Passkey login was cancelled or timed out'))
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('Passkey login failed'))
      }
    } finally {
      setIsPasskeyLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-5', className)}
        {...props}
      >
        <div className='grid gap-5'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem className='gap-2.5'>
                <FormLabel className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'>
                  {t('Username or Email')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Enter your username or email')}
                    className={fieldInputClassName}
                    {...field}
                  />
                </FormControl>
                <FormDescription className='text-xs leading-5 text-slate-500 dark:text-white/42'>
                  {t('Use the same identity you use to manage keys, models, or billing.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='gap-2.5'>
                <div className='flex items-center justify-between gap-3'>
                  <FormLabel className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'>
                    {t('Password')}
                  </FormLabel>
                  <Link
                    to='/forgot-password'
                    className='text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase transition-colors hover:text-[#9a6822] dark:text-white/45 dark:hover:text-[#f2c98c]'
                  >
                    {t('Forgot password?')}
                  </Link>
                </div>
                <FormControl>
                  <AuthPasswordField
                    placeholder={t('Enter password')}
                    inputClassName={fieldInputClassName}
                    {...field}
                  />
                </FormControl>
                <FormDescription className='text-xs leading-5 text-slate-500 dark:text-white/42'>
                  {t('Your existing password and redirect logic are preserved.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          className='mt-1 h-12 w-full justify-center gap-2 rounded-2xl bg-slate-950 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#a66a18] dark:bg-[#d6a353] dark:text-slate-950 dark:hover:bg-[#ecc78f]'
          disabled={isLoading || (requiresLegalConsent && !agreedToLegal)}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <LogIn className='h-4 w-4' />
          )}
          {t('Sign in')}
        </Button>

        {isTurnstileEnabled && (
          <div className='rounded-[1.35rem] border border-dashed border-slate-900/12 bg-white/55 p-3 dark:border-white/10 dark:bg-white/[0.03]'>
            <p className='mb-3 text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
              {t('Bot protection')}
            </p>
            <Turnstile siteKey={turnstileSiteKey} onVerify={setTurnstileToken} />
          </div>
        )}

        <LegalConsent
          status={status}
          checked={agreedToLegal}
          onCheckedChange={setAgreedToLegal}
          className='mt-1'
        />

        {passkeyLoginEnabled && (
          <div className='space-y-2 rounded-[1.45rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(246,238,225,0.95),rgba(255,255,255,0.82))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                  {t('Passkey')}
                </p>
                <p className='mt-1 text-sm leading-6 text-slate-700 dark:text-white/68'>
                  {t('Use a device-bound credential for faster, phishing-resistant access.')}
                </p>
              </div>
              <ScanFace className='h-5 w-5 text-slate-500 dark:text-white/45' />
            </div>
            <Button
              type='button'
              variant='outline'
              disabled={passkeyButtonDisabled}
              onClick={handlePasskeyLogin}
              className='h-12 w-full justify-center gap-2 rounded-2xl border-slate-900/10 bg-white/85 text-slate-950 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]'
            >
              {isPasskeyLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <KeyRound className='h-4 w-4' />
              )}
              {t('Sign in with Passkey')}
            </Button>
            {!passkeySupported && (
              <p className='text-xs leading-5 text-slate-500 dark:text-white/42'>
                {t('Passkey is not supported on this device.')}
              </p>
            )}
          </div>
        )}

        <OAuthProviders
          status={status}
          disabled={isLoading || (requiresLegalConsent && !agreedToLegal)}
          onWeChatLogin={hasWeChatLogin ? handleOpenWeChatDialog : undefined}
          isWeChatLoading={isWeChatSubmitting}
        />
      </form>

      {hasWeChatLogin && (
        <Dialog
          open={isWeChatDialogOpen}
          onOpenChange={handleWeChatDialogChange}
        >
          <DialogContent className='max-w-sm rounded-[1.8rem] border border-slate-900/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(247,240,229,0.92))] p-6 shadow-[0_36px_90px_-54px_rgba(15,23,42,0.75)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(23,26,33,0.98),rgba(14,16,22,0.96))]'>
            <DialogHeader className='text-left'>
              <DialogTitle>{t('WeChat sign in')}</DialogTitle>
              <DialogDescription>
                {t(
                  'Scan the QR code to follow the official account and reply with “验证码” to receive your verification code.'
                )}
              </DialogDescription>
            </DialogHeader>

            {wechatQrCodeUrl ? (
              <div className='flex justify-center rounded-[1.4rem] border border-slate-900/10 bg-white/82 p-4 dark:border-white/10 dark:bg-white/[0.04]'>
                <img
                  src={wechatQrCodeUrl}
                  alt={t('WeChat login QR code')}
                  className='h-40 w-40 rounded-2xl border border-slate-900/10 object-contain dark:border-white/10'
                />
              </div>
            ) : (
              <p className='text-sm leading-6 text-slate-600 dark:text-white/62'>
                {t('QR code is not configured. Please contact support.')}
              </p>
            )}

            <div className='grid gap-2.5'>
              <Label
                htmlFor='wechat-code'
                className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'
              >
                {t('Verification code')}
              </Label>
              <Input
                id='wechat-code'
                placeholder={t('Enter the verification code')}
                value={wechatCode}
                onChange={(event) => setWeChatCode(event.target.value)}
                autoComplete='one-time-code'
                className={fieldInputClassName}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleWeChatDialogChange(false)}
                disabled={isWeChatSubmitting}
                className='rounded-2xl border-slate-900/10 bg-white/82 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]'
              >
                {t('Cancel')}
              </Button>
              <Button
                type='button'
                onClick={handleWeChatLogin}
                disabled={
                  isWeChatSubmitting ||
                  !wechatCode.trim() ||
                  (requiresLegalConsent && !agreedToLegal)
                }
                className='gap-2 rounded-2xl bg-slate-950 text-white hover:bg-[#a66a18] dark:bg-[#d6a353] dark:text-slate-950 dark:hover:bg-[#ecc78f]'
              >
                {isWeChatSubmitting ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : null}
                {t('Confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Form>
  )
}
