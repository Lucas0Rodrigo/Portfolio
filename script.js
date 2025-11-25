/* ==========================================
   FUNÇÃO 1: JANELA MODAL (FOTOS) - Não mudou nada
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
   FUNÇÃO AUXILIAR: PEGAR ID DO YOUTUBE - Não mudou nada
   ========================================== */
function extrairIDYoutube(url) {
    if(!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

/* ==========================================
   FUNÇÃO 2: AUTOMATIZAÇÃO CORRIGIDA (LÊ 2 ARQUIVOS)
   ========================================== */

async function carregarTudo() {
    
    // --- PARTE A: CARREGAR FOTOS (Lê fotos.json) ---
    const palcoFotos = document.getElementById('palco-portfolio');
    
    // Só tenta carregar se o palco existir na página
    if (palcoFotos) {
        try {
            const resFotos = await fetch('fotos.json'); // <--- MUDANÇA AQUI
            if(resFotos.ok) {
                const dadosFotos = await resFotos.json();
                
                if(dadosFotos.projetos) {
                    palcoFotos.innerHTML = '';
                    dadosFotos.projetos.forEach(projeto => {
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
            } else {
                console.log("Arquivo fotos.json não encontrado ou vazio.");
            }
        } catch (erro) {
            console.error("Erro ao carregar fotos:", erro);
        }
    }

    // --- PARTE B: CARREGAR VÍDEOS (Lê videos.json) ---
    const palcoVideos = document.getElementById('palco-videos');
    
    // Só tenta carregar se o palco de vídeos existir na página
    if (palcoVideos) {
        try {
            const resVideos = await fetch('videos.json'); // <--- MUDANÇA AQUI
            if(resVideos.ok) {
                const dadosVideos = await resVideos.json();
                
                if(dadosVideos.projetos_videos) {
                    palcoVideos.innerHTML = '';
                    dadosVideos.projetos_videos.forEach(grupo => {
                        if (grupo.titulo) {
                            const sectionTitulo = document.createElement('section');
                            sectionTitulo.className = 'box';
                            sectionTitulo.innerHTML = `<h2 class="titulo">${grupo.titulo}</h2>`;
                            palcoVideos.appendChild(sectionTitulo);
                        }

                        if (grupo.videos) {
                            grupo.videos.forEach(video => {
                                const videoID = extrairIDYoutube(video.link);
                                const sectionVideo = document.createElement('section');
                                sectionVideo.className = 'video';
                                
                                sectionVideo.innerHTML = `
                                    <article>
                                        <iframe 
                                            width="100%" height="380" 
                                            src="https://www.youtube.com/embed/${videoID}" 
                                            title="${video.titulo_video}" 
                                            frameborder="0" allowfullscreen
                                            style="border-radius: 10px; max-width: 600px; margin: 0 auto; display: block;"
                                        ></iframe>
                                        <aside class="textodescri">
                                            <h2>${video.titulo_video}</h2>
                                            <p>
                                                <a href="${video.link}" target="_blank">
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
            } else {
                console.log("Arquivo videos.json não encontrado ou vazio.");
            }
        } catch (erro) {
            console.error("Erro ao carregar vídeos:", erro);
        }
    }
}

window.addEventListener('load', carregarTudo);
