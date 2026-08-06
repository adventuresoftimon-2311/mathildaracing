/**
 * Vercel Serverless Function: Secure Form Submission Handler
 * Path: /api/submit.js
 * 
 * Implements server-side validations, sanitization, honeypot protection, 
 * rate-limiting placeholder, and secure email routing for Mathilda Racing.
 * 
 * PRIVACY BY DESIGN:
 * - No user data is written to a persistent public database.
 * - Honeypot triggers fail silently (return 200 to bots) to prevent notifying spammers.
 * - Transport is TLS encrypted.
 * - Sensitive credentials (SMTP, keys) are strictly managed via environment variables.
 */

// Production Note: For stateless serverless environments, in-memory rate limiting 
// is per-instance. For robust cluster-wide rate limiting, integrate with a key-value store like Upstash Redis.
const rateLimitCache = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return email && email.length < 254 && emailRegex.test(email);
}

export default async function handler(req, res) {
  // Enforce secure HTTPS
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'HTTPS required' });
  }

  // Allow only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate Limiting Check (Simple IP-based tracking)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous';
  const now = Date.now();
  const limitData = rateLimitCache.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > limitData.resetTime) {
    limitData.count = 1;
    limitData.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    limitData.count++;
  }
  rateLimitCache.set(clientIp, limitData);

  if (limitData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte warten Sie eine Minute.' });
  }

  try {
    const { 
      formType,
      website, // Honeypot field name from driverForm/sponsorForm
      
      // Driver details
      driverFirstname,
      driverLastname,
      driverDob,
      driverEmail,
      driverPhone,
      driverSeries,
      driverExperience,
      driverResults,
      driverVideo,
      driverSocial,
      parentName,
      parentEmail,
      parentPhone,
      parentConsent,
      driverProgram,
      driverGoals,
      
      // Sponsor details
      sponsorCompany,
      sponsorIndustry,
      sponsorWebsite,
      sponsorGoal,
      sponsorBudget,
      sponsorName,
      sponsorPosition,
      sponsorEmail,
      sponsorPhone,
      sponsorMessage,

      // Contact details
      contactName,
      contactEmail,
      contactMessage
    } = req.body;

    // 1. Honeypot check (SPAM protection)
    // If the hidden 'website' field contains any value, we assume a bot is filling it.
    // Return a mock 200 success code to discard the spam silently without alerting the bot.
    if (website && website.trim() !== '') {
      console.warn(`Honeypot triggered from IP: ${clientIp}`);
      return res.status(200).json({ success: true, message: 'Form submitted successfully (honeypot)' });
    }

    // 2. Validate form data according to type
    if (formType === 'driver') {
      // Mandatory checks
      const firstName = sanitizeInput(driverFirstname);
      const lastName = sanitizeInput(driverLastname);
      const email = sanitizeInput(driverEmail);
      const phone = sanitizeInput(driverPhone);
      const goals = sanitizeInput(driverGoals);
      
      if (!firstName || !lastName || !email || !phone || !goals) {
        return res.status(400).json({ error: 'Bitte füllen Sie alle erforderlichen Pflichtfelder aus.' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
      }

      // Check age-dependent parent consent
      if (driverDob) {
        const birthDate = new Date(driverDob);
        const age = now - birthDate.getTime();
        const ageInYears = age / (1000 * 60 * 60 * 24 * 365.25);
        if (ageInYears < 18) {
          if (!parentName || !parentEmail || !parentPhone || !parentConsent) {
            return res.status(400).json({ error: 'Für minderjährige Bewerber sind die Angaben und das Einverständnis der Erziehungsberechtigten erforderlich.' });
          }
          if (!isValidEmail(parentEmail)) {
            return res.status(400).json({ error: 'Ungültige E-Mail-Adresse der Erziehungsberechtigten.' });
          }
        }
      }

      // Input length validation checks (Max characters)
      if (firstName.length > 50 || lastName.length > 50 || email.length > 100 || goals.length > 2000) {
        return res.status(400).json({ error: 'Eingabelänge überschreitet das Limit.' });
      }

      // 3. Process Driver Request (SMTP Mailer Placeholder)
      console.log(`Processing driver application for ${firstName} ${lastName}`);
      
      // NodeMailer implementation stub (requires package npm i nodemailer if activated)
      /*
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // Placeholder
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
      await transporter.sendMail({
        from: `Mathilda Website <${process.env.SMTP_FROM}>`,
        to: process.env.NOTIFICATION_RECEIVER || 'info@mathilda-racing.de',
        subject: `Neue Bewerbung Fahrerprogramm: ${firstName} ${lastName}`,
        text: `Fahrer-Bewerbung eingegangen:\n\nName: ${firstName} ${lastName}\nGeburtsdatum: ${driverDob}\nE-Mail: ${email}\nTelefon: ${phone}\nProgramm: ${driverProgram}\nZiele: ${goals}\n\nSocial/Video: ${driverVideo} / ${driverSocial}\nEltern: ${parentName} (${parentEmail}, ${parentPhone})`
      });
      */

    } else if (formType === 'sponsor') {
      // Mandatory checks
      const company = sanitizeInput(sponsorCompany);
      const industry = sanitizeInput(sponsorIndustry);
      const name = sanitizeInput(sponsorName);
      const email = sanitizeInput(sponsorEmail);
      const phone = sanitizeInput(sponsorPhone);
      const message = sanitizeInput(sponsorMessage);

      if (!company || !industry || !name || !email || !phone || !message) {
        return res.status(400).json({ error: 'Bitte füllen Sie alle erforderlichen Pflichtfelder aus.' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
      }

      if (company.length > 100 || name.length > 100 || email.length > 100 || message.length > 2000) {
        return res.status(400).json({ error: 'Eingabelänge überschreitet das Limit.' });
      }

      // 3. Process Sponsor Request (SMTP Mailer Placeholder)
      console.log(`Processing sponsor inquiry for ${name} at ${company}`);
      
      /*
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
      await transporter.sendMail({
        from: `Mathilda Website <${process.env.SMTP_FROM}>`,
        to: process.env.NOTIFICATION_RECEIVER || 'info@mathilda-racing.de',
        subject: `Neue Partnerschafts-Anfrage: ${company}`,
        text: `Partnerschafts-Anfrage eingegangen:\n\nFirma: ${company}\nBranche: ${industry}\nAnsprechpartner: ${name}\nPosition: ${sponsorPosition}\nE-Mail: ${email}\nTelefon: ${phone}\nMarketingziel: ${sponsorGoal}\nKooperationsrahmen: ${sponsorBudget}\nNachricht: ${message}`
      });
      */

    } else if (formType === 'contact') {
      // Mandatory checks
      const name = sanitizeInput(contactName);
      const email = sanitizeInput(contactEmail);
      const message = sanitizeInput(contactMessage);

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Bitte füllen Sie alle erforderlichen Pflichtfelder aus.' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
      }

      if (name.length > 100 || email.length > 100 || message.length > 3000) {
        return res.status(400).json({ error: 'Eingabelänge überschreitet das Limit.' });
      }

      // 3. Process General Contact Request (SMTP Mailer Placeholder)
      console.log(`Processing general contact message from ${name} (${email})`);
      
      /*
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
      await transporter.sendMail({
        from: `Mathilda Website <${process.env.SMTP_FROM}>`,
        to: process.env.NOTIFICATION_RECEIVER || 'info@mathilda-racing.de',
        subject: `Allgemeine Kontaktanfrage: ${name}`,
        text: `Allgemeine Kontaktanfrage eingegangen:\n\nName: ${name}\nE-Mail: ${email}\nNachricht:\n${message}`
      });
      */

    } else {
      return res.status(400).json({ error: 'Ungültiger Formulartyp.' });
    }

    // Success response (no details about internal processing/transports exposed)
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Form submission processing error:', error);
    // Generic error message to prevent leaking server details/stacktraces
    return res.status(500).json({ error: 'Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie uns direkt per E-Mail.' });
  }
}
