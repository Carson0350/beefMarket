'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema (Applied G.7.0.0 - type declaration)
const inquirySchema = z.object({
  breederName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  breederEmail: z.string().email('Please enter a valid email address'),
  breederPhone: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
          val
        ),
      {
        message: 'Please enter a valid phone number',
      }
    ),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  bullId: string;
  ranchId: string;
  bullName: string;
  ranchName: string;
}

export default function InquiryForm({
  bullId,
  ranchId,
  bullName,
  ranchName,
}: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    mode: 'onBlur',
    defaultValues: {
      breederName: '',
      breederEmail: '',
      breederPhone: '',
      message: `I'm interested in ${bullName}`,
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullId,
          ranchId,
          breederName: data.breederName,
          breederEmail: data.breederEmail,
          breederPhone: data.breederPhone || undefined,
          message: data.message,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to send inquiry';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          // Response is not JSON (likely HTML error page)
          if (response.status === 404) {
            errorMessage = 'Inquiry service is not available yet. Please try again later.';
          } else {
            errorMessage = `Server error (${response.status}). Please try again.`;
          }
        }
        throw new Error(errorMessage);
      }

      // Show success message (Applied G.6.0.0 - meaningful comment)
      setSuccessMessage(`Your inquiry has been sent to ${ranchName}`);
      
      // Reset form with pre-filled message (AC-5.1.7)
      reset({
        breederName: '',
        breederEmail: '',
        breederPhone: '',
        message: `I'm interested in ${bullName}`,
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to send inquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Ranch</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="breederName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('breederName')}
            type="text"
            id="breederName"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[44px]"
            placeholder="Enter your name"
          />
          {errors.breederName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.breederName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="breederEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('breederEmail')}
            type="email"
            id="breederEmail"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[44px]"
            placeholder="your.email@example.com"
          />
          {errors.breederEmail && (
            <p className="mt-1 text-sm text-red-600">
              {errors.breederEmail.message}
            </p>
          )}
        </div>

        {/* Phone Field (Optional) */}
        <div>
          <label
            htmlFor="breederPhone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            {...register('breederPhone')}
            type="tel"
            id="breederPhone"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[44px]"
            placeholder="(555) 123-4567"
          />
          {errors.breederPhone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.breederPhone.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={5}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder="Tell the ranch owner about your interest..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px]"
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
}
