# Inbound media

Drop replacement photography and video here, then point the matching admin
records (Tours / Hotels / Fleet / Destinations) at the new paths.

```
images/inbound/
  heroes/         full-bleed page hero images  (~1600–2200px wide, JPG, ~70% quality)
  tours/          tour cover + gallery images
  hotels/         hotel cover + gallery images
  fleet/          vehicle cover + gallery images
  destinations/   region hero + gallery images  (hills-*, culture-*, coast-*, wild-*, adv-*)
  video/          compressed MP4 clips (see below)
  posters/        poster stills for the videos (JPG)
```

## Guidance

- **Images:** export JPG at ~70% quality, longest edge 1600px for heroes / 1200px
  for cards. Aim for < 400 KB each. Every `<img>` on the site is already
  `loading="lazy"` and has an `alt`.
- **Video:** keep clips **short (10–25s)** and **compressed** — target
  1280×720, ~2–3 Mbps, under ~3 MB. Provide a poster image the same size.
  On the site videos are `preload="none"`, play on tap, and pause when
  scrolled out of view, so page weight on first load stays low.
- AI-generated clips (PixVerse, Kling, etc.) are fine — export at 720p and
  compress before adding.
- Aspect ratios are handled by CSS (`video-frame` = 16:9, hero = cover), so
  any reasonable landscape source works without causing horizontal overflow.
