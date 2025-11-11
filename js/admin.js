document.addEventListener("DOMContentLoaded", () => {
  // --- MENÜ GEÇİŞLERİ ---
  const menuItems = document.querySelectorAll('.sidebar li[data-section]');
  const panels = document.querySelectorAll('.panel');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const section = item.getAttribute('data-section');
      panels.forEach(panel => panel.classList.remove('active'));
      document.getElementById(section).classList.add('active');
    });
  });

  // --- BLOG YAZILARI ---
  const postTitle = document.getElementById('postTitle');
  const postContent = document.getElementById('postContent');
  const addPostBtn = document.getElementById('addPostBtn');
  const postList = document.getElementById('postList');

  let posts = JSON.parse(localStorage.getItem('posts')) || [];

  function renderPosts() {
    postList.innerHTML = "";
    posts.forEach((post, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h4>${post.title}</h4>
        <p>${post.content}</p>
        <button data-index="${index}" class="deletePost">Sil</button>
      `;
      postList.appendChild(li);
    });
    document.getElementById('totalPosts').textContent = posts.length;
  }

  renderPosts();

  addPostBtn.addEventListener('click', () => {
    if (!postTitle.value || !postContent.value) {
      alert('Lütfen başlık ve içerik girin.');
      return;
    }
    posts.push({ title: postTitle.value, content: postContent.value });
    localStorage.setItem('posts', JSON.stringify(posts));
    postTitle.value = "";
    postContent.value = "";
    renderPosts();
  });

  postList.addEventListener('click', (e) => {
    if (e.target.classList.contains('deletePost')) {
      const index = e.target.getAttribute('data-index');
      posts.splice(index, 1);
      localStorage.setItem('posts', JSON.stringify(posts));
      renderPosts();
    }
  });

  // --- GALERİ (SUNUCUYA YÜKLEME) ---
  const uploadImage = document.getElementById('uploadImage');
  const imageCategory = document.getElementById('imageCategory');
  const galleryPreview = document.getElementById('galleryPreview');

  let gallery = []; // Sunucudan çekilecek veya admin eklerken push

  function renderGallery() {
    galleryPreview.innerHTML = "";
    gallery.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('gallery-item');
      div.innerHTML = `
        <img src="${item.src}" alt="gallery-${index}">
        <button class="deleteBtn" data-index="${index}">Sil</button>
      `;
      galleryPreview.appendChild(div);
    });
    document.getElementById('totalImages').textContent = gallery.length;
  }

  renderGallery();

  // Fotoğraf yükleme
  uploadImage.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('upload.php', { method: 'POST', body: formData });
      const data = await response.json();

      if (data.status === 'success') {
        gallery.push({ src: data.url, category: imageCategory.value });
        renderGallery();
        e.target.value = "";
      } else {
        alert('Yükleme başarısız!');
      }
    } catch (err) {
      alert('Sunucuya bağlanırken hata oluştu!');
      console.error(err);
    }
  });

  // Fotoğraf silme
  galleryPreview.addEventListener('click', (e) => {
    if (e.target.classList.contains('deleteBtn')) {
      const index = e.target.getAttribute('data-index');
      // Sunucudan silme için ekstra PHP endpoint gerekir
      gallery.splice(index, 1);
      renderGallery();
    }
  });

  // --- REZERVASYONLAR ---
  const reservationTable = document.getElementById('reservationTable');
  let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

  function renderReservations() {
    reservationTable.innerHTML = "";
    reservations.forEach((r) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.name}</td>
        <td>${r.date}</td>
        <td>${r.people}</td>
        <td>${r.status}</td>
        <td>
          <button class="approveBtn" data-id="${r.id}">Onayla</button>
          <button class="cancelBtn" data-id="${r.id}">İptal</button>
        </td>
      `;
      reservationTable.appendChild(tr);
    });
    document.getElementById('totalReservations').textContent = reservations.length;
  }

  renderReservations();

  reservationTable.addEventListener('click', (e) => {
    const id = Number(e.target.getAttribute('data-id'));
    if (e.target.classList.contains('approveBtn')) {
      reservations = reservations.map(r => r.id === id ? { ...r, status: 'Onaylandı' } : r);
      localStorage.setItem('reservations', JSON.stringify(reservations));
      renderReservations();
    }
    if (e.target.classList.contains('cancelBtn')) {
      reservations = reservations.map(r => r.id === id ? { ...r, status: 'İptal Edildi' } : r);
      localStorage.setItem('reservations', JSON.stringify(reservations));
      renderReservations();
    }
  });
});