import { useEffect, useMemo, useState } from 'react'
import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MailCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { register, wechatLoginByCode } from '@/features/auth/api'
import { AuthPasswordField } from '@/features/auth/components/auth-password-field'
import { LegalConsent } from '@/features/auth/components/legal-consent'
import { OAuthProviders } from '@/features/auth/components/oauth-providers'
import { registerFormSchema } from '@/features/auth/constants'
import { useAuthRedirect } from '@/features/auth/hooks/use-auth-redirect'
import { useEmailVerification } from '@/features/auth/hooks/use-email-verification'
import { useTurnstile } from '@/features/auth/hooks/use-turnstile'
import { getAffiliateCode } from '@/features/auth/lib/storage'

const fieldInputClassName =
  'h-12 rounded-2xl border-slate-900/10 bg-white/90 px-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] focus-visible:border-[#a66a18]/40 focus-visible:ring-[#a66a18]/15 dark:border-white/10 dark:bg-white/[0.05] dark:text-white'

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [agreedToLegal, setAgreedToLegal] = useState(false)
  const [wechatCode, setWeChatCode] = useState('')
  const [isWeChatDialogOpen, setIsWeChatDialogOpen] = useState(false)
  const [isWeChatSubmitting, setIsWeChatSubmitting] = useState(false)
  const legalConsentErrorMessage = t('Please agree to the legal terms first')

  const { status } = useStatus()
  const {
    isTurnstileEnabled,
    turnstileSiteKey,
    turnstileToken,
    setTurnstileToken,
    validateTurnstile,
  } = useTurnstile()
  const { redirectToLogin, handleLoginSuccess } = useAuthRedirect()
  const {
    isSending: isSendingCode,
    secondsLeft,
    isActive,
    sendCode,
  } = useEmailVerification({
    turnstileToken,
    validateTurnstile,
  })

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const emailValue = form.watch('email')
  const emailVerificationRequired = Boolean(status?.email_verification)
  const hasUserAgreement = Boolean(status?.user_agreement_enabled)
  const hasPrivacyPolicy = Boolean(status?.privacy_policy_enabled)
  const requiresLegalConsent = hasUserAgreement || hasPrivacyPolicy
  const oauthRegisterEnabled =
    status?.oauth_register_enabled ??
    status?.data?.oauth_register_enabled ??
    true
  const hasWeChatLogin = Boolean(status?.wechat_login)

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

  useEffect(() => {
    if (requiresLegalConsent) {
      setAgreedToLegal(false)
    } else {
      setAgreedToLegal(true)
    }
  }, [requiresLegalConsent])

  async function onSubmit(data: z.infer<typeof registerFormSchema>) {
    if (requiresLegalConsent && !agreedToLegal) {
      toast.error(legalConsentErrorMessage)
      return
    }

    if (emailVerificationRequired) {
      if (!data.email) {
        toast.error(t('Please enter your email'))
        return
      }
      if (!verificationCode) {
        toast.error(t('Please enter the verification code'))
        return
      }
    }

    setIsLoading(true)
    try {
      const res = await register({
        username: data.username,
        password: data.password,
        email: data.email || undefined,
        verification_code: verificationCode || undefined,
        aff: getAffiliateCode(),
        turnstile: turnstileToken,
      })

      if (res?.success) {
        toast.success(t('Account created! Please sign in'))
        redirectToLogin()
      }
    } catch (_error) {
      // Errors are handled by global interceptor
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendVerificationCode() {
    await sendCode(emailValue || '')
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
        await handleLoginSuccess(res.data as { id?: number } | null)
        toast.success(t('Signed in via WeChat'))
        handleWeChatDialogChange(false)
      } else {
        toast.error(res?.message || t('Login failed'))
      }
    } catch (_error) {
      toast.error(t('Login failed'))
    } finally {
      setIsWeChatSubmitting(false)
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
                  {t('Username')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Enter your username')}
                    className={fieldInputClassName}
                    {...field}
                  />
                </FormControl>
                <FormDescription className='text-xs leading-5 text-slate-500 dark:text-white/42'>
                  {t('This becomes your operator identity across the workspace.')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid gap-5 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='gap-2.5'>
                  <FormLabel className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'>
                    {t('Password')}
                  </FormLabel>
                  <FormControl>
                    <AuthPasswordField
                      placeholder={t('Enter password (8-20 characters)')}
                      inputClassName={fieldInputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='text-xs leading-5 text-slate-500 dark:text-white/42'>
                    {t('Use a strong password for team, billing, and key management access.')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='gap-2.5'>
                  <FormLabel className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'>
                    {t('Confirm password')}
                  </FormLabel>
                  <FormControl>
                    <AuthPasswordField
                      placeholder={t('Confirm password')}
                      inputClassName={fieldInputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='text-xs leading-5 text-slate-500 dark:text-white/42'>
                    {t('Match the password exactly before provisioning the account.')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {emailVerificationRequired && (
          <div className='space-y-4 rounded-[1.45rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(246,238,225,0.95),rgba(255,255,255,0.84))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                  {t('Email verification')}
                </p>
                <p className='mt-1 text-sm leading-6 text-slate-700 dark:text-white/68'>
                  {t('Verify ownership before the new workspace is activated.')}
                </p>
              </div>
              <MailCheck className='mt-0.5 h-5 w-5 text-slate-500 dark:text-white/45' />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='gap-2.5'>
                  <FormLabel className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'>
                    {t('Email (required for verification)')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('name@example.com')}
                      type='email'
                      className={fieldInputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end'>
              <div className='space-y-2.5'>
                <Label
                  htmlFor='verification-code'
                  className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'
                >
                  {t('Verification code')}
                </Label>
                <Input
                  id='verification-code'
                  placeholder={t('Verification code')}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={fieldInputClassName}
                />
              </div>
              <Button
                variant='outline'
                type='button'
                disabled={isLoading || isSendingCode || isActive || !emailValue}
                onClick={handleSendVerificationCode}
                className='h-12 rounded-2xl border-slate-900/10 bg-white/85 px-5 text-slate-950 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]'
              >
                {isActive ? (
                  t('Resend ({{seconds}}s)', { seconds: secondsLeft })
                ) : isSendingCode ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  t('Send code')
                )}
              </Button>
            </div>

            {isTurnstileEnabled && (
              <div className='rounded-[1.25rem] border border-dashed border-slate-900/12 bg-white/55 p-3 dark:border-white/10 dark:bg-white/[0.03]'>
                <p className='mb-3 text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                  {t('Bot protection')}
                </p>
                <Turnstile
                  siteKey={turnstileSiteKey}
                  onVerify={setTurnstileToken}
                />
              </div>
            )}
          </div>
        )}

        {!emailVerificationRequired && isTurnstileEnabled && (
          <div className='rounded-[1.25rem] border border-dashed border-slate-900/12 bg-white/55 p-3 dark:border-white/10 dark:bg-white/[0.03]'>
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

        <Button
          type='submit'
          className='mt-1 h-12 w-full justify-center gap-2 rounded-2xl bg-slate-950 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#a66a18] dark:bg-[#d6a353] dark:text-slate-950 dark:hover:bg-[#ecc78f]'
          disabled={isLoading || (requiresLegalConsent && !agreedToLegal)}
        >
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : null}
          {t('Create account')}
        </Button>

        {oauthRegisterEnabled && (
          <OAuthProviders
            status={status}
            disabled={isLoading || (requiresLegalConsent && !agreedToLegal)}
            onWeChatLogin={hasWeChatLogin ? handleOpenWeChatDialog : undefined}
            isWeChatLoading={isWeChatSubmitting}
            className='pt-1'
          />
        )}
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
