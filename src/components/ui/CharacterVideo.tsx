"use client";

type CharacterVideoProps = {
  src: string;
  alt?: string;
  className?: string;
};

export default function CharacterVideo({
  src,
  alt = "character video",
  className = "",
}: CharacterVideoProps) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-label={alt}
      className={className}
    >
      <source src={src} type="video/webm" />
      你的瀏覽器不支援 webm 播放。
    </video>
  );
}