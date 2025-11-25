/* ==========================================
   FUNÇÃO 1: JANELA MODAL
   ========================================== */
function cliqueModal(img) {
    const janelaModal = document.getElementById('janelaModal');
    const imgModal = document.getElementById('imgModal');
    const txtModal = document.getElementById('txtModal');
    const btnFechar = document.getElementById('btnFechar');

    janelaModal.classList.remove("escondeJanelaModal");
    janelaModal.classList.add("mostraJanelaModal");

    imgModal.src = img.src;
    imgModal.alt = img.alt;
    txtModal.innerHTML = img.alt;

    btnFechar.onclick = function() {
        janelaModal.classList.add("escondeJanelaModal");
        janelaModal.classList.remove("mostraJanelaModal");
    }
    
    // Fecha também se clicar fora da imagem (opcional, mas útil)
    janelaModal.onclick = function(e) {
        if(e.target === janelaModal) {
            janelaModal.classList.add("escondeJanelaModal");
            janelaModal.classList.remove("mostraJanelaModal");
        }
    }
}

/* ==========================================
   FUNÇÃO 2: AUTOMATIZAÇÃO DO PORTFÓLIO (Dinâmica)
   ========================================== */

const urlDados = 'conteudo.json';

async function carregarPortfolio() {
    try {
        const response = await fetch(urlDados);
        const dados = await response.json();
        
        // Procura onde desenhar o portfolio
        const palco = document.getElementById('palco-portfolio');

        // Se não tiver o palco nessa página (ex: página inicial), o script para aqui
        if (!palco) return;

        // Limpa o palco antes de começar
        palco.innerHTML = '';

        // Se existirem projetos cadastrados no JSON...
        if (dados.projetos) {
            dados.projetos.forEach(projeto => {
                
                // 1. Cria o Título da Seção (ex: "Viagem 2024")
                const sectionTitulo = document.createElement('section');
                sectionTitulo.className = 'subbox'; // Sua classe de estilo
                sectionTitulo.innerHTML = `<h2 class="subtitulo">${projeto.titulo}</h2>`;
                palco.appendChild(sectionTitulo);

                // 2. Cria o Container da Galeria
                const sectionGaleria = document.createElement('section');
                sectionGaleria.className = 'galeria'; // Sua classe de estilo
                
                // 3. Adiciona as imagens dentro da galeria
                if (projeto.imagens) {
                    projeto.imagens.forEach(item => {
                        const article = document.createElement('article');
                        article.className = 'boximg ajusteimg'; // Suas classes de card
                        
                        // Ajuste de caminho da imagem (segurança para o CMS)
                        let caminhoImg = item.img;
                        // Se o caminho não começar com http ou ./, adiciona ./ para garantir
                        if (!caminhoImg.startsWith('http') && !caminhoImg.startsWith('./') && !caminhoImg.startsWith('/')) {
                             caminhoImg = './' + caminhoImg;
                        }

                        article.innerHTML = `
                            <img 
                                src="${caminhoImg}" 
                                alt="${item.alt}" 
                                class="responsive-img" 
                                onclick="cliqueModal(this)"
                            >
                        `;
                        sectionGaleria.appendChild(article);
                    });
                }

                // Coloca a galeria preenchida no site
                palco.appendChild(sectionGaleria);
            });
        }

    } catch (erro) {
        console.error("Erro ao carregar portfolio:", erro);
    }
}

// Inicia o carregamento assim que a janela abre
window.addEventListener('load', carregarPortfolio);
