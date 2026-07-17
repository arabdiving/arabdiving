/* تضمين فيديو تعريفي من رابط — يوتيوب يتحول لـ embed، وأي رابط فيديو مباشر يُشغَّل كـ <video>. */

// يستخرج معرف يوتيوب من كل الصيغ الشائعة (watch?v=, youtu.be, shorts, embed)
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/
  );
  return m ? m[1] : null;
}

export function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url || "");
}

/* مكوّن العرض يبنيه كل صفحة بنفسها (iframe أو video أو رابط خارجي) حسب:
   const yt = youtubeId(url) → iframe src={`https://www.youtube.com/embed/${yt}`}
   isDirectVideo(url) → <video src controls />
   غير ذلك → رابط خارجي 🎬 */
