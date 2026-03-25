let usuarioNome = localStorage.getItem("usuarioNome")

window.onload = function () {

    if (usuarioNome) {
        document.getElementById("nomeUsuario").innerText = usuarioNome
    }

}


let foto = ""
let local = ""
let categoriaSelecionada = ""
let descricaoTexto = ""

function abrirFoto() {
    document.getElementById("fotoModal").style.display = "flex"
}

function abrirMapa() {
    document.getElementById("mapaModal").style.display = "flex"
    iniciarMapa()
}

function abrirCategoria() {
    document.getElementById("categoriaModal").style.display = "flex"
}

function abrirDescricao() {
    document.getElementById("descricaoModal").style.display = "flex"
}

function fechar() {
    document.querySelectorAll(".modal").forEach(m => {
        m.style.display = "none"
    })
}

document.getElementById("fotoInput").addEventListener("change", function () {

    let file = this.files[0]

    let reader = new FileReader()

    reader.onload = function () {
        foto = reader.result

        let img = document.getElementById("previewFoto")
        img.src = foto
        img.style.display = "block"
    }

    reader.readAsDataURL(file)

})


let mapa
let marcador

function iniciarMapa() {

    if (mapa) return

    mapa = L.map('mapa').setView([-22.355, -45.780], 16

    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(mapa)

    mapa.on("click", function (e) {

        let lat = e.latlng.lat
        let lng = e.latlng.lng

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {

                local = data.address.road || data.display_name

                document.getElementById("local").innerText = local
                document.getElementById("localTexto").innerText = local

            })
        if (marcador) mapa.removeLayer(marcador)

        marcador = L.marker([lat, lng]).addTo(mapa)

    })

}


function categoria(nome) {

    categoriaSelecionada = nome

    document.getElementById("categoriaTexto").innerText = nome

    fechar()

}


function salvarDescricao() {

    descricaoTexto = document.getElementById("descricao").value

    document.getElementById("descricaoTexto").innerText = descricaoTexto

    fechar()

}

async function enviarChamado() {
    let novoChamado = {
        usuario: usuarioNome,
        categoriaSelecionada: categoriaSelecionada,
        local: local,
        descricaoTexto: descricaoTexto,
        foto: foto,
        status: "Aberto"
    }

    try {

        const resposta = await fetch("https://cachoeira-resolve.onrender.com/chamados", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoChamado)
        })

        document.getElementById("popupSucesso").style.display = "flex"

        setTimeout(() => {
            document.getElementById("popupSucesso").style.display = "none"
        }, 2000)

        console.log(await resposta.text())

    } catch (erro) {

        console.error("Erro ao enviar:", erro)
        alert("Servidor não conectado")

    }

}

function mostrarNovo() {
    document.getElementById("areaNovo").style.display = "block"
    document.getElementById("areaMeus").style.display = "none"
}

function mostrarMeus() {
    document.getElementById("areaNovo").style.display = "none"
    document.getElementById("areaMeus").style.display = "block"
    carregarMeusChamados()
}

async function carregarMeusChamados() {

    const res = await fetch(`${API}/chamados`)
    const lista = await res.json()

    let div = document.getElementById("meusChamados")

    if (lista.length === 0) {
        div.innerHTML = "Nenhum chamado ainda"
        return
    }

    div.innerHTML = ""

    lista.forEach(c => {
        div.innerHTML += `
            <div class="card">
                <p><b>${c.categoriaSelecionada}</b></p>
                <p>${c.local}</p>
                <p>Status: ${c.status}</p>
            </div>
        `
    })

}