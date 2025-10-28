import Image from 'next/image';

// Define the type for the props we expect
// We only get the fields we selected in our Prisma query
type SchoolCardProps = {
  school: {
    id: number;
    name: string;
    address: string;
    city: string;
    image: string;
  };
};

export default function SchoolCard({ school }: SchoolCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* --- Image Section --- */}
      <div className="relative h-48 w-full">
        <Image
          src={school.image}
          alt={`Image of ${school.name}`}
          layout="fill"
          objectFit="cover" // This makes the image cover the area, like on an e-commerce site
          className="bg-gray-100" // A light background for while the image loads
        />
      </div>

      {/* --- Content Section --- */}
      <div className="p-4">
        {/* School Name */}
        <h3 className="truncate text-lg font-semibold text-gray-900" title={school.name}>
          {school.name}
        </h3>

        {/* Address */}
        <p className="mt-1 truncate text-sm text-gray-600" title={school.address}>
          {school.address}
        </p>

        {/* City */}
        <p className="mt-1 text-sm text-gray-600">{school.city}</p>
      </div>
    </div>
  );
}