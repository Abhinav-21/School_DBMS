import { PrismaClient } from '@prisma/client';
import SchoolCard from '@/app/components/SchoolCard'; // Adjust path if needed

// Define the School type
type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  image: string;
};

// Initialize Prisma Client
// We can do this here because this is a Server Component
const prisma = new PrismaClient();

// This function fetches the data directly from the database
async function getSchools() {
  const schools = await prisma.school.findMany({
    // Only select the data we need to display
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      image: true,
    },
    orderBy: {
      createdAt: 'desc', // Show the newest schools first
    },
  });
  return schools;
}

// This is the main page component (it's async)
export default async function ShowSchoolsPage() {
  // Fetch the data when the page loads on the server
  const schools = await getSchools();

  return (
    <main className="mx-auto max-w-7xl p-6 sm:p-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
        Registered Schools
      </h1>

      {/* --- Empty State --- */}
      {/* Show a message if no schools are in the database yet */}
      {schools.length === 0 ? (
        <div className="flex h-60 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            No schools have been added yet.
          </p>
        </div>
      ) : (
        /* --- Responsive Grid --- */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school: School) => (
            // The `key` prop is essential for React lists
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      )}
    </main>
  );
}