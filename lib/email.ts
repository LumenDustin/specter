// Email utilities using Resend
// Note: You'll need to install resend: npm install resend

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.log('RESEND_API_KEY not configured, skipping email')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'SPECTER <noreply@specter.dev>',
        to: [to],
        subject,
        html,
        text: text || subject,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Email templates
export const EmailTemplates = {
  purchaseConfirmation: (caseTitle: string, caseSlug: string) => ({
    subject: `🔍 Case File Unlocked: ${caseTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: 'Courier New', monospace; background-color: #0a0a0a; color: #e4e4e7; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background-color: #7f1d1d; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 4px; color: #fca5a5;">SPECTER</h1>
              <p style="margin: 5px 0 0; font-size: 10px; color: #fecaca; letter-spacing: 2px;">PARANORMAL INVESTIGATION DIVISION</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <div style="background-color: #0a0a0a; border: 1px solid #27272a; border-radius: 4px; padding: 20px; margin-bottom: 20px;">
                <p style="font-size: 10px; color: #71717a; margin: 0 0 5px;">CASE FILE UNLOCKED</p>
                <h2 style="margin: 0; font-size: 20px; color: #fafafa;">${caseTitle}</h2>
              </div>

              <p style="color: #a1a1aa; line-height: 1.6;">
                Your purchase has been confirmed. You now have permanent access to this classified case file.
              </p>

              <p style="color: #a1a1aa; line-height: 1.6;">
                The truth awaits, investigator. Review the evidence carefully and submit your theory when ready.
              </p>

              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://specter.dev'}/cases/${caseSlug}"
                 style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Begin Investigation →
              </a>
            </div>

            <!-- Footer -->
            <div style="padding: 20px; border-top: 1px solid #27272a; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #52525b;">
                SPECTER Paranormal Investigation Division
              </p>
              <p style="margin: 5px 0 0; font-size: 10px; color: #3f3f46;">
                This is an automated message. Do not reply.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `SPECTER - Case File Unlocked: ${caseTitle}\n\nYour purchase has been confirmed. You now have permanent access to this classified case file.\n\nStart your investigation at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://specter.dev'}/cases/${caseSlug}`,
  }),

  caseSolved: (caseTitle: string, solutionType: 'true' | 'surface', attempts: number) => ({
    subject: solutionType === 'true'
      ? `🏆 TRUE SOLUTION DISCOVERED: ${caseTitle}`
      : `✓ Case Solved: ${caseTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: 'Courier New', monospace; background-color: #0a0a0a; color: #e4e4e7; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background-color: ${solutionType === 'true' ? '#14532d' : '#78350f'}; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 4px; color: ${solutionType === 'true' ? '#86efac' : '#fcd34d'};">
                ${solutionType === 'true' ? 'TRUE SOLUTION DISCOVERED' : 'CASE SOLVED'}
              </h1>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <div style="background-color: #0a0a0a; border: 1px solid #27272a; border-radius: 4px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px; color: #fafafa;">${caseTitle}</h2>
                <p style="margin: 10px 0 0; font-size: 14px; color: #71717a;">
                  Solved in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}
                </p>
              </div>

              ${solutionType === 'true' ? `
                <p style="color: #86efac; line-height: 1.6; text-align: center;">
                  Congratulations, investigator. You have uncovered the true nature of this case.
                </p>
              ` : `
                <p style="color: #fcd34d; line-height: 1.6; text-align: center;">
                  Case closed. But the surface explanation may not tell the whole story...
                </p>
              `}

              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://specter.dev'}/cases"
                   style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Investigate More Cases
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 20px; border-top: 1px solid #27272a; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #52525b;">
                SPECTER Paranormal Investigation Division
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `${solutionType === 'true' ? 'TRUE SOLUTION DISCOVERED' : 'Case Solved'}: ${caseTitle}\n\nSolved in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}.\n\nInvestigate more cases at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://specter.dev'}/cases`,
  }),

  welcomeEmail: (displayName?: string) => ({
    subject: '🔍 Welcome to SPECTER - Your Clearance Has Been Granted',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: 'Courier New', monospace; background-color: #0a0a0a; color: #e4e4e7; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background-color: #7f1d1d; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 4px; color: #fca5a5;">SPECTER</h1>
              <p style="margin: 5px 0 0; font-size: 10px; color: #fecaca; letter-spacing: 2px;">PARANORMAL INVESTIGATION DIVISION</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <h2 style="color: #fafafa; margin-bottom: 20px;">
                Welcome${displayName ? `, ${displayName}` : ''}.
              </h2>

              <p style="color: #a1a1aa; line-height: 1.6;">
                Your security clearance has been approved. You now have access to SPECTER's classified case files.
              </p>

              <p style="color: #a1a1aa; line-height: 1.6;">
                As an investigator, you will examine evidence, uncover hidden connections, and determine the truth behind unexplained phenomena.
              </p>

              <div style="background-color: #0a0a0a; border: 1px solid #27272a; border-radius: 4px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 12px; color: #71717a;">YOUR FIRST MISSION</p>
                <p style="margin: 10px 0 0; color: #fafafa;">
                  Start with our free case file: <strong>STATIC</strong>
                </p>
                <p style="margin: 5px 0 0; font-size: 12px; color: #71717a;">
                  A family's television begins displaying impossible images...
                </p>
              </div>

              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://specter.dev'}/cases"
                 style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                View Case Files →
              </a>
            </div>

            <!-- Footer -->
            <div style="padding: 20px; border-top: 1px solid #27272a; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #52525b;">
                SPECTER Paranormal Investigation Division
              </p>
              <p style="margin: 5px 0 0; font-size: 10px; color: #3f3f46;">
                The truth is classified. Until you uncover it.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to SPECTER${displayName ? `, ${displayName}` : ''}!\n\nYour security clearance has been approved. You now have access to SPECTER's classified case files.\n\nStart your first investigation at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://specter.dev'}/cases`,
  }),
}
