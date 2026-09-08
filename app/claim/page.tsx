'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function ClaimPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    claimType: '',
    policyNumber: '',
    claimantName: '',
    claimantEmail: '',
    claimantPhone: '',
    incidentDate: '',
    description: '',
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Claim submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <div className="bg-red-900 text-white py-8 border-b-4 border-red-600">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 w-fit mb-4">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <h1 className="text-4xl font-bold">File a Claim</h1>
          <p className="text-red-100 mt-2">We're here to help you quickly and efficiently</p>
        </div>
      </div>

      {submitted ? (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Claim Filed Successfully!</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded my-6 text-left">
            <p className="text-gray-700"><strong>Claim Reference:</strong> CLM-{Date.now().toString().slice(-8)}</p>
            <p className="text-gray-700 mt-2"><strong>Status:</strong> Pending Review</p>
            <p className="text-gray-600 text-sm mt-4">We'll contact you at {formData.claimantPhone} with updates.</p>
          </div>
          <Link href="/dashboard" className="text-orange-500 hover:text-orange-600 font-semibold">
            View Claim Status in Dashboard →
          </Link>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Claim Information</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <p className="text-yellow-800 text-sm">Please have your policy number ready. All claims are reviewed within 2-3 business days.</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Type of Claim *</label>
              <select
                name="claimType"
                value={formData.claimType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              >
                <option value="">Select claim type</option>
                <option value="auto">Auto Accident</option>
                <option value="property">Property Damage</option>
                <option value="medical">Medical Expense</option>
                <option value="theft">Theft</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Policy Number *</label>
                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="POL-123456"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Incident Date *</label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Claimant Name *</label>
              <input
                type="text"
                name="claimantName"
                value={formData.claimantName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Your full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="claimantEmail"
                  value={formData.claimantEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
                <input
                  type="tel"
                  name="claimantPhone"
                  value={formData.claimantPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Claim Amount (Estimated) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Incident Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 h-32"
                placeholder="Describe what happened in detail..."
              />
            </div>

            <div className="flex gap-4 pt-8">
              <Link href="/" className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-center">
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}