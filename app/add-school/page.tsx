// This directive tells Next.js this is a client-side component
// (which is required for forms and user interaction)
'use client';

// We only need react-hook-form and react
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';

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
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Add a New School
          </h1>
          <Link href="/show-school" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            View Schools
          </Link>
        </div>

        <div className="mt-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">School Name</label>
                <div className="mt-2">
                  <input type="text" id="name" {...register('name', { required: 'School name is required' })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">Contact Number</label>
                <div className="mt-2">
                  <input type="number" id="contact" {...register('contact', { required: 'Contact is required', minLength: { value: 10, message: 'Must be 10 digits' }, maxLength: { value: 10, message: 'Must be 10 digits' } })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                {errors.contact && <p className="mt-2 text-sm text-red-600">{errors.contact.message}</p>}
              </div>

              <div className="col-span-full">
                <label htmlFor="email_id" className="block text-sm font-medium leading-6 text-gray-900">Email ID</label>
                <div className="mt-2">
                  <input type="email" id="email_id" {...register('email_id', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                {errors.email_id && <p className="mt-2 text-sm text-red-600">{errors.email_id.message}</p>}
              </div>

              <div className="col-span-full">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Address</label>
                <div className="mt-2">
                  <input type="text" id="address" {...register('address', { required: 'Address is required' })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-.sm sm:leading-6" />
                </div>
                {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">City</label>
                <div className="mt-2">
                  <input type="text" id="city" {...register('city', { required: 'City is required' })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">State</label>
                <div className="mt-2">
                  <input type="text" id="state" {...register('state', { required: 'State is required' })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
                {errors.state && <p className="mt-2 text-sm text-red-600">{errors.state.message}</p>}
              </div>

              <div className="col-span-full">
                <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">School Image</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label htmlFor="image" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input id="image" type="file" accept="image/png, image/jpeg, image/webp" {...register('image', { required: 'Image is required' })} className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
                {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>}
              </div>
            </div>

            {serverError && <p className="text-sm font-medium text-red-600">{serverError}</p>}
            {successMessage && <p className="text-sm font-medium text-green-600">{successMessage}</p>}

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400">
                {isSubmitting ? 'Submitting...' : 'Add School'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
