"use client";

import { useState } from "react";
import { Maximize2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PanoramaViewerProps {
  url: string;
  title?: string;
}

export function PanoramaViewer({ url, title = "Toàn cảnh 360°" }: PanoramaViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Xử lý URL: ensure https
  const src = url.trim();

  if (!src) return null;

  const iframe = (
    <div className="relative w-full overflow-hidden rounded-lg bg-gray-100">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-muted-foreground">
          Đang tải toàn cảnh 360°...
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className="h-[380px] w-full border-0 sm:h-[480px] lg:h-[560px]"
        allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex items-center justify-between bg-black px-4 py-2 text-white">
          <span className="text-sm font-medium">{title}</span>
          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded px-3 py-1 text-sm hover:bg-white/10"
            >
              Mở tab mới <ExternalLink className="ml-1 inline h-3 w-3" />
            </a>
            <Button variant="secondary" size="sm" onClick={() => setFullscreen(false)}>
              Đóng
            </Button>
          </div>
        </div>
        <iframe
          src={src}
          title={title}
          className="h-full w-full flex-1 border-0"
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-navy-700 hover:underline"
          >
            Mở tab mới <ExternalLink className="ml-1 h-3.5 w-3.5" />
          </a>
          <Button variant="outline" size="sm" onClick={() => setFullscreen(true)}>
            <Maximize2 className="mr-1 h-4 w-4" /> Toàn màn hình
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-0">
        <div className="px-0 pb-0">{iframe}</div>
        <p className="px-4 py-2 text-center text-xs text-muted-foreground">
          Kéo/ vuốt để xoay — Dùng 2 ngón tay để zoom — Nhấn toàn màn hình để trải nghiệm tốt nhất
        </p>
      </CardContent>
    </Card>
  );
}
