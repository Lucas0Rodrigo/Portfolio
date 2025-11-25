/* ==========================================
   FUNÇÃO 1: JANELA MODAL (FOTOS)
   ========================================== */
function cliqueModal(img) {
    const janelaModal = document.getElementById('janelaModal');
    const imgModal = document.getElementById('imgModal');
    const txtModal = document.getElementById('txtModal');
    const btnFechar = document.getElementById('btnFechar');

    if(janelaModal) {
        janelaModal.classList.remove("escondeJanelaModal");
        janelaModal.classList.add("mostraJanelaModal");
        imgModal.src = img.src;
        imgModal.alt = img.alt;
        txtModal.innerHTML = img.alt;
        
        btnFechar.onclick = function() {
            janelaModal.classList.add("escondeJanelaModal");
            janelaModal.classList.remove("mostraJanelaModal");
        }
        janelaModal.onclick = function(e) {
            if(e.target === janelaModal) {
                janelaModal.classList.add("escondeJanelaModal");
                janelaModal.classList.remove("mostraJanelaModal");
            }
        }
    }
}

/* ==========================================
   FUNÇÃO AUXILIAR: PEGAR ID DO YOUTUBE
   ========================================== */
function extrairIDYoutube(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

/* ==========================================
   FUNÇÃO 2: AUTOMATIZAÇÃO GERAL (FOTOS E VÍDEOS)
   ========================================== */

const urlDados = 'conteudo.json';

async function carregarPortfolio() {
    try {
        const response = await fetch(urlDados);
        const dados = await response.json();
        
        // --- PARTE 1: FOTOS (img.html) ---
        const palcoFotos = document.getElementById('palco-portfolio');
        if (palcoFotos && dados.projetos) {
            palcoFotos.innerHTML = '';
            dados.projetos.forEach(projeto => {
                // Título
                const sectionTitulo = document.createElement('section');
                sectionTitulo.className = 'subbox';
                sectionTitulo.innerHTML = `<h2 class="subtitulo">${projeto.titulo}</h2>`;
                palcoFotos.appendChild(sectionTitulo);

                // Galeria
                const sectionGaleria = document.createElement('section');
                sectionGaleria.className = 'galeria';
                
                if (projeto.imagens) {
                    projeto.imagens.forEach(item => {
                        const article = document.createElement('article');
                        article.className = 'boximg ajusteimg';
                        
                        let caminhoImg = item.img;
                        if (!caminhoImg.startsWith('http') && !caminhoImg.startsWith('./') && !caminhoImg.startsWith('/')) {
                             caminhoImg = './' + caminhoImg;
                        }

                        article.innerHTML = `
                            <img src="${caminhoImg}" alt="${item.alt}" class="responsive-img" onclick="cliqueModal(this)">
                        `;
                        sectionGaleria.appendChild(article);
                    });
                }
                palcoFotos.appendChild(sectionGaleria);
            });
        }

        // --- PARTE 2: VÍDEOS (video.html) ---
        const palcoVideos = document.getElementById('palco-videos');
        if (palcoVideos && dados.projetos_videos) {
            palcoVideos.innerHTML = '';
            
            dados.projetos_videos.forEach(grupo => {
                // 1. Título do Grupo (Ex: Programação)
                if (grupo.titulo) {
                    const sectionTitulo = document.createElement('section');
                    sectionTitulo.className = 'box'; // Usei box aqui para destaque maior, igual seu html original
                    sectionTitulo.innerHTML = `<h2 class="titulo">${grupo.titulo}</h2>`;
                    palcoVideos.appendChild(sectionTitulo);
                }

                // 2. Renderiza os vídeos desse grupo
                if (grupo.videos) {
                    grupo.videos.forEach(video => {
                        const videoID = extrairIDYoutube(video.link);
                        
                        const sectionVideo = document.createElement('section');
                        sectionVideo.className = 'video';
                        
                        sectionVideo.innerHTML = `
                            <article>
                                <iframe 
                                    width="100%" 
                                    height="380" 
                                    src="https://www.youtube.com/embed/${videoID}" 
                                    title="${video.titulo_video}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowfullscreen
                                    style="border-radius: 10px; max-width: 600px; margin: 0 auto; display: block;"
                                ></iframe>
                                
                                <aside class="textodescri">
                                    <h2>${video.titulo_video}</h2>
                                    <p>
                                        <a href="${video.link}" target="_blank" style="text-decoration: underline; cursor: pointer;">
                                            ${video.descricao} 
                                            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8em; margin-left: 5px;"></i>
                                        </a>
                                    </p>
                                </aside>
                            </article>
                        `;
                        palcoVideos.appendChild(sectionVideo);
                    });
                }
            });
        }

    } catch (erro) {
        console.error("Erro ao carregar portfolio:", erro);
    }
}

window.addEventListener('load', carregarPortfolio);
