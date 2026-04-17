"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import { fetchSermons } from "@/lib/api/youtube";
import { Modal } from "@/components/ui";
import type { YouTubeVideo } from "@/types";

function SermonCard({
  video,
  index,
  onClick,
}: {
  video: YouTubeVideo;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-primary-100 mb-4">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-primary-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-accent-500 flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 text-primary-900 ml-1" fill="currentColor" />
          </div>
        </div>
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs rounded-md">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="font-serif font-bold text-lg text-primary-900 mb-2 line-clamp-2 group-hover:text-accent-600 transition-colors">
        {video.title}
      </h3>
      <p className="text-muted text-sm">
        {formatDate(video.publishedAt)}
        {video.viewCount && (
          <span className="ml-2">• {formatViewCount(video.viewCount)} views</span>
        )}
      </p>
    </motion.div>
  );
}

function formatDuration(duration: string): string {
  // YouTube duration format: PT1H2M3S
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return viewCount;
}

export function SermonsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sermons, setSermons] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const loadSermons = async () => {
      try {
        const videos = await fetchSermons(6);
        setSermons(videos);
      } catch (error) {
        console.error("Error loading sermons:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSermons();
  }, []);

  return (
    <section id="sermons" ref={ref} className="py-28 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Play className="w-4 h-4" />
            Sermons
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
            Watch Our Sermons
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Experience the power of God&apos;s Word through our Sunday services, midweek
            studies, and special messages.
          </p>
          <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Sermons Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video rounded-2xl bg-primary-100 mb-4" />
                <div className="h-6 bg-primary-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-primary-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermons.map((video, index) => (
              <SermonCard
                key={video.id}
                video={video}
                index={index}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://www.youtube.com/@hisdayspring"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-900 text-white rounded-full font-medium hover:bg-primary-800 transition-colors"
          >
            View All Sermons on YouTube
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo?.title || ""}
        size="xl"
      >
        {selectedVideo && (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </div>
        )}
      </Modal>
    </section>
  );
}
