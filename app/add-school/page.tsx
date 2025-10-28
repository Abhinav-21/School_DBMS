// This directive tells Next.js this is a client-side component
// (which is required for forms and user interaction)
'use client';

// We only need react-hook-form and react
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

// Define a simple type for our form fields
// This is much simpler than Zod
type FormInputs = {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: number;
  email_id: string;
  image: FileList; // The type for <input type="file">
};

export default function AddSchoolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // This is the main hook from react-hook-form, as required
  // No complex Zod resolver needed!
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  // This function runs when the form is submitted
  // It's much simpler now
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    setSuccessMessage('');

    // 1. Create a FormData object to send file + text
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('contact', String(data.contact)); // Convert number to string
    formData.append('email_id', data.email_id);
    formData.append('image', data.image[0]); // Get the file from the FileList

    try {
      // 2. Send the form data to our API endpoint
      const response = await fetch('/api/add-school', {
        method: 'POST',
        body: formData, // Send as FormData, not JSON
      });

      const result = await response.json();

      if (!response.ok) {
        // 3. Handle errors from the server
        if (result.issues) {
          // Handle validation errors from the server's Zod
          // We'll just show the first error
          const firstError = Object.values(result.issues)[0] as string[];
          setServerError(firstError[0] || 'Validation failed.');
        } else {
          // Handle other server errors
          setServerError(result.error || 'An unknown error occurred.');
        }
      } else {
        // 4. Handle success
        setSuccessMessage('School added successfully! ID: ' + result.school.id);
        reset(); // Clear the form
      }
    } catch (error) {
      console.error('Submission error:', error);
      setServerError('Failed to submit the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 bg-gray-50">
      <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Add New School
        </h1>

        {/* This is the form element, we use handleSubmit from react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Form fields are in a responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* School Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                School Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'School name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <input
                id="contact"
                type="number"
                {...register('contact', {
                  required: 'Contact is required',
                  minLength: { value: 10, message: 'Must be 10 digits' },
                  maxLength: { value: 10, message: 'Must be 10 digits' },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contact.message}
                </p>
              )}
            </div>
          </div>

          {/* Email ID */}
          <div>
            <label
              htmlFor="email_id"
              className="block text-sm font-medium text-gray-700"
            >
              Email ID
            </label>
            <input
              id="email_id"
              type="email" // Use type="email" for browser validation
              {...register('email_id', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i, // Simple email regex
                  message: 'Invalid email address',
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
              {errors.email_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email_id.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              {...register('address', { required: 'Address is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Responsive grid for City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                {...register('city', { required: 'City is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                {...register('state', { required: 'State is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              School Image
            </label>
            <input
              id="image"
              type="file" // Use type="file"
              accept="image/png, image/jpeg, image/webp"
              {...register('image', { required: 'Image is required' })}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Server Messages */}
          {serverError && (
            <p className="text-sm text-red-600">{serverError}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting} // Disable button while submitting
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Add School'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}