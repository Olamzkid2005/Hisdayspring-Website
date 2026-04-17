"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { fetchSermons } from "@/lib/api/youtube";
import { Modal } from "@/components/ui";
import type { YouTubeVideo } from "@/types";

function formatDuration(duration: string): string {
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

  const featured = sermons[0];
  const others = sermons.slice(1, 4);

  return (
    <section id="sermons" ref={ref} className="bg-surface-container-low py-16 px-4 md:py-24 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-8 md:mb-16"
        >
          <div>
            <h2 className="font-headline text-2xl md:text-4xl text-on-surface">Recent Sermons</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary-container mt-4 rounded-full" />
          </div>
          <a
            href="https://www.youtube.com/@hisdayspring"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium"
          >
            View All Archives
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 animate-pulse">
              <div className="h-[250px] md:h-[450px] rounded-xl bg-surface-container-highest" />
            </div>
            <div className="space-y-8 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface-container-lowest p-4 rounded-xl">
                  <div className="aspect-video rounded-lg bg-surface-container-highest mb-3" />
                  <div className="h-5 bg-surface-container-highest rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface-container-highest rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="md:col-span-2"
              >
                <div
                  className="relative h-[250px] md:h-[450px] rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedVideo(featured)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedVideo(featured);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Play sermon: ${featured.title}`}
                >
                  <img
                    src={featured.thumbnailUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                    <span className="inline-block px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-semibold mb-3">
                      Latest Message
                    </span>
                    <h3 className="font-headline text-xl md:text-3xl text-white mb-2 line-clamp-2">
                      {featured.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {formatDate(featured.publishedAt)}
                      {featured.viewCount && (
                        <span className="ml-2">· {formatViewCount(featured.viewCount)} views</span>
                      )}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                      <Play className="w-7 h-7 text-on-primary ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-8">
              {others.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-3 relative">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" />
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-headline text-sm text-on-surface font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-on-surface-variant text-xs">
                    {formatDate(video.publishedAt)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

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