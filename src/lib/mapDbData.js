export function mapEvent(event) {
  return {
    ...event,
    startTime: event.start_time || event.startTime,
    endTime: event.end_time || event.endTime,
  };
}

export function mapProgram(program) {
  return {
    ...program,
    startTime: program.start_time || program.startTime,
    endTime: program.end_time || program.endTime,
  };
}

export function mapVideo(video) {
  return {
    ...video,
    videoUrl: video.video_url || video.videoUrl,
  };
}

export function mapGalleryFolder(folder) {
  return {
    ...folder,
    coverImage: folder.cover_image || folder.coverImage,
    photoCount: folder.photo_count || folder.photoCount || 0,
  };
}

export function mapCommunity(community) {
  return {
    ...community,
  };
}

export function mapTestimonial(testimonial) {
  return {
    ...testimonial,
  };
}