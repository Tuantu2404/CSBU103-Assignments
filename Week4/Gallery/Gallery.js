// Select elements
const addBtn = document.getElementById("addBtn");
const imgUrl = document.getElementById("imgUrl");
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

// Add image to gallery
addBtn.addEventListener("click", () => {
    const url = imgUrl.value.trim();
    if (!url) return;

    const img = document.createElement("img");
    img.src = url;

    // Click opens full screen preview
    img.addEventListener("click", () => {
        lightboxImg.src = url;
        lightbox.style.display = "flex";
    });

    gallery.appendChild(img);
    imgUrl.value = "";
});

// Close lightbox when clicking anywhere
lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
});
