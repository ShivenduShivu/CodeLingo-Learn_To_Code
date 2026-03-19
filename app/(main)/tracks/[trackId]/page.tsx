import { getLevels } from "@/lib/supabase/queries";
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
    // A level is unlocked when the previous level exists in level_progress
    const levelIds = levels.map((l) => l.id);
    const { data: completedLevels } = await supabase
      .from('level_progress')
      .select('level_id')
      .eq('user_id', user.id)
      .in('level_id', levelIds);

    const completedLevelIds = new Set(completedLevels?.map((cl) => cl.level_id) || []);

    let highestUnlocked = 1;

    for (const level of levels) {
      if (completedLevelIds.has(level.id)) {
        highestUnlocked = Math.max(highestUnlocked, level.level_number + 1);
      }
    }

    currentLevelNumber = highestUnlocked;
  }

  // Cap at 100% just in case
  const progressPercentage = Math.min(
      Math.max(((currentLevelNumber - 1) / Math.max(levels.length, 1)) * 100, 0), 100
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Level Map</h1>
        <p className="text-muted-foreground text-lg">Follow the path and complete lessons to unlock your skills.</p>
      </div>
      
      <MapContainer progressPercentage={progressPercentage}>
        <SkipNode trackId={params.trackId} />
        <LevelPath levels={levels} currentLevelNumber={currentLevelNumber} />
      </MapContainer>
    </div>
  );
}
