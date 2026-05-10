import {
  Children,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Main } from './main'
import { PageFooterProvider } from './page-footer'

type SlotProps = { children?: ReactNode }

function SectionPageLayoutTitle(_props: SlotProps) {
  return null
}
SectionPageLayoutTitle.displayName = 'SectionPageLayout.Title'

function SectionPageLayoutDescription(_props: SlotProps) {
  return null
}
SectionPageLayoutDescription.displayName = 'SectionPageLayout.Description'

function SectionPageLayoutActions(_props: SlotProps) {
  return null
}
SectionPageLayoutActions.displayName = 'SectionPageLayout.Actions'

function SectionPageLayoutContent(_props: SlotProps) {
  return null
}
SectionPageLayoutContent.displayName = 'SectionPageLayout.Content'

function SectionPageLayoutBreadcrumb(_props: SlotProps) {
  return null
}
SectionPageLayoutBreadcrumb.displayName = 'SectionPageLayout.Breadcrumb'

export type SectionPageLayoutProps = {
  children: ReactNode
}

export function SectionPageLayout(props: SectionPageLayoutProps) {
  const { t } = useTranslation()
  const [footerContainer, setFooterContainer] = useState<HTMLDivElement | null>(
    null
  )

  let title: ReactNode = null
  let description: ReactNode = null
  let actions: ReactNode = null
  let content: ReactNode = null
  let breadcrumb: ReactNode = null

  Children.forEach(props.children, (node) => {
    if (!isValidElement(node)) return
    const child = node as ReactElement<SlotProps>
    if (child.type === SectionPageLayoutTitle) title = child.props.children
    else if (child.type === SectionPageLayoutDescription)
      description = child.props.children
    else if (child.type === SectionPageLayoutActions)
      actions = child.props.children
    else if (child.type === SectionPageLayoutContent)
      content = child.props.children
    else if (child.type === SectionPageLayoutBreadcrumb)
      breadcrumb = child.props.children
  })

  return (
    <PageFooterProvider container={footerContainer}>
      <Main>
        <div className='shrink-0 px-3 pt-3 pb-3 sm:px-4 sm:pt-5 sm:pb-4'>
          <div className='overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/78 shadow-[0_18px_45px_-28px_color-mix(in_oklch,var(--foreground)_20%,transparent),inset_0_1px_0_color-mix(in_oklch,var(--background)_82%,transparent)] backdrop-blur-xl'>
            <div className='pointer-events-none h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--primary)_40%,transparent),transparent)]' />
            <div className='flex flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5'>
              {breadcrumb != null && (
                <div className='text-muted-foreground/80 text-xs'>{breadcrumb}</div>
              )}
              <div className='flex flex-wrap items-start justify-between gap-x-3 gap-y-3 sm:gap-x-4'>
                <div className='min-w-0 max-w-3xl'>
                  <div className='text-muted-foreground mb-1 text-[11px] font-semibold tracking-[0.22em] uppercase'>
                    {t('Console Section')}
                  </div>
                  <h2 className='truncate text-lg font-semibold tracking-tight sm:text-2xl'>
                    {title}
                  </h2>
                  {description != null && (
                    <p className='text-muted-foreground mt-1.5 max-w-2xl text-sm leading-relaxed'>
                      {description}
                    </p>
                  )}
                </div>
                {actions != null && (
                  <div className='flex shrink-0 flex-wrap items-center gap-2 sm:gap-x-3'>
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='min-h-0 flex-1 overflow-auto px-3 pt-1 pb-3 sm:px-4 sm:pt-1.5 sm:pb-4'>
          {content}
        </div>

        <div
          ref={setFooterContainer}
          className='bg-background/82 shrink-0 border-t border-border/70 px-3 py-2.5 empty:hidden backdrop-blur sm:px-4 sm:py-3'
        />
      </Main>
    </PageFooterProvider>
  )
}

SectionPageLayout.Title = SectionPageLayoutTitle
SectionPageLayout.Description = SectionPageLayoutDescription
SectionPageLayout.Actions = SectionPageLayoutActions
SectionPageLayout.Content = SectionPageLayoutContent
SectionPageLayout.Breadcrumb = SectionPageLayoutBreadcrumb
