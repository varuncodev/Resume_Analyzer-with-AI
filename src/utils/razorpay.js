// src/utils/razorpay.js

const AMOUNT_PAISE = 900; // ₹9 = 900 paise
const CURRENCY     = 'INR';

/**
 * Loads Razorpay script dynamically
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay payment modal.
 * Resolves to true on success, false on failure/dismiss.
 * @param {{ name: string, email: string }} user
 * @returns {Promise<boolean>}
 */
export async function openRazorpayPayment(user) {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Failed to load Razorpay. Check your internet connection.');

  const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
  if (!keyId) throw new Error('Razorpay key not found. Add REACT_APP_RAZORPAY_KEY_ID to .env');

  return new Promise((resolve) => {
    const options = {
      key:         keyId,
      amount:      AMOUNT_PAISE,
      currency:    CURRENCY,
      name:        'Resume Analyzer',
      description: 'Resume Analysis — ₹9',
      image:       '', // optional: your logo URL
      prefill: {
        name:  user.displayName || '',
        email: user.email       || '',
      },
      theme: { color: '#6c63ff' },
      handler: function () {
        // Payment successful
        resolve(true);
      },
      modal: {
        ondismiss: function () {
          resolve(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => resolve(false));
    rzp.open();
  });
}
