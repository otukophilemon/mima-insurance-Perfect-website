// app/claim/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  DollarSign,
  Upload,
  MessageSquare,
  PhoneCall,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SERVICES } from '@/data/services';
import { COMPANY } from '@/data/company';

const STEPS = ['Claim Type', 'Incident Details', 'Your Details', 'Review'];

export default function ClaimPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [formData, setFormData] = useState({
    claimType: '',
    policyNumber: '',
    incidentDate: '',
    incidentDescription: '',
    estimatedValue: '',
    fullName: '',
    email: '',
    phone: '',
    additionalNotes: '',
  });

  const selectedService = SERVICES.find((s) => s.id === formData.claimType);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire up to backend (Supabase) in Step 2
    console.log('Claim submitted:', formData);
    // Generate tracking number
    const trackNum = `MIMA-${Date.now().toString().slice(-8)}`;
    setTrackingNumber(trackNum);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStepValid = () => {
    if (step === 0) return !!formData.claimType;
    if (step === 1)
      return !!(
        formData.incidentDate &&
        formData.incidentDescription &&
        formData.estimatedValue
      );
    if (step === 2)
      return !!(
        formData.fullName &&
        formData.email &&
        formData.phone &&
        formData.policyNumber
      );
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            File Your <span className="text-yellow-400">Claim</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Submit your insurance claim online. Our claims team will review and
            respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[60px] lg:top-[68px] z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      i < step
                        ? 'bg-green-500 text-white'
                        : i === step
                        ? 'bg-[#dc2626] text-white ring-4 ring-red-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i < step ? <CheckCircle size={18} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs md:text-sm font-semibold hidden md:block ${
                      i <= step ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 md:mx-4 transition-colors ${
                      i < step ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          {submitted ? (
            /* Success Screen */
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Claim Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thank you, <strong>{formData.fullName}</strong>. Your claim has
                been received and our team will review it shortly.
              </p>

              <div className="bg-blue-50 rounded-2xl p-6 mb-8 max-w-lg mx-auto">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Your Tracking Number
                </div>
                <div className="text-2xl font-bold text-[#1e3a8a] tracking-wider mb-2">
                  {trackingNumber}
                </div>
                <p className="text-xs text-gray-600">
                  Save this number to track your claim status
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 max-w-lg mx-auto text-left">
                <h3 className="font-bold text-gray-900 mb-3">
                  What happens next?
                </h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-[#dc2626]">1.</span>
                    <div>
                      <div className="font-semibold">Claim acknowledgment</div>
                      <div className="text-gray-500 text-xs">
                        Within 2 hours via email & SMS
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-[#dc2626]">2.</span>
                    <div>
                      <div className="font-semibold">Assessment & documentation</div>
                      <div className="text-gray-500 text-xs">
                        Our team reviews your submission within 24 hours
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-[#dc2626]">3.</span>
                    <div>
                      <div className="font-semibold">Settlement processing</div>
                      <div className="text-gray-500 text-xs">
                        Once approved, payment within 3-5 working days
                      </div>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="flex gap-3 justify-center flex-wrap">
                <Link
                  href="/"
                  className="px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-full transition"
                >
                  Back to Home
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
                >
                  {/* STEP 1: Claim Type */}
                  {step === 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        What type of claim is this?
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Select the insurance product your claim relates to
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {SERVICES.map((service) => {
                          const Icon = service.icon;
                          const isSelected =
                            formData.claimType === service.id;
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  claimType: service.id,
                                })
                              }
                              className={`text-left p-4 rounded-2xl border-2 transition-all ${
                                isSelected
                                  ? 'border-[#dc2626] bg-red-50 shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-2`}
                              >
                                <Icon className="text-white" size={20} />
                              </div>
                              <div className="font-semibold text-gray-900 text-xs leading-tight">
                                {service.title}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Incident Details */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Tell us about the incident
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Provide details about what happened
                      </p>

                      <div className="space-y-5">
                        {/* Selected service badge */}
                        {selectedService && (
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedService.gradient} flex items-center justify-center`}
                            >
                              <selectedService.icon
                                className="text-white"
                                size={20}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-gray-500">
                                Claim type
                              </div>
                              <div className="font-semibold text-gray-900">
                                {selectedService.title}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Incident Date */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={14} /> Date of Incident *
                          </label>
                          <input
                            type="date"
                            name="incidentDate"
                            required
                            value={formData.incidentDate}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText size={14} /> Description of Incident *
                          </label>
                          <textarea
                            name="incidentDescription"
                            required
                            rows={5}
                            value={formData.incidentDescription}
                            onChange={handleChange}
                            placeholder="Please describe what happened in detail..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                          />
                        </div>

                        {/* Estimated Value */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <DollarSign size={14} /> Estimated Claim Value (KES) *
                          </label>
                          <input
                            type="text"
                            name="estimatedValue"
                            required
                            value={formData.estimatedValue}
                            onChange={handleChange}
                            placeholder="e.g. 150,000"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                          />
                        </div>

                        {/* File upload (placeholder) */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Upload size={14} /> Supporting Documents
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#dc2626] transition cursor-pointer">
                            <Upload
                              className="text-gray-400 mx-auto mb-2"
                              size={28}
                            />
                            <p className="text-sm text-gray-600">
                              Click to upload photos, police reports, or receipts
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PDF, JPG, PNG (max 10MB each)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Personal Details */}
                  {step === 2 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Your details
                      </h2>
                      <p className="text-gray-600 mb-8">
                        We need to identify you and your policy
                      </p>

                      <div className="space-y-5">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <User size={14} /> Full Name *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g. John Kamau"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                          />
                        </div>

                        {/* Email & Phone */}
                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <Mail size={14} /> Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="you@example.com"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <Phone size={14} /> Phone *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="0712 345 678"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                            />
                          </div>
                        </div>

                        {/* Policy Number */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <ShieldCheck size={14} /> Policy Number *
                          </label>
                          <input
                            type="text"
                            name="policyNumber"
                            required
                            value={formData.policyNumber}
                            onChange={handleChange}
                            placeholder="e.g. MIMA/MOT/2024/00123"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Find this on your policy documents or contact us
                          </p>
                        </div>

                        {/* Additional Notes */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MessageSquare size={14} /> Additional Notes
                          </label>
                          <textarea
                            name="additionalNotes"
                            rows={3}
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            placeholder="Anything else we should know?"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Review */}
                  {step === 3 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Review your claim
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Confirm your details before submitting
                      </p>

                      <div className="space-y-4 bg-gray-50 rounded-2xl p-6">
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-600">Claim Type</span>
                          <span className="font-semibold text-gray-900">
                            {selectedService?.title || 'Not selected'}
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-600">Incident Date</span>
                          <span className="font-semibold text-gray-900">
                            {formData.incidentDate}
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-600">Estimated Value</span>
                          <span className="font-semibold text-gray-900">
                            KES {formData.estimatedValue}
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-600">Full Name</span>
                          <span className="font-semibold text-gray-900">
                            {formData.fullName}
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-600">Email</span>
                          <span className="font-semibold text-gray-900 break-all">
                            {formData.email}
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-gray-600">Phone</span>
                          <span className="font-semibold text-gray-900">
                            {formData.phone}
                          </span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="text-gray-600">Policy Number</span>
                          <span className="font-semibold text-gray-900">
                            {formData.policyNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-8 mt-8 border-t border-gray-100">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition"
                      >
                        Previous
                      </button>
                    )}
                    {step < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="ml-auto inline-flex items-center gap-2 px-8 py-3 bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all shadow-lg"
                      >
                        Continue <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="ml-auto inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all shadow-lg"
                      >
                        Submit Claim <CheckCircle size={18} />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Help Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Need Help?
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Our claims team is available to assist you.
                    </p>

                    <div className="space-y-3">
                      <a
                        href={`tel:${COMPANY.offices[0].phoneLink}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition group"
                      >
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                          <PhoneCall className="text-[#dc2626]" size={18} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Call us</div>
                          <div className="font-semibold text-gray-900 group-hover:text-[#dc2626] transition text-sm">
                            {COMPANY.offices[0].phone}
                          </div>
                        </div>
                      </a>

                      <a
                        href={`https://wa.me/${COMPANY.whatsapp.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition group"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                          <MessageSquare
                            className="text-green-600"
                            size={18}
                          />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">WhatsApp</div>
                          <div className="font-semibold text-gray-900 group-hover:text-green-600 transition text-sm">
                            Chat now
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Response Timeline */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="text-[#1e3a8a]" size={20} />
                      Response Time
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span className="text-gray-700">
                          <strong>Acknowledgment:</strong> Within 2 hours
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span className="text-gray-700">
                          <strong>Review:</strong> Within 24 hours
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span className="text-gray-700">
                          <strong>Settlement:</strong> Within 3-5 working days
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}