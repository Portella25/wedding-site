"use client";

import { useState } from "react";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion } from "framer-motion";

interface Foto {
  id: string;
  url: string;
  legenda?: string;
  convidado_nome?: string; // Se fizermos join no backend
}

interface PhotoGalleryProps {
  photos: Foto[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [index, setIndex] = useState(-1);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-[var(--text-secondary)] bg-white/50 rounded-xl border border-dashed border-[var(--gold-light)]">
        <p>Ainda não há fotos. Seja o primeiro a compartilhar!</p>
      </div>
    );
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {photos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="mb-4 break-inside-avoid group cursor-pointer"
            onClick={() => setIndex(idx)}
          >
            <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white">
              <img
                src={photo.url}
                alt={photo.legenda || "Foto do casamento"}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium truncate">
                  {photo.legenda || "Sem legenda"}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </Masonry>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos.map((p) => ({ src: p.url, title: p.legenda }))}
      />
    </>
  );
}
