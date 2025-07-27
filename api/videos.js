// api/videos.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Tentukan path ke file video_data.json
    // Pastikan ini benar sesuai lokasi video_data.json Anda
    // Jika video_data.json ada di dalam folder 'api' bersama videos.js:
    const filePath = path.join(__dirname, 'video_data.json');
    // Jika video_data.json ada di root proyek:
    // const filePath = path.join(process.cwd(), 'video_data.json');

    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Dapatkan parameter dari URL
    const { videoID, random } = req.query;

    let videosToReturn = [];

    if (videoID) {
      // Jika videoID diminta, cari video tersebut
      const selectedVideo = data.videos.find(v => v.id === videoID);
      if (selectedVideo) {
        videosToReturn.push(selectedVideo);
      } else {
        // Jika videoID tidak ditemukan, kembalikan 404
        return res.status(404).json({ error: 'Video not found' });
      }
    } else if (random === 'true') {
      // Jika random diminta (dan tidak ada videoID)
      if (data.videos && data.videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.videos.length);
        videosToReturn.push(data.videos[randomIndex]);
      } else {
        // Jika tidak ada video dalam daftar
        return res.status(500).json({ error: 'No videos available for random selection' });
      }
    } else {
      // Jika tidak ada videoID atau random=true, kembalikan array kosong
      // Atau Anda bisa kembalikan pesan error 400 jika Anda ingin permintaan spesifik
      // return res.status(400).json({ error: 'Missing videoID or random parameter' });
      videosToReturn = []; // Default: kembalikan kosong jika tidak ada parameter spesifik
    }

    // Kirim data sebagai respons JSON
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ videos: videosToReturn });

  } catch (error) {
    console.error('Error reading video data:', error);
    res.status(500).json({ error: 'Failed to load video data' });
  }
}