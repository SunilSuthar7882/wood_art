import { CheckCircle } from "@mui/icons-material";

import React from "react";

const CouponInput = React.memo(function CouponInput({
  value,
  disabled,
  onChange,
  applied,
}) {
  return (
    <div className="relative flex-grow">
      <input
        type="text"
        placeholder="Enter code"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full text-gray-800 h-9 rounded-md ps-2 pr-10"
        autoComplete="off"
      />
      {applied && (
        <CheckCircle
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
          fontSize="small"
        />
      )}
    </div>
  );
});
CouponInput.displayName = "CouponInput";

const ApplyButton = React.memo(function ApplyButton({
  code,
  pending,
  applied,
  onApply,
  onRemove,
}) {
  const disabledApply = !code.trim() || pending;
  return applied ? (
    <button
      type="button"
      onClick={onRemove}
      className="bg-gray-200 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-300 transition duration-300 text-sm"
    >
      Remove
    </button>
  ) : (
    <button
      type="button"
      onClick={onApply}
      disabled={disabledApply}
      className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 text-sm"
    >
      {pending ? "Verifying..." : "Verify"}
    </button>
  );
});
ApplyButton.displayName = "ApplyButton";

// Message: shows error or success
const Message = React.memo(function Message({ error, applied, discount }) {
  if (error && !applied) {
    return (
      <p className="text-sm text-red-400 mt-1">
        {error.message || "Invalid coupon code"}
      </p>
    );
  }
  if (applied) {
    return (
      <p className="text-sm text-green-400 mt-1">
        {discount > 0
          ? `Coupon verified successfully! Saved: $${discount.toFixed(2)}`
          : "Coupon verified successfully!"}
      </p>
    );
  }
  return null;
});
Message.displayName = "Message";

const CouponSection = React.memo(
  function CouponSection({
    couponCode,
    couponApplied,
    isVerifyCouponCodePending,
    verifyCouponCodeError,
    discountAmount,
    handleCouponChange,
    handleApplyCoupon,
    handleRemoveCoupon,
  }) {
    return (
      <div className="my-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-2 gap-1">
          <label className="text-sm font-medium">Coupon Code:</label>
          <CouponInput
            value={couponCode}
            disabled={couponApplied || isVerifyCouponCodePending}
            onChange={handleCouponChange}
            applied={couponApplied}
          />
          <ApplyButton
            code={couponCode}
            pending={isVerifyCouponCodePending}
            applied={couponApplied}
            onApply={handleApplyCoupon}
            onRemove={handleRemoveCoupon}
          />
        </div>
        <Message
          error={verifyCouponCodeError}
          applied={couponApplied}
          discount={discountAmount}
        />
      </div>
    );
  },
  // Remove the custom comparison function to ensure the component always re-renders
  // This will help maintain focus on the input field
  null
);
CouponSection.displayName = "CouponSection";

export default CouponSection;
