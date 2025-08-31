"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Cover } from "@/types/cover";
import Image from "next/image";
import Link from "next/link";

export default function GalleryPage() {
  const [covers, setCovers] = useState<Cover[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver>();
  const lastCoverRef = useRef<HTMLDivElement>(null);

  const loadMoreCovers = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/get-covers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, limit: 20 }),
      });
      const data = await response.json();
      
      if (data.code === 0 && data.data) {
        const newCovers = data.data || [];
        if (newCovers.length === 0) {
          setHasMore(false);
        } else {
          setCovers(prev => [...prev, ...newCovers]);
          setPage(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Failed to load covers:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMoreCovers();
  }, []);

  useEffect(() => {
    if (lastCoverRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMoreCovers();
          }
        },
        { threshold: 0.1 }
      );
      
      observer.current.observe(lastCoverRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMoreCovers, hasMore, loading]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-4 md:px-10 md:py-4">
        <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl md:text-6xl font-bold text-primary mt-8 md:mt-24">
            Funny Coloring Pages Gallery
        </h1>
        <h2 className="text-2xl md:text-4xl my-8 text-secondary-foreground">
            Explore our collection of AI-generated coloring pages
        </h2>
        </div>
        <div className="mb-8 grid w-full grid-cols-1 md:mb-12 md:grid-cols-1 md:gap-4 lg:mb-16">
        <div className="mx-auto max-w-7xl px-5 my-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {covers.map((cover, index) => (
            <div
              key={cover.uuid}
              ref={index === covers.length - 1 ? lastCoverRef : null}
            >
              <a
                href={`/cover/${cover.uuid}`}
                className="relative overflow-hidden cursor-pointer block"
              >
                <img
                  src={cover.img_url}
                  alt={`${cover.img_description} coloring page`}
                  width="280"
                  height="280"
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </a>
            </div>
          ))}
        </div>
        </div>
        </div>

        {loading && (
          <div className="text-center py-6 sm:py-8">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary/10 text-primary rounded-full text-sm sm:text-base">
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary mr-2"></div>
              Loading more...
            </div>
          </div>
        )}

        {!hasMore && covers.length > 0 && (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-gray-500">No more covers to load</p>
          </div>
        )}
      </div>
    </div>
  );
}