import crypto from 'crypto';

export interface CaptchaPayload {
  equation: string;
  svg: string;
  captchaToken: string;
}

const CAPTCHA_SECRET = process.env.JWT_SECRET || 'iris_crm_captcha_hmac_secret_key_2026';
const CAPTCHA_TTL_MS = 5 * 60 * 1000; // 5 minutes validity

export class CaptchaService {
  /**
   * Generates a new random math equation, SVG challenge badge, and a tamper-proof HMAC token.
   */
  generateCaptcha(): CaptchaPayload {
    const isAddition = Math.random() > 0.4;
    let n1 = Math.floor(Math.random() * 12) + 1; // 1 to 12
    let n2 = Math.floor(Math.random() * 9) + 1;  // 1 to 9
    let operator = '+';
    let expectedAnswer = n1 + n2;

    if (!isAddition) {
      operator = '-';
      // Ensure positive result
      if (n1 < n2) {
        const temp = n1;
        n1 = n2;
        n2 = temp;
      }
      expectedAnswer = n1 - n2;
    }

    const equationText = `${n1} ${operator} ${n2}`;
    const expiresAt = Date.now() + CAPTCHA_TTL_MS;

    // Create tamper-proof HMAC signature: answer + timestamp + secret
    const signatureData = `${expectedAnswer}:${expiresAt}`;
    const hmac = crypto.createHmac('sha256', CAPTCHA_SECRET).update(signatureData).digest('hex');
    const captchaToken = Buffer.from(JSON.stringify({ expectedAnswer, expiresAt, hmac })).toString('base64');

    // Generate lightweight, stylized SVG representation to resist basic OCR scrapers
    const svg = this.renderCaptchaSvg(equationText);

    return {
      equation: equationText,
      svg,
      captchaToken,
    };
  }

  /**
   * Verifies the user answer against the HMAC signed token.
   */
  verifyCaptcha(captchaToken: string | undefined, userAnswer: string | number | undefined): { isValid: boolean; message?: string } {
    if (!captchaToken || userAnswer === undefined || userAnswer === null || String(userAnswer).trim() === '') {
      return {
        isValid: false,
        message: 'Math CAPTCHA answer is required. Please solve the arithmetic challenge.',
      };
    }

    try {
      const decodedJson = Buffer.from(captchaToken, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedJson);
      const { expectedAnswer, expiresAt, hmac } = payload;

      if (!expectedAnswer !== undefined && !expiresAt && !hmac) {
        return { isValid: false, message: 'Malformed CAPTCHA challenge token.' };
      }

      // Check expiration
      if (Date.now() > expiresAt) {
        return {
          isValid: false,
          message: 'The CAPTCHA puzzle has expired. Please refresh and solve the new equation.',
        };
      }

      // Verify HMAC integrity
      const verificationData = `${expectedAnswer}:${expiresAt}`;
      const expectedHmac = crypto.createHmac('sha256', CAPTCHA_SECRET).update(verificationData).digest('hex');

      if (hmac !== expectedHmac) {
        return { isValid: false, message: 'Invalid or forged CAPTCHA token signature.' };
      }

      // Compare arithmetic answer
      const parsedUserAnswer = parseInt(String(userAnswer).trim(), 10);
      if (isNaN(parsedUserAnswer) || parsedUserAnswer !== expectedAnswer) {
        return {
          isValid: false,
          message: 'Incorrect math CAPTCHA answer. Please check your math and try again.',
        };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, message: 'Invalid CAPTCHA token format.' };
    }
  }

  /**
   * Renders a lightweight Glassmorphic SVG badge with visual noise lines and rainbow-themed text.
   */
  private renderCaptchaSvg(equation: string): string {
    const width = 140;
    const height = 44;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="rounded-xl overflow-hidden">
      <defs>
        <linearGradient id="captchaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.25"/>
          <stop offset="50%" stop-color="#6366f1" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.25"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#captchaGrad)" rx="8" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <path d="M 10 20 Q 35 5 70 24 T 130 18" fill="none" stroke="rgba(168,85,247,0.4)" stroke-width="1.5" stroke-dasharray="3,3"/>
      <path d="M 5 30 Q 50 40 90 15 T 135 28" fill="none" stroke="rgba(59,130,246,0.3)" stroke-width="1"/>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="18" fill="#ffffff" letter-spacing="3" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
        ${equation} = ?
      </text>
    </svg>`;
  }
}
