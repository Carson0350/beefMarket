'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema (matches API schema)
const inquiryFormSchema = z.object({
  breederName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  breederEmail: z.string().email('Invalid email address'),
  breederPhone: z.string().optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

type InquiryFormData = z.infer<typeof inquiryFormSchema>;

interface InquiryFormProps {
  bullId: string;
  bullName: string;
  ranchName: string;
}

export default function InquiryForm({
  bullId,
  bullName,
  ranchName,
}: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
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
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bullId,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || 'An error occurred while submitting your inquiry'
        );
      }

      // Success
      setSubmitStatus({
        type: 'success',
        message: `Your inquiry has been sent to ${ranchName}`,
      });

      // Reset form
      reset({
        breederName: '',
        breederEmail: '',
        breederPhone: '',
        message: `I'm interested in ${bullName}`,
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while submitting your inquiry',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Ranch</h2>
      <p className="text-gray-600 mb-6">
        Interested in {bullName}? Send an inquiry to {ranchName}.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Breeder Name */}
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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              errors.breederName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.breederName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.breederName.message}
            </p>
          )}
        </div>

        {/* Breeder Email */}
        <div>
          <label
            htmlFor="breederEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register('breederEmail')}
            type="email"
            id="breederEmail"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              errors.breederEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.breederEmail && (
            <p className="mt-1 text-sm text-red-600">
              {errors.breederEmail.message}
            </p>
          )}
        </div>

        {/* Breeder Phone (Optional) */}
        <div>
          <label
            htmlFor="breederPhone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Phone <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            {...register('breederPhone')}
            type="tel"
            id="breederPhone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Message */}
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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`I'm interested in ${bullName}`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Minimum 10 characters, maximum 2000 characters
          </p>
        </div>

        {/* Submit Status Messages */}
        {submitStatus && (
          <div
            className={`p-4 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            !isValid || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
}
