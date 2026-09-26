import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        padding: "100px 0 50px",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8f0e3 0%, #fff 50%, #f8f0e3 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Page Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <h1
            style={{
              fontSize: "2.8rem",
              color: "#333",
              marginBottom: "15px",
              position: "relative",
              display: "inline-block",
            }}
          >
            Contact Us
            <span
              style={{
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "3px",
                background: "#d4af37",
              }}
            ></span>
          </h1>
          <p
            style={{
              color: "#666",
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "20px auto 0",
              lineHeight: "1.6",
            }}
          >
            Get in touch with us for any queries or support
          </p>
        </div>

        {/* Contact Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "50px",
            marginBottom: "60px",
          }}
        >
          {/* Contact Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}
          >
            {[
              {
                icon: "fa-map-marker-alt",
                title: "Our Office",
                details: [
                  "123 Wedding Street, Gomti Nagar",
                  "Lucknow, Uttar Pradesh 226010",
                ],
              },
              {
                icon: "fa-phone",
                title: "Phone Number",
                details: ["+91 98765 43210", "+91 98765 43211"],
              },
              {
                icon: "fa-envelope",
                title: "Email Address",
                details: [
                  "info@blissfulweddings.com",
                  "support@blissfulweddings.com",
                ],
              },
              {
                icon: "fa-clock",
                title: "Working Hours",
                details: [
                  "Monday - Saturday: 9:00 AM - 8:00 PM",
                  "Sunday: 10:00 AM - 6:00 PM",
                ],
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <i
                  className={`fas ${item.icon}`}
                  style={{
                    fontSize: "2.5rem",
                    color: "#d4af37",
                    marginBottom: "15px",
                  }}
                ></i>
                <h3
                  style={{
                    marginBottom: "10px",
                    color: "#333",
                    fontSize: "1.2rem",
                  }}
                >
                  {item.title}
                </h3>
                {item.details.map((detail, idx) => (
                  <p
                    key={idx}
                    style={{
                      color: "#666",
                      marginBottom: "5px",
                      lineHeight: "1.5",
                      fontSize: "0.95rem",
                    }}
                  >
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "30px",
                color: "#333",
                fontSize: "1.8rem",
              }}
            >
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Name and Email Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.95rem",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "#fff",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.95rem",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "#fff",
                    }}
                  />
                </div>
              </div>

              {/* Phone and Subject Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.95rem",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "#fff",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.95rem",
                    }}
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter subject"
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "#fff",
                    }}
                  />
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your wedding requirements..."
                  rows="6"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#fff",
                    resize: "vertical",
                    minHeight: "120px",
                    fontFamily: "inherit",
                  }}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "inline-block",
                  padding: "14px 30px",
                  background: loading ? "#b8941f" : "#d4af37",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  fontSize: "16px",
                  width: "100%",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "50px 40px",
            borderRadius: "20px",
            marginTop: "40px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "40px",
              color: "#333",
              fontSize: "2.2rem",
            }}
          >
            Frequently Asked Questions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            {[
              {
                question: "How far in advance should I book wedding services?",
                answer:
                  "We recommend booking at least 2-4 months in advance for the best availability, especially for popular dates and venues.",
              },
              {
                question: "Do you provide customized wedding packages?",
                answer:
                  "Yes, we offer completely customizable packages. You can use our Package Builder tool or contact us for personalized planning.",
              },
              {
                question: "What areas do you serve?",
                answer:
                  "We primarily serve Lucknow and surrounding areas, but we also arrange destination weddings across India.",
              },
              {
                question: "Can I meet with a wedding planner in person?",
                answer:
                  "Absolutely! We offer both in-person and virtual consultations based on your preference and convenience.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    color: "#333",
                    fontSize: "1.1rem",
                    lineHeight: "1.4",
                  }}
                >
                  {faq.question}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .contact-content {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }

          .form-row {
            grid-template-columns: 1fr !important;
          }

          .faq-grid {
            grid-template-columns: 1fr !important;
          }
        }

        input:focus,
        textarea:focus {
          border-color: #d4af37 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1) !important;
        }

        .info-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Contact;
