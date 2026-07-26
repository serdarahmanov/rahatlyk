import { createRequire } from 'node:module'
import { getPayload } from 'payload'

const require = createRequire(import.meta.url)
const { loadEnvConfig } = require('@next/env') as typeof import('@next/env')

const HEADING = {
  en: 'RAHATLYK',
  ru: 'RAHATLYK',
  tm: 'RAHATLYK',
} as const

const TEXT = {
  en: 'RAHATLYK water comes from Turkmenistan\'s pristine underground aquifers, naturally filtered over centuries. We preserve that purity with strict quality standards, so every sip feels clean, refreshing and naturally balanced.',
  ru: 'Вода RAHATLYK берётся из чистейших подземных водоносных горизонтов Туркменистана, где природа на протяжении столетий фильтровала и совершенствовала каждую каплю. Мы сохраняем эту исключительную чистоту с непоколебимой преданностью качеству, честности и изяществу — гарантируя, что каждый глоток приносит не просто освежение, а истинный момент природного благополучия.',
  tm: 'RAHATLYK suwy Türkmenistanyň arassa ýerasty suw gatlaklaryndan alynýar — bu ýerde tebigat asyrlar boýy her damjany süzüp kämilleşdirdi. Biz bu ajaýyp arassalygy hile, dogruçyllyga we gözellige bolan berk ygrarlylygyňyz bilen goraýarys — her ukybyňyzyň diňe täzelenmäni däl, tebigy abadançylygyň hakyky pursadyny berýändigini üpjün edýäris.',
} as const

async function seedHomeBrandStatement() {
  loadEnvConfig(process.cwd())
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding Home Brand Statement...')

  for (const locale of ['en', 'ru', 'tm'] as const) {
    await payload.updateGlobal({
      slug: 'home-brand-statement',
      locale,
      data: { heading: HEADING[locale], text: TEXT[locale] },
    })
    console.log(`  [global] home-brand-statement updated for locale: ${locale}`)
  }

  console.log('Done.')
  process.exit(0)
}

seedHomeBrandStatement().catch((err) => {
  console.error(err)
  process.exit(1)
})
