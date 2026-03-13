import { getLevels, getUserProgress } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapContainer } from "@/components/level-map/map-container";
import { LevelPath } from "@/components/level-map/level-path";
import { SkipNode } from "@/components/level-map/skip-node";

export const dynamic = 'force-dynamic';

interface TrackPageProps {
  params: {
    trackId: string;
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const levels = await getLevels(params.trackId);
  
  if (!levels || levels.length === 0) {
    notFound();
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let currentLevelNumber = 1;

  if (user) {
    // Find the course_id for this track to lookup progress correctly
    const { data: track } = await supabase
      .from('tracks')
      .select('course_id')
      .eq('id', params.trackId)
      .single();

    if (track) {
      const progress = await getUserProgress(user.id, track.course_id);
      if (progress) {
         currentLevelNumber = progress.current_level;
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Level Map</h1>
        <p className="text-muted-foreground text-lg">Follow the path and complete lessons to unlock your skills.</p>
      </div>
      
      <MapContainer>
        <SkipNode trackId={params.trackId} />
        <LevelPath levels={levels} currentLevelNumber={currentLevelNumber} />
      </MapContainer>
    </div>
  );
}
