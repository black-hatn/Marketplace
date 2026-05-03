import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File): Promise<string> {
  // === PRODUCTION READY: CLOUDINARY INTEGRATION ===
  // Si les clés Cloudinary sont configurées, utiliser le Cloud
  if (process.env.CLOUDINARY_URL) {
    const cloudinary = require('cloudinary').v2;
    // cloudinary automatically picks up CLOUDINARY_URL from the environment
    
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
      
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "marketplace",
      });
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      // If Cloudinary fails, we could fallback, but in prod it's better to throw
      throw new Error("Erreur lors de l'upload de l'image");
    }
  }

  // === FALLBACK: STOCKAGE LOCAL (DÉVELOPPEMENT SEULEMENT) ===
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${uuidv4()}.${ext}`;
  const path = join(process.cwd(), 'public', 'uploads', filename);

  await writeFile(path, buffer);
  
  return `/uploads/${filename}`;
}
