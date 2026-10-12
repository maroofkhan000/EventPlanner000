import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MAX_PHOTOS = 10;

const revokePreview = (p) => p.file && URL.revokeObjectURL(p.preview);

const MAX_SIDE = 2000;
const SHRINK_OVER = 1024 * 1024;

// Re-encodes photos over 1 MB as JPEG at most 2000px wide or tall.
// GIFs and anything that fails to shrink are sent as they are.
const shrinkImage = (file) =>
  new Promise((resolve) => {
    if (file.size <= SHRINK_OVER || file.type === "image/gif") {
      resolve(file);
      return;
    }
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(src);
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const name = file.name.replace(/\.\w+$/, "") + ".jpg";
          resolve(new File([blob], name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      resolve(file);
    };
    img.src = src;
  });

// Photo list for the master account forms. Each photo is
// { id, file?, url?, preview }: file for uploads, url for pasted links.
// The first photo is the card cover.
export const usePhotos = () => {
  const [photos, setPhotos] = useState([]);

  // Free object URLs made for local file previews when leaving the page
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach(revokePreview), []);

  const addFiles = (files) => {
    const room = MAX_PHOTOS - photos.length;
    if (files.length > room) toast.warn(`You can add up to ${MAX_PHOTOS} photos`);
    const added = files.slice(0, room).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...added]);
  };

  const addUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      toast.error("Enter an image link starting with http:// or https://");
      return false;
    }
    if (photos.length >= MAX_PHOTOS) {
      toast.warn(`You can add up to ${MAX_PHOTOS} photos`);
      return false;
    }
    setPhotos((prev) => [...prev, { id: url + Date.now(), url, preview: url }]);
    return true;
  };

  const remove = (id) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) revokePreview(photo);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const makeCover = (id) => {
    setPhotos((prev) => {
      const pick = prev.find((p) => p.id === id);
      return [pick, ...prev.filter((p) => p.id !== id)];
    });
  };

  const reset = () => {
    photos.forEach(revokePreview);
    setPhotos([]);
  };

  // Uploads local files to `endpoint` one at a time (the hosted API takes
  // about 4.5 MB per request), returns every photo URL in order
  const uploadAll = async (endpoint) => {
    const urls = [];
    for (const p of photos) {
      if (!p.file) {
        urls.push(p.url);
        continue;
      }
      const data = new FormData();
      data.append("images", await shrinkImage(p.file));
      const res = await axios.post(endpoint, data);
      urls.push(res.data.urls[0]);
    }
    return urls;
  };

  return { photos, addFiles, addUrl, remove, makeCover, reset, uploadAll };
};

const PhotoPicker = ({ photoState, label = "Photo" }) => {
  const { photos, addFiles, addUrl, remove, makeCover } = photoState;
  const [imageUrl, setImageUrl] = useState("");

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    addFiles(files);
  };

  const onAddUrl = () => {
    if (addUrl(imageUrl.trim())) setImageUrl("");
  };

  return (
    <>
      <div className="photo-grid">
        {photos.map((p, i) => (
          <div key={p.id} className={`photo-tile ${i === 0 ? "is-cover" : ""}`}>
            <img src={p.preview} alt={`${label} ${i + 1}`} />
            {i === 0 && <span className="cover-tag">Cover</span>}
            <div className="photo-actions">
              {i !== 0 && (
                <button type="button" onClick={() => makeCover(p.id)}>
                  Make cover
                </button>
              )}
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => remove(p.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <label className="photo-drop">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>Upload photos</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={onFiles}
            />
          </label>
        )}
      </div>

      <div className="url-row">
        <input
          type="url"
          placeholder="…or paste an image link"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddUrl();
            }
          }}
        />
        <button type="button" className="clear-btn" onClick={onAddUrl}>
          Add link
        </button>
      </div>
    </>
  );
};

export default PhotoPicker;
