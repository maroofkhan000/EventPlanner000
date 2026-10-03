import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MAX_PHOTOS = 10;

const revokePreview = (p) => p.file && URL.revokeObjectURL(p.preview);

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

  // Uploads local files to `endpoint`, returns every photo URL in order
  const uploadAll = async (endpoint) => {
    const files = photos.filter((p) => p.file);
    let uploaded = [];
    if (files.length) {
      const data = new FormData();
      files.forEach((p) => data.append("images", p.file));
      const res = await axios.post(endpoint, data);
      uploaded = res.data.urls;
    }
    let next = 0;
    return photos.map((p) => (p.file ? uploaded[next++] : p.url));
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
