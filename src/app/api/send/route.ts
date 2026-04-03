import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { senderName, senderEmail, subject, body } = await request.json()

    if (!senderName || !senderEmail || !subject || !body) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['zach.walnock@gmail.com'],
      replyTo: senderEmail,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${senderName} <${senderEmail}>\n\n${body}`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
