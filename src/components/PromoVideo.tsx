import { useRef, useState } from 'react'
import { BRAND_NAME } from './Nav'

/**
 * Bottom-right video thumbnail, matching the ref's "ORYZO" tile:
 * grows slightly on hover, and clicking swaps the poster image for
 * an actual playing <video>.
 *
 * NOTE: drop your real files in:
 *   public/videos/brand-video.mp4  (the video itself)
 *   public/images/brand-video-poster.jpg  (the thumbnail shown before play)
 * Until those exist, this renders with the wood hero image as a
 * placeholder poster and a video element that won't have anything to
 * play — the interaction (hover/click/pause) is fully wired either way.
 */
export default function PromoVideo() {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggle = () => {
    if (!playing) {
      setPlaying(true)
      // wait a tick for the <video> to mount, then play it
      requestAnimationFrame(() => videoRef.current?.play())
    } else {
      videoRef.current?.pause()
      setPlaying(false)
    }
  }

  return (
    <button
      type="button"
      className={`promo-video ${playing ? 'is-playing' : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Pause video' : 'Play video'}
    >
      {playing ? (
        <video
          ref={videoRef}
          className="promo-video__media"
          src="/videos/brand-video.mp4"
          onEnded={() => setPlaying(false)}
          playsInline
        />
      ) : (
        <img
          className="promo-video__media"
          src="/images/hero-bg.jpg"
          alt=""
        />
      )}

      <span className="promo-video__label">{BRAND_NAME}</span>

      {!playing && (
        <span className="promo-video__play">
          <span className="promo-video__play-icon" />
          PLAY
        </span>
      )}
    </button>
  )
}
