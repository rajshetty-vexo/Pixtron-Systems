import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  brochureUrl: string;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  isOpen,
  onClose,
  productName,
  brochureUrl,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "", // Honeypot field for bots
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── INPUT SANITIZATION (CLIENT SIDE) ──
  const sanitizeInput = (text: string): string => {
    if (!text) return "";
    return text
      .trim()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);
    setSubmitError(null);

    // ── ALL FIELDS REQUIRED VALIDATION ──
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.company.trim() ||
      !formData.phone.trim()
    ) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    // ── CLIENT-SIDE RATE LIMITING (60-second Cooldown) ──
    const lastSubmission = localStorage.getItem("brochure_last_submission");
    const now = Date.now();

    if (lastSubmission && now - parseInt(lastSubmission) < 60000) {
      const secondsLeft = Math.ceil((60000 - (now - parseInt(lastSubmission))) / 1000);
      setSubmitError(`Too many download attempts. Please wait ${secondsLeft} seconds before trying again.`);
      return;
    }

    // Silent block if honeypot is triggered by a bot
    if (formData.website !== "") {
      return;
    }

    setIsSubmitting(true);

    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: formData.email.trim().toLowerCase(),
      company: sanitizeInput(formData.company),
      phone: sanitizeInput(formData.phone),
      website: formData.website,
    };

    try {
      const response = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sanitizedData,
          productName,
          brochureUrl,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to send brochure.");
      }

      setSubmitMessage(
        "Brochure sent to your email! Please check your inbox (or spam folder)."
      );
      setFormData({ name: "", email: "", phone: "", company: "", website: "" });

      // Save submission timestamp
      localStorage.setItem("brochure_last_submission", Date.now().toString());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send brochure.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitMessage(null);
    setSubmitError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md bg-white border-2 border-[#fbbb0d] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-bold text-[#fbbb0d] uppercase tracking-widest block mb-1">
                Pixtron Systems
              </span>
              <h3 className="text-2xl font-black text-[#003985]">
                Download Brochure
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill all required fields to receive the <span className="font-semibold text-slate-800">{productName}</span> brochure via email.
              </p>
            </div>

            {submitMessage ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  ✓
                </div>
                <p className="text-sm text-emerald-700 font-medium mb-4 leading-relaxed">
                  {submitMessage}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Need assistance? Contact us at{" "}
                  <a href="tel:+919146707884" className="text-[#003985] font-bold">
                    +91 9146707884
                  </a>{" "}
                  or{" "}
                  <a href="mailto:projects@pixtronsystems.com" className="text-[#003985] font-bold">
                    projects@pixtronsystems.com
                  </a>
                </p>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-[#003985] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#003985]/90 transition-all shadow-md active:scale-95"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Full Name *"
                    className="w-full border-b-2 border-slate-200 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#003985] transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Work Email Address *"
                    className="w-full border-b-2 border-slate-200 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#003985] transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    placeholder="Company Name *"
                    className="w-full border-b-2 border-slate-200 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#003985] transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Phone / WhatsApp Number *"
                    className="w-full border-b-2 border-slate-200 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#003985] transition-colors"
                  />
                </div>

                {/* Honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>

                {submitError && (
                  <p className="text-xs text-red-500 font-medium pt-1">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#003985] hover:bg-[#002d6b] text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-[#003985]/20 active:scale-98 mt-3 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending Brochure..." : "Submit & Get Brochure"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrochureModal;