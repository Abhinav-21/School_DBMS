import { NextResponse } from 'next/server';
import { put } from '@vercel/blob'; // For image uploads
import { z } from 'zod'; // For validation
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define a schema for form validation using Zod
// This ensures all data is correct before we even touch the database
const SchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  contact: z.coerce
    .number()
    .min(1000000000, 'Must be a 10-digit phone number')
    .max(9999999999, 'Must be a 10-digit phone number'),
  email_id: z.string().email('Invalid email address'),
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size > 0, 'Image is required')
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
      `Image must be 5MB or less.`
    )
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png, or .webp formats are supported.'
    ),
});

// This is the POST function that Next.js will run
// when someone sends data to /api/add-school
export async function POST(request: Request) {
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid form data' },
      { status: 400 }
    );
  }

  // Get all the fields from the FormData
  const data = {
    name: formData.get('name'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    contact: formData.get('contact'),
    email_id: formData.get('email_id'),
    image: formData.get('image'),
  };

  // 1. VALIDATE THE DATA
  // We use Zod's .safeParse which returns success/failure
  const validationResult = SchoolSchema.safeParse(data);

  if (!validationResult.success) {
    // If validation fails, return the errors
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: validationResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Destructure the validated data
  const { name, address, city, state, contact, email_id, image } =
    validationResult.data;

  try {
    // 2. UPLOAD THE IMAGE to Vercel Blob
    // We create a unique filename to prevent conflicts
    const uniqueFilename = `${Date.now()}-${image.name}`;

    const blob = await put(uniqueFilename, image, {
      access: 'public', // Make the image viewable by anyone
    });

    // `blob.url` is the public URL of the uploaded image.
    // This is what we will save in our database.

    // 3. SAVE THE DATA TO THE DATABASE
    // We use Prisma to create a new record in our 'School' table
    const newSchool = await prisma.school.create({
      data: {
        name: name,
        address: address,
        city: city,
        state: state,
        contact: BigInt(contact), // Convert contact to BigInt for Prisma
        email_id: email_id,
        image: blob.url, // Save the image URL from Vercel Blob
      },
    });

    // 4. SEND A SUCCESS RESPONSE
    // We return the new school data (including the ID)
    return NextResponse.json(
      {
        message: 'School added successfully!',
        school: newSchool,
      },
      { status: 201 } // 201 means "Created"
    );
  } catch (error) {
    console.error('Error in POST /api/add-school:', error);
    // This is a general "catch-all" error
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}