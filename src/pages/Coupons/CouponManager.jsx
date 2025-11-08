import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "NEW20",
      type: "percent",
      discount: 20,
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      active: true,
      usageCount: 45,
    },
    {
      id: 2,
      code: "SAVE50",
      type: "fixed",
      discount: 50,
      validFrom: "2024-06-01",
      validTo: "2024-06-30",
      active: true,
      usageCount: 12,
    },
  ]);

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percent",
    discount: 0,
    validFrom: "",
    validTo: "",
    active: true,
  });

  const handleAddCoupon = () => {
    setCurrentCoupon(null);
    setNewCoupon({
      code: "",
      type: "percent",
      discount: 0,
      validFrom: "",
      validTo: "",
      active: true,
    });
    setShowCouponModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setCurrentCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount,
      validFrom: coupon.validFrom,
      validTo: coupon.validTo,
      active: coupon.active,
    });
    setShowCouponModal(true);
  };

  const handleSaveCoupon = () => {
    if (!newCoupon.code || !newCoupon.validFrom || !newCoupon.validTo) {
      alert("Please fill in all required fields");
      return;
    }

    if (new Date(newCoupon.validFrom) > new Date(newCoupon.validTo)) {
      alert("Valid From date must be before Valid To date");
      return;
    }

    const coupon = {
      id: currentCoupon?.id || Date.now(),
      ...newCoupon,
      usageCount: currentCoupon?.usageCount || 0,
    };

    if (currentCoupon) {
      setCoupons(coupons.map((c) => (c.id === currentCoupon.id ? coupon : c)));
    } else {
      setCoupons([...coupons, coupon]);
    }

    setShowCouponModal(false);
    setCurrentCoupon(null);
    setNewCoupon({
      code: "",
      type: "percent",
      discount: 0,
      validFrom: "",
      validTo: "",
      active: true,
    });
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  const toggleCouponStatus = (id) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const isCouponValid = (coupon) => {
    const now = new Date();
    const from = new Date(coupon.validFrom);
    const to = new Date(coupon.validTo);
    return now >= from && now <= to;
  };

  const getCouponStatus = (coupon) => {
    if (!coupon.active) return { text: "Inactive", color: "#dc2626", bg: "#fee2e2" };
    if (!isCouponValid(coupon)) return { text: "Expired", color: "#92400e", bg: "#fef3c7" };
    return { text: "Active", color: "#059669", bg: "#d9f0e6" };
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Coupon Manager</h1>
          <button className="custom-btn" onClick={handleAddCoupon}>
            ➕ Create Coupon
          </button>
        </div>

        {/* Existing Coupons */}
        <div className="custom-card">
          <h2>Existing Coupons</h2>
          {coupons.length === 0 ? (
            <p style={{ color: "#666" }}>No coupons created yet. Click "Create Coupon" to get started.</p>
          ) : (
            <Table
              headers={["Code", "Type", "Discount", "Valid From", "Valid To", "Status", "Usage", "Actions"]}
              rows={coupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                return [
                  <strong style={{ color: "#047857" }}>{coupon.code}</strong>,
                  coupon.type === "percent" ? "Percentage" : "Fixed Amount",
                  coupon.type === "percent" ? `${coupon.discount}%` : `$${coupon.discount}`,
                  coupon.validFrom,
                  coupon.validTo,
                  <span
                    className="status-badge"
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      background: status.bg,
                      color: status.color,
                      fontWeight: "500",
                      fontSize: "0.875rem",
                      display: "inline-block",
                    }}
                  >
                    {status.text}
                  </span>,
                  coupon.usageCount,
                  <div className="action-buttons-group">
                    <button className="edit-btn" onClick={() => handleEditCoupon(coupon)}>
                      Edit
                    </button>
                    <button
                      className="deactivate-btn"
                      onClick={() => toggleCouponStatus(coupon.id)}
                    >
                      {coupon.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                    >
                      Delete
                    </button>
                  </div>,
                ];
              })}
            />
          )}
        </div>

        {/* Coupon Summary */}
        <div className="custom-card" style={{ marginTop: "2rem" }}>
          <h2>Coupon Summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Total Coupons</p>
              <h2 style={{ color: "#047857" }}>{coupons.length}</h2>
            </div>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Active Coupons</p>
              <h2 style={{ color: "#047857" }}>
                {coupons.filter((c) => c.active && isCouponValid(c)).length}
              </h2>
            </div>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Total Usage</p>
              <h2 style={{ color: "#047857" }}>
                {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
              </h2>
            </div>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Expired Coupons</p>
              <h2 style={{ color: "#047857" }}>
                {coupons.filter((c) => !isCouponValid(c)).length}
              </h2>
            </div>
          </div>
        </div>

        {/* Create/Edit Coupon Modal */}
        {showCouponModal && (
          <Modal onClose={() => setShowCouponModal(false)}>
            <div className="modal-header">
              <h2>{currentCoupon ? "Edit Coupon" : "Create Coupon"}</h2>
              <button className="modal-close" onClick={() => setShowCouponModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-input">
                <label>Coupon Code *</label>
                <input
                  type="text"
                  placeholder="E.G., NEW20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  style={{ textTransform: "uppercase" }}
                />
              </div>

              <div className="form-input">
                <label>Discount Type *</label>
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="form-input">
                <label>Discount Value *</label>
                <input
                  type="number"
                  min="0"
                  max={newCoupon.type === "percent" ? 100 : undefined}
                  step={newCoupon.type === "percent" ? 1 : 0.01}
                  placeholder={newCoupon.type === "percent" ? "0-100" : "0.00"}
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) || 0 })}
                />
                <small className="form-helper-text">
                  {newCoupon.type === "percent"
                    ? `Discount: ${newCoupon.discount}%`
                    : `Discount: $${newCoupon.discount.toFixed(2)}`}
                </small>
              </div>

              <div className="form-input">
                <label>Valid From *</label>
                <input
                  type="date"
                  value={newCoupon.validFrom}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                />
              </div>

              <div className="form-input">
                <label>Valid To *</label>
                <input
                  type="date"
                  value={newCoupon.validTo}
                  min={newCoupon.validFrom}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validTo: e.target.value })}
                />
              </div>

              <div className="form-input">
                <label>Status</label>
                <select
                  value={newCoupon.active}
                  onChange={(e) => setNewCoupon({ ...newCoupon, active: e.target.value === "true" })}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

              {newCoupon.validFrom && newCoupon.validTo && (
                <div style={{ padding: "1rem", background: "#f0f8f1", borderRadius: "8px", marginTop: "0.5rem" }}>
                  <p style={{ margin: 0, color: "#047857", fontSize: "0.9rem" }}>
                    <strong>Validity Period:</strong> {newCoupon.validFrom} to {newCoupon.validTo}
                  </p>
                  {new Date(newCoupon.validFrom) > new Date(newCoupon.validTo) && (
                    <p style={{ margin: "0.5rem 0 0 0", color: "#dc2626", fontSize: "0.85rem" }}>
                      ⚠️ Valid From date must be before Valid To date
                    </p>
                  )}
                </div>
              )}

              <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
                <button className="custom-btn" onClick={handleSaveCoupon} style={{ width: "100%" }}>
                  {currentCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CouponManager;
