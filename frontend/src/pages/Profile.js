import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update profile logic would go here
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      {/* Simple Header Section */}
      <div className="page-header-section">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your account information</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Main Profile Card */}
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="avatar-section">
              <div className="profile-avatar">
                <i className="fas fa-user"></i>
              </div>
            </div>

            <div className="profile-info">
              <h2 className="user-name">{user?.name}</h2>
              <p className="user-email">{user?.email}</p>
              <p className="user-phone">{user?.phone}</p>
            </div>

            <button
              className={`edit-btn ${isEditing ? "editing" : ""}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className={`fas ${isEditing ? "fa-times" : "fa-edit"}`}></i>
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Edit Form or Display Details */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3 className="section-title">Update Your Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-user"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-envelope"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-phone"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <i className="fas fa-save"></i>
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  <i className="fas fa-times"></i>
                  Discard Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="details-section">
                <h3 className="section-title">Account Information</h3>
                <div className="details-list">
                  <div className="detail-item">
                    <div className="detail-icon">
                      <i className="fas fa-user-tag"></i>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Account Type</span>
                      <span className="detail-value">
                        {user?.role || "User"}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Email Address</span>
                      <span className="detail-value">{user?.email}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Phone Number</span>
                      <span className="detail-value">{user?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #f8f0e3 0%,
            #fff 50%,
            #f8f0e3 100%
          );
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Simple Header Section */
        .page-header-section {
          background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
          color: white;
          padding: 80px 0 60px;
          text-align: center;
        }

        .header-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 3rem;
          margin-bottom: 15px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        /* Profile Card */
        .profile-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin: -30px auto 60px;
          max-width: 800px;
          position: relative;
          z-index: 2;
        }

        /* Profile Header */
        .profile-header {
          padding: 40px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          display: flex;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }

        .profile-info {
          flex: 1;
        }

        .user-name {
          font-size: 1.8rem;
          color: #333;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .user-email {
          color: #666;
          font-size: 1rem;
          margin-bottom: 4px;
        }

        .user-phone {
          color: #666;
          font-size: 1rem;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #d4af37;
          color: white;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .edit-btn:hover {
          background: #b8941f;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }

        .edit-btn.editing {
          background: #6c757d;
        }

        .edit-btn.editing:hover {
          background: #5a6268;
        }

        /* Form Styles */
        .profile-form {
          padding: 40px;
        }

        .section-title {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 25px;
          font-weight: 600;
          border-bottom: 2px solid #f8f0e3;
          padding-bottom: 10px;
        }

        .form-grid {
          display: grid;
          gap: 25px;
          margin-bottom: 30px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .form-label i {
          color: #d4af37;
          width: 16px;
        }

        .form-input {
          padding: 14px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          border-color: #d4af37;
          outline: none;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .save-btn,
        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .save-btn {
          background: #d4af37;
          color: white;
        }

        .save-btn:hover {
          background: #b8941f;
          transform: translateY(-2px);
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        .cancel-btn:hover {
          background: #5a6268;
        }

        /* Profile Details */
        .profile-details {
          padding: 40px;
        }

        .details-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 15px;
          border-left: 4px solid #d4af37;
          transition: all 0.3s ease;
        }

        .detail-item:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .detail-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          font-size: 1.2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .detail-content {
          flex: 1;
        }

        .detail-label {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .detail-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        /* Footer Section */
        .main-footer {
          background: #2c3e50;
          color: white;
          padding: 50px 0 20px;
          margin-top: 60px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h3 {
          color: #d4af37;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }

        .footer-section h4 {
          color: #d4af37;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }

        .footer-section p {
          color: #bdc3c7;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .footer-section a {
          display: block;
          color: #bdc3c7;
          text-decoration: none;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: #d4af37;
        }

        .footer-bottom {
          border-top: 1px solid #34495e;
          padding-top: 20px;
          text-align: center;
          color: #bdc3c7;
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 20px;
            padding: 30px;
          }

          .profile-info {
            text-align: center;
          }

          .form-actions {
            flex-direction: column;
          }

          .profile-form,
          .profile-details {
            padding: 30px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 480px) {
          .page-header-section {
            padding: 60px 0 40px;
          }

          .page-title {
            font-size: 2rem;
          }

          .profile-header {
            padding: 25px;
          }

          .profile-avatar {
            width: 80px;
            height: 80px;
            font-size: 1.5rem;
          }

          .user-name {
            font-size: 1.5rem;
          }

          .profile-form,
          .profile-details {
            padding: 25px;
          }

          .detail-item {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .detail-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
