// app/quote/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SERVICES } from '@/data/services';

const STEPS = ['Insurance Type', 'Your Details', 'Review & Submit'];

function QuotePageContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    insuranceType: '',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    age: '',
    details: '',
  });

  // Auto-select insurance type from URL (?type=motor)
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl) {
      setFormData((prev) => ({ ...prev, insuranceType: typeFromUrl }));
      setStep(1); // Skip straight to step 2 if type is preselected
    }
  }, [searchParams]);

  const selectedService = SERVICES.find((s) => s.id === formData.insuranceType);

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
    // TODO: Wire up to backend (Supabase) later
    console.log('Quote submitted:', formData);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStepValid = () => {
    if (step === 0) return !!formData.insuranceType;
    if (step === 1)
      return (
        formData.fullName && formData.email && formData.phone && formData.location
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
            Get Your Free <span className="text-yellow-400">Quote</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Fast, easy, and obligation-free. Tell us what you need and our
            brokers will get back to you within 24 hours.
          </p>
        </div>
      </section>

            {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[60px] lg:top-[68px] z-30">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
                    className={`text-sm font-semibold hidden md:block ${
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
        <div className="max-w-4xl mx-auto px-6">
          {submitted ? (
            /* Success Screen */
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Quote Request Submitted!
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thank you, <strong>{formData.fullName}</strong>. Your request for{' '}
                <strong>{selectedService?.title}</strong> has been received. Our
                team will contact you at <strong>{formData.phone}</strong> within
                24 hours.
              </p>

              <div className="bg-blue-50 rounded-2xl p-6 mb-8 max-w-lg mx-auto text-left">
                <h3 className="font-bold text-gray-900 mb-3">
                  What happens next?
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-bold text-[#dc2626]">1.</span>
                    Our broker reviews your information
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#dc2626]">2.</span>
                    We compare quotes from top insurers
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#dc2626]">3.</span>
                    We call or email you with the best options
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
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setStep(0);
                    setFormData({
                      insuranceType: '',
                      fullName: '',
                      email: '',
                      phone: '',
                      location: '',
                      age: '',
                      details: '',
                    });
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition"
                >
                  Submit Another Quote
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
            >
              {/* STEP 1: Insurance Type */}
              {step === 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    What type of insurance do you need?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Select the product you'd like a quote for
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SERVICES.map((service) => {
                      const Icon = service.icon;
                      const isSelected = formData.insuranceType === service.id;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              insuranceType: service.id,
                            })
                          }
                          className={`text-left p-4 rounded-2xl border-2 transition-all ${
                            isSelected
                              ? 'border-[#dc2626] bg-red-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center`}
                            >
                              <Icon className="text-white" size={20} />
                            </div>
                            {isSelected && (
                              <CheckCircle
                                className="text-[#dc2626] ml-auto"
                                size={20}
                              />
                            )}
                          </div>
                          <div className="font-bold text-gray-900 text-sm leading-tight">
                            {service.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Tell us about yourself
                  </h2>
                  <p className="text-gray-600 mb-8">
                    We'll use this to send you your personalized quote
                  </p>

                  <div className="space-y-5">
                    {/* Selected service badge */}
                    {selectedService && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedService.gradient} flex items-center justify-center`}
                        >
                          <selectedService.icon className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">
                            Selected product
                          </div>
                          <div className="font-semibold text-gray-900">
                            {selectedService.title}
                          </div>
                        </div>
                      </div>
                    )}

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

                    {/* Location & Age */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin size={14} /> Location *
                        </label>
                        <select
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition bg-white"
                        >
                          <option value="">Select your county</option>
                          <option value="Nairobi">Nairobi</option>
                          <option value="Nakuru">Nakuru</option>
                          <option value="Mombasa">Mombasa</option>
                          <option value="Kisumu">Kisumu</option>
                          <option value="Kiambu">Kiambu</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Age (optional)
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="e.g. 35"
                          min="18"
                          max="100"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare size={14} /> Additional Details
                      </label>
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us more about what you need covered..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 outline-none transition resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Review */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Review your information
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Confirm your details before submitting
                  </p>

                  <div className="space-y-4 bg-gray-50 rounded-2xl p-6">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Insurance Type</span>
                      <span className="font-semibold text-gray-900">
                        {selectedService?.title || 'Not selected'}
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
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Location</span>
                      <span className="font-semibold text-gray-900">
                        {formData.location}
                      </span>
                    </div>
                    {formData.age && (
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600">Age</span>
                        <span className="font-semibold text-gray-900">
                          {formData.age}
                        </span>
                      </div>
                    )}
                    {formData.details && (
                      <div className="py-3">
                        <div className="text-gray-600 mb-2">
                          Additional Details
                        </div>
                        <div className="text-gray-900 text-sm bg-white p-3 rounded-lg">
                          {formData.details}
                        </div>
                      </div>
                    )}
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
                    Submit Quote Request <CheckCircle size={18} />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}


export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Loading quote form...</p>
        </div>
      }
    >
      <QuotePageContent />
    </Suspense>
  );
}