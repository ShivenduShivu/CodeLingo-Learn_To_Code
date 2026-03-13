import { getCourseBySlug, getTracks } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Link from "next/link";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const tracks = await getTracks(course.id);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
      <div 
        className="p-8 rounded-2xl border-b-8 border-border text-white shadow-xl"
        style={{ backgroundColor: course.color_hex, borderColor: `${course.color_hex}90` }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
          {course.title}
        </h1>
        <p className="text-white/80 text-lg mt-2 font-medium">
          {course.description}
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Learning Tracks</h2>
        
        {tracks.length === 0 ? (
          <p className="text-muted-foreground">No tracks generated for this course yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {tracks.map(track => (
              <div key={track.id} className="p-6 bg-card border-2 border-border border-b-4 rounded-xl flex justify-between items-center transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <h3 className="text-lg font-bold">{track.title}</h3>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {track.difficulty_level}
                  </span>
                </div>
                <Link 
                  href={`/tracks/${track.id}`}
                  className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-xl border-b-4 border-primary-foreground/20 hover:bg-primary/90 active:translate-y-1 active:border-b-0 transition-all text-center"
                >
                  Start Level Map
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
