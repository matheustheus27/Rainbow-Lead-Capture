import { Request, Response } from 'express';
import { CustomerService } from '../services/CustomerService';
import { CaptchaService } from '../services/CaptchaService';
import { RAINBOW_COLORS } from '../models/Customer';
import logger from '../utils/logger';

export class CustomerController {
  private customerService: CustomerService;
  private captchaService: CaptchaService;

  constructor(customerService?: CustomerService, captchaService?: CaptchaService) {
    this.customerService = customerService || new CustomerService();
    this.captchaService = captchaService || new CaptchaService();
  }

  /**
   * GET /api/captcha
   * Generates a new random math equation puzzle, SVG badge, and signed token.
   */
  getCaptcha = (_req: Request, res: Response): void => {
    try {
      const captcha = this.captchaService.generateCaptcha();
      logger.debug('CaptchaController', 'Math CAPTCHA puzzle issued', { equation: captcha.equation });
      res.status(200).json({
        success: true,
        ...captcha,
      });
    } catch (error: any) {
      logger.error('CaptchaController', 'Could not generate CAPTCHA challenge', {}, error);
      res.status(500).json({
        success: false,
        message: 'Could not generate CAPTCHA puzzle.',
      });
    }
  };

  /**
   * POST /api/customers
   * Registers a customer with double-layer bot prevention checks.
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        fullName,
        cpf,
        email,
        favoriteRainbowColor,
        notes,
        website_url,
        captchaToken,
        captchaAnswer,
      } = req.body;

      // ----------------------------------------------------
      // BOT PREVENTION LAYER 1: Invisible Honeypot Trap
      // If the hidden 'website_url' field was filled, reject instantly.
      // ----------------------------------------------------
      if (website_url && typeof website_url === 'string' && website_url.trim().length > 0) {
        logger.warn('BotSecurity', 'Honeypot trap triggered: Automated bot registration rejected', {
          ip: req.ip || req.socket.remoteAddress,
          honeypotField: 'website_url',
          honeypotValue: website_url,
        });
        res.status(400).json({
          success: false,
          message: 'Bot activity detected: Registration rejected.',
        });
        return;
      }

      // ----------------------------------------------------
      // BOT PREVENTION LAYER 2: Local Cryptographic Math CAPTCHA
      // Validate arithmetic answer against HMAC token before processing DB logic.
      // ----------------------------------------------------
      const captchaVerification = this.captchaService.verifyCaptcha(captchaToken, captchaAnswer);
      if (!captchaVerification.isValid) {
        logger.warn('BotSecurity', 'Math CAPTCHA verification failed', {
          ip: req.ip || req.socket.remoteAddress,
          reason: captchaVerification.message,
          submittedAnswer: captchaAnswer,
        });
        res.status(400).json({
          success: false,
          message: captchaVerification.message || 'Invalid math CAPTCHA answer. Please solve the puzzle and try again.',
        });
        return;
      }

      // ----------------------------------------------------
      // BUSINESS LOGIC: Registration & Single CPF Constraint
      // ----------------------------------------------------
      const customer = await this.customerService.registerCustomer({
        fullName,
        cpf,
        email,
        favoriteRainbowColor,
        notes,
      });

      logger.info('CustomerRegistration', 'Customer lead registered successfully', {
        customerId: customer.id,
        email: customer.email,
        favoriteRainbowColor: customer.favoriteRainbowColor,
      });

      res.status(201).json({
        success: true,
        message: 'Registration completed successfully!',
        data: {
          id: customer.id,
          fullName: customer.fullName,
          email: customer.email,
          cpf: customer.cpf,
          favoriteRainbowColor: customer.favoriteRainbowColor,
        },
      });
    } catch (error: any) {
      const isAlreadyRegistered = error.message?.includes('already completed registration');
      const statusCode = isAlreadyRegistered ? 409 : 400;

      if (isAlreadyRegistered) {
        logger.warn('CustomerRegistration', 'Duplicate CPF registration rejected', {
          ip: req.ip || req.socket.remoteAddress,
          error: error.message,
        });
      } else {
        logger.warn('CustomerRegistration', 'Customer registration validation failed', {
          ip: req.ip || req.socket.remoteAddress,
          error: error.message,
        });
      }

      res.status(statusCode).json({
        success: false,
        message: error.message || 'An unexpected error occurred during registration.',
      });
    }
  };

  /**
   * GET /api/customers
   * Lists registered customers (Protected endpoint).
   */
  list = async (_req: Request, res: Response): Promise<void> => {
    try {
      const customers = await this.customerService.listCustomers();
      logger.info('CustomerController', 'Customer records retrieved', { count: customers.length });
      res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error: any) {
      logger.error('CustomerController', 'Error retrieving customer records', {}, error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error retrieving customer records.',
      });
    }
  };

  /**
   * GET /api/admin/analytics
   * Returns aggregated color distribution and registration stats (Protected endpoint).
   */
  getAnalytics = async (_req: Request, res: Response): Promise<void> => {
    try {
      const analytics = await this.customerService.getAnalytics();
      logger.info('CustomerController', 'Admin analytics generated', { totalLeads: analytics.totalLeads, topColor: analytics.topColor });
      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      logger.error('CustomerController', 'Error generating analytics data', {}, error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error retrieving analytics data.',
      });
    }
  };

  /**
   * GET /api/colors
   * Returns list of available rainbow colors for dynamic frontend configuration.
   */
  getRainbowColors = (_req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      colors: RAINBOW_COLORS,
    });
  };
}
