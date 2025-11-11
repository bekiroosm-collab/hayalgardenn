// Yıl güncelleme
document.getElementById('year').textContent = new Date().getFullYear();

// Mobil menü toggle
(function(){
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.main-nav');
  burger && burger.addEventListener('click', ()=> nav.classList.toggle('open'));
})();

// LocalStorage'dan admin tarafından eklenen blogları çek ve göster
const blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
const container = document.getElementById('blog-posts');


blogPosts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'post';
    article.innerHTML = `
      <h4>${post.title}</h4>
      <p class="muted">${post.date}</p>
      <p>${post.content}</p>
    `;
    container.appendChild(article);
});

