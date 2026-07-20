import type { EmailLocale } from './i18n'
import type { EmailTemplateConfig } from './templates'
import { getPayloadClient } from '@/lib/payload'

export async function getEmailTemplateConfig(locale: EmailLocale): Promise<EmailTemplateConfig | null> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({
      slug: 'email-templates' as never,
      locale,
      depth: 0,
    }) as EmailTemplateConfig
  } catch (error) {
    console.error(`[email templates] Failed to load Payload email templates for ${locale}:`, error)
    return null
  }
}
