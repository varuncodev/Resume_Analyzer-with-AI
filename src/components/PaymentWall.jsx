// src/components/PaymentWall.jsx
import React, { useState } from 'react';
import { openRazorpayPayment } from '../utils/razorpay';
import { incrementPaidUsage } from '../utils/firebase';
import './PaymentWall.css';

export default function PaymentWall({ user, onPaymentSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const paid = await openRazorpayPayment(user);
      if (paid) {
        await incrementPaidUsage(user.uid);
        onPaymentSuccess();
      } else {
        setError('Payment cancelled. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-wall fade-in-up">
      <div className="pw-card">
        <div className="pw-badge">Free limit reached</div>
        <div className="pw-icon">🎯</div>
        <h2 className="pw-title">You've used your 2 free analyses</h2>
        <p className="pw-sub">
          Continue analyzing resumes for just <strong>₹9 per analysis</strong>.<br />
          One-time payment — no subscription, no hidden fees.
        </p>

        <div className="pw-features">
          <div className="pw-feature">✅ Full ATS score breakdown</div>
          <div className="pw-feature">✅ Keyword gap analysis</div>
          <div className="pw-feature">✅ Skill recommendations</div>
          <div className="pw-feature">✅ Actionable suggestions</div>
        </div>

        <div className="pw-price">
          <span className="pw-amount">₹9</span>
          <span className="pw-per">per analysis</span>
        </div>

        <button className="pw-pay-btn" onClick={handlePay} disabled={loading}>
          {loading ? <span className="btn-spinner-white" /> : '💳 Pay ₹9 & Analyze'}
        </button>

        <button className="pw-cancel-btn" onClick={onCancel} disabled={loading}>
          Maybe later
        </button>

        {error && <p className="pw-error">{error}</p>}

        <p className="pw-secure">🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted</p>
      </div>
    </div>
  );
}
