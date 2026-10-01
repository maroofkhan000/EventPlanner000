import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "qrcode";
import { toast } from "react-toastify";
import "./UpiPayment.css";

// App-specific links matter on iPhone, where plain upi:// has no app chooser
const upiApps = [
  { name: "Google Pay", scheme: "tez://upi/pay?", icon: "fab fa-google" },
  { name: "PhonePe", scheme: "phonepe://pay?", icon: "fas fa-mobile-alt" },
  { name: "Paytm", scheme: "paytmmp://pay?", icon: "fas fa-wallet" },
];

const isMobile = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

const UpiPayment = ({ bookingId, onSubmitted }) => {
  const [payment, setPayment] = useState(null);
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const mobile = isMobile();

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`/bookings/${bookingId}/upi`)
      .then(async ({ data }) => {
        if (cancelled) return;
        setPayment(data);
        const url = await QRCode.toDataURL(data.link, { width: 220, margin: 1 });
        if (!cancelled) setQr(url);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load payment details");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(payment.upiId);
      toast.success("UPI ID copied");
    } catch {
      toast.info(payment.upiId);
    }
  };

  const submitReference = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/bookings/${bookingId}/payment-reference`, {
        reference,
      });
      toast.success(data.message);
      onSubmitted?.(data.booking);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="upi-pay upi-error">
        <i className="fas fa-exclamation-circle"></i> {error}
      </div>
    );
  }

  if (!payment) {
    return <div className="upi-pay upi-loading">Loading payment details...</div>;
  }

  return (
    <div className="upi-pay">
      <div className="upi-amount">
        <span>Amount to pay</span>
        <strong>₹{payment.amount.toLocaleString("en-IN")}</strong>
        <small>
          To {payment.payeeName} · Ref {payment.reference}
        </small>
      </div>

      <div className="upi-step">
        <p className="upi-step-title">
          <span>1</span> Pay with any UPI app
        </p>

        {mobile && (
          <div className="upi-apps">
            <a className="upi-app upi-app-main" href={payment.link}>
              <i className="fas fa-bolt"></i> Pay with UPI app
            </a>
            {upiApps.map((app) => (
              <a key={app.name} className="upi-app" href={app.scheme + payment.query}>
                <i className={app.icon}></i> {app.name}
              </a>
            ))}
          </div>
        )}

        <div className="upi-qr">
          {qr && <img src={qr} alt="UPI payment QR code" />}
          <p>
            {mobile
              ? "Or scan this QR from another phone."
              : "Scan with GPay, PhonePe, Paytm or any UPI app."}
          </p>
          <button type="button" className="upi-copy" onClick={copyUpiId}>
            {payment.upiId} <i className="far fa-copy"></i>
          </button>
        </div>
      </div>

      <form className="upi-step" onSubmit={submitReference}>
        <p className="upi-step-title">
          <span>2</span> Enter the UPI reference number
        </p>
        <p className="upi-hint">
          After paying, find the 12-digit <strong>UPI Ref / UTR No.</strong> in your
          payment app's transaction details. Your booking is confirmed once we verify
          it.
        </p>
        <div className="upi-ref-row">
          <input
            inputMode="numeric"
            maxLength={14}
            placeholder="e.g. 412345678901"
            value={reference}
            onChange={(e) => setReference(e.target.value.replace(/[^\d ]/g, ""))}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "I've paid"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpiPayment;
