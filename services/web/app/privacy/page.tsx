import Link from 'next/link'
import { Box, Stack, Text } from '@/app/components/common/UI'

export const metadata = {
  title: 'Privacy Policy — illog',
  description: 'illog privacy policy and data handling practices.'
}

type InfoCardProps = {
  title: string
  tone: 'green' | 'rose'
  items: string[]
}

function InfoCard({ title, tone, items }: InfoCardProps) {
  const palette =
    tone === 'green'
      ? { background: '#f8faf8', border: '#e6ede6' }
      : { background: '#faf8f8', border: '#ede6e6' }

  return (
    <Stack
      gap="300"
      rounded="200"
      py="600"
      px="600"
      style={{
        background: palette.background,
        border: `1px solid ${palette.border}`
      }}
    >
      <Text as="h3" textStyle="bodyStrong" color="textDefaultDefault">
        {title}
      </Text>
      <Stack as="ul" gap="200">
        {items.map((item) => (
          <Box as="li" key={item} style={{ paddingLeft: '20px', position: 'relative' }}>
            <Box
              as="span"
              position="absolute"
              left={0}
              top={'50%'}
              transform={'translateY(-50%)'}
              width={6}
              height={6}
              rounded="full"
              bg="backgroundBrandSecondary"
            />
            <Text as="span" textStyle="bodySmall" color="textDefaultSecondary" lineHeight="1.5">
              {item}
            </Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack as="section" gap="300" mb="1200">
      <Text
        as="h2"
        textStyle="heading"
        color="textDefaultDefault"
        style={{ fontSize: '20px', letterSpacing: '-0.3px' }}
      >
        {title}
      </Text>
      {children}
    </Stack>
  )
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <Text as="p" textStyle="bodySmall" color="textDefaultSecondary" lineHeight="2">
      {children}
    </Text>
  )
}

export default function PrivacyPage() {
  return (
    <Stack minHeight="100vh">
      <Box as="nav" px="1200" py="400" borderBottom="border" borderColor="borderDefaultSecondary">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Text
            as="span"
            textStyle="bodyStrong"
            color="textDefaultDefault"
            style={{ fontSize: '18px' }}
          >
            illog
          </Text>
        </Link>
      </Box>

      <Box
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '720px',
          margin: '0 auto',
          padding: '64px 24px 96px'
        }}
      >
        <Stack as="article" gap="1200">
          <Stack
            as="header"
            gap="300"
            pb="800"
            borderBottom="border"
            borderColor="borderDefaultSecondary"
          >
            <Text
              as="h1"
              textStyle="title"
              color="textDefaultDefault"
              style={{
                fontSize: 'clamp(28px, 4vw, 36px)',
                lineHeight: 1.2,
                letterSpacing: '-0.5px'
              }}
            >
              Privacy Policy
            </Text>
            <Text as="p" textStyle="caption" color="textDefaultTertiary">
              Last updated: February 11, 2026
            </Text>
          </Stack>

          <PolicySection title="Overview">
            <Paragraph>
              illog is a local-first productivity app that records your daily tasks, time, and
              reflections. We are committed to protecting your privacy. All your data {' — '}tasks,
              notes, and records {' — '}is stored locally on your device and is never transmitted to
              our servers.
            </Paragraph>
            <Paragraph>
              This policy explains the limited, anonymous data we collect to improve the app
              experience.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Anonymous Error Reporting">
            <Paragraph>
              Error information that occurs during app usage is collected anonymously to help
              improve app stability. This feature is opt-in and can be disabled at any time in the
              app settings.
            </Paragraph>

            <InfoCard
              title="Collected Information"
              tone="green"
              items={[
                'App version, Electron version',
                'Operating system type and version',
                'System architecture (x64, arm64, etc.)',
                'Error stack traces',
                'Error occurrence timestamps'
              ]}
            />

            <InfoCard
              title="Information NOT Collected"
              tone="rose"
              items={[
                'Personally identifiable information (email, name, etc.)',
                'Local database contents',
                'Local file paths'
              ]}
            />
          </PolicySection>

          <PolicySection title="Your Control">
            <Paragraph>
              Anonymous error reporting can be toggled on or off at any time in the app&apos;s
              Settings. When disabled, data collection stops immediately. No previously collected
              data is linked to your identity.
            </Paragraph>
          </PolicySection>

          <PolicySection title="How We Use the Data">
            <Paragraph>
              Error reports are used solely for the purpose of improving app stability and fixing
              bugs. Each report is identified only by a randomly generated anonymous ID {' — '}it is
              never associated with any personal information.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Data Storage">
            <Paragraph>
              All your personal data (tasks, notes, time records, and reflections) is stored
              exclusively on your local device. illog does not operate any cloud storage or sync
              service. Your data stays with you.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Third-Party Services">
            <Paragraph>
              illog does not integrate with any third-party analytics, advertising, or tracking
              services. The only external communication is the optional anonymous error reporting
              described above.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Changes to This Policy">
            <Paragraph>
              We may update this Privacy Policy from time to time. Any changes will be reflected on
              this page with an updated revision date. We encourage you to review this page
              periodically.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Contact">
            <Paragraph>
              If you have any questions about this Privacy Policy, please reach out to us at{' '}
              <Box
                as="a"
                href="mailto:zero.so.jung@gmail.com"
                style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                <Text as="span" textStyle="bodySmall" color="textDefaultDefault">
                  zero.so.jung@gmail.com
                </Text>
              </Box>
              .
            </Paragraph>
          </PolicySection>
        </Stack>
      </Box>

      <Box as="footer" py="800" px="600" borderTop="border" borderColor="borderDefaultSecondary">
        <Text as="p" textStyle="caption" color="textDefaultTertiary" align="center">
          &copy; {new Date().getFullYear()} illog. All rights reserved.
        </Text>
      </Box>
    </Stack>
  )
}
