import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { CustomerFormData, CaptchaChallenge } from '../types/customer';
import { ApiService } from '../services/api';
import { applyCpfMask, isValidCpf, cleanCpf } from '../utils/cpfMask';
import { ValidationState } from '../components/Input';
import { useLanguage } from '../context/LanguageContext';

const INITIAL_FORM_STATE: CustomerFormData = {
  fullName: '',
  cpf: '',
  email: '',
  favoriteRainbowColor: '',
  notes: '',
  website_url: '',
  captchaToken: '',
  captchaAnswer: '',
};

export const useCustomerForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CustomerFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const [availableColors, setAvailableColors] = useState<string[]>([
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Indigo',
    'Violet',
  ]);
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>(''); // Invisible Honeypot
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState<boolean>(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  // Fetch dynamic Math CAPTCHA puzzle
  const loadCaptcha = useCallback(async () => {
    setIsLoadingCaptcha(true);
    try {
      const challenge = await ApiService.getCaptcha();
      setCaptchaChallenge(challenge);
      setCaptchaAnswer('');
    } catch (err) {
      console.warn('Could not load CAPTCHA puzzle:', err);
    } finally {
      setIsLoadingCaptcha(false);
    }
  }, []);

  // Fetch dynamic colors and initial CAPTCHA on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingConfig(true);

    Promise.all([ApiService.getRainbowColors(), ApiService.getCaptcha()])
      .then(([colors, challenge]) => {
        if (isMounted) {
          if (colors.length > 0) setAvailableColors(colors);
          setCaptchaChallenge(challenge);
        }
      })
      .catch((err) => console.warn('Initialization error:', err))
      .finally(() => {
        if (isMounted) setIsLoadingConfig(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute real-time CPF validation state for visual feedback
  const getCpfValidationState = (): ValidationState => {
    const rawDigits = cleanCpf(formData.cpf);
    if (!formData.cpf || rawDigits.length === 0) return 'neutral';
    if (rawDigits.length === 11) {
      return isValidCpf(formData.cpf) ? 'valid' : 'invalid';
    }
    if (errors.cpf) return 'invalid';
    return 'neutral';
  };

  const validateField = (name: keyof CustomerFormData, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return t.errors.nameRequired;
        if (value.trim().length < 3) return t.errors.nameMinLength;
        return '';
      case 'cpf':
        if (!value.trim()) return t.errors.cpfRequired;
        if (!isValidCpf(value)) return t.errors.cpfInvalid;
        return '';
      case 'email':
        if (!value.trim()) return t.errors.emailRequired;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return t.errors.emailInvalid;
        }
        return '';
      case 'favoriteRainbowColor':
        if (!value.trim()) return t.errors.colorRequired;
        return '';
      case 'captchaAnswer':
        if (!captchaAnswer.trim()) return t.errors.captchaRequired;
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'cpf') {
      finalValue = applyCpfMask(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name as keyof CustomerFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldError = validateField(name as keyof CustomerFormData, value);
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};
    const fieldsToValidate: Array<keyof CustomerFormData> = [
      'fullName',
      'cpf',
      'email',
      'favoriteRainbowColor',
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field] || '');
      if (error) newErrors[field] = error;
    });

    // Validate CAPTCHA
    if (!captchaAnswer.trim()) {
      newErrors.captchaAnswer = t.errors.captchaRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (!validateAll()) {
      setStatus({
        type: 'error',
        message: t.errors.formIncomplete,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CustomerFormData = {
        ...formData,
        website_url: websiteUrl, // Layer 1: Honeypot
        captchaToken: captchaChallenge?.captchaToken || '', // Layer 2: Math CAPTCHA
        captchaAnswer: captchaAnswer.trim(),
      };

      const response = await ApiService.registerCustomer(payload);
      setStatus({
        type: 'success',
        message: response.message || 'Perfect! Your registration was saved successfully.',
      });
      setFormData(INITIAL_FORM_STATE);
      setCaptchaAnswer('');
      setWebsiteUrl('');
      setErrors({});
      loadCaptcha(); // Regenerate new captcha for next registration
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'An unexpected error occurred. Please try again.',
      });
      // Refresh captcha on failure to prevent replay
      loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const dismissStatus = () => {
    setStatus({ type: null, message: '' });
  };

  return {
    formData,
    errors,
    availableColors,
    captchaChallenge,
    captchaAnswer,
    websiteUrl,
    isLoadingCaptcha,
    isLoadingConfig,
    isSubmitting,
    status,
    cpfValidationState: getCpfValidationState(),
    setCaptchaAnswer,
    setWebsiteUrl,
    refreshCaptcha: loadCaptcha,
    handleInputChange,
    handleBlur,
    handleSubmit,
    dismissStatus,
  };
};
