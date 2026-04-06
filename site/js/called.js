let usuarioNome = localStorage.getItem("usuarioNome") || "Usuário"

let foto = ""
let local = ""
let categoriaSelecionada = ""
let descricaoTexto = ""

window.onload = function () {

    document.getElementById("nomeUsuario").innerText = usuarioNome

    let input = document.getElementById("fotoInput")

    if (input) {
        input.addEventListener("change", function () {

            let file = this.files[0]

            if (!file) return

            let reader = new FileReader()

            reader.onload = function () {
                foto = reader.result
                let img = document.getElementById("previewFoto")
                img.src = foto
                img.style.display = "block"
            }

            reader.readAsDataURL(file)
        })
    }

}

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
    document.querySelectorAll(".modal").forEach(m => m.style.display = "none")
}

let mapa
let marcador

function iniciarMapa() {

    if (mapa) return

    mapa = L.map('mapa').setView([-22.355, -45.780], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(mapa)

    mapa.on("click", function (e) {

        let lat = e.latlng.lat
        let lng = e.latlng.lng

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(r => r.json())
            .then(data => {
                local = data.address.road || data.display_name
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
        categoriaSelecionada,
        local,
        descricaoTexto,
        foto,
        status: "Aberto"
    }

    try {

        await fetch("https://cachoeira-resolve.onrender.com/chamados", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoChamado)
        })

        let btn = document.querySelector("button")
        btn.innerText = "Enviando..."
        btn.disabled = true

        // popup
        document.getElementById("popupSucesso").style.display = "flex"

        setTimeout(() => {
            document.getElementById("popupSucesso").style.display = "none"
        }, 2000)

        btn.innerText = "Enviado ✔"

        setTimeout(() => {
            btn.innerText = "Enviar solicitação"
            btn.disabled = false
        }, 2000)

        // limpar dados
        categoriaSelecionada = ""
        local = ""
        descricaoTexto = ""
        foto = ""

        // limpar interface COMPLETA
        document.getElementById("categoriaTexto").innerText = "Nenhuma"
        document.getElementById("localTexto").innerText = "Nenhuma"
        document.getElementById("descricaoTexto").innerText = "Nenhuma"

        let img = document.getElementById("previewFoto")
        img.src = ""
        img.style.display = "none"

        document.getElementById("descricao").value = ""
        document.getElementById("fotoInput").value = ""

    } catch (erro) {
        alert("Erro ao enviar")
    }

}

function mostrarNovo() {

    let novo = document.getElementById("areaNovo")
    let meus = document.getElementById("areaMeus")

    meus.classList.add("fade")

    setTimeout(() => {
        meus.style.display = "none"
        novo.style.display = "block"

        novo.classList.add("show")

        setTimeout(() => {
            novo.classList.remove("show")
            meus.classList.remove("fade")
        }, 400)

    }, 300)
}

function mostrarMeus() {

    let novo = document.getElementById("areaNovo")
    let meus = document.getElementById("areaMeus")

    novo.classList.add("fade")

    setTimeout(() => {
        novo.style.display = "none"
        meus.style.display = "block"

        meus.classList.add("show")

        setTimeout(() => {
            meus.classList.remove("show")
            novo.classList.remove("fade")
        }, 400)

    }, 300)

    carregarMeusChamados()
}

async function carregarMeusChamados() {

    try {

        const res = await fetch("https://cachoeira-resolve.onrender.com/chamados")
        const lista = await res.json()

        let meus = lista.filter(c => c.usuario === usuarioNome)

        let div = document.getElementById("meusChamados")

        if (meus.length === 0) {
            div.innerHTML = "Nenhum chamado ainda"
            return
        }

        div.innerHTML = ""

        meus.forEach(c => {

            let cor = "white"

            if (c.status === "Aberto") cor = "orange"
            if (c.status === "Andamento") cor = "blue"
            if (c.status === "Resolvido") cor = "green"
            if (c.status === "Rejeitado") cor = "red"

            div.innerHTML += `
                <div class="card">
                    <p><b>${c.categoriaSelecionada}</b></p>
                    <p>${c.local}</p>
                    <p style="color:${cor}">Status: ${c.status}</p>
                </div>
            `
        })

    } catch (erro) {
        console.log("Erro ao carregar chamados")
    }

}

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("click", () => {

        // remove de todos
        document.querySelectorAll(".card").forEach(c => {
            c.classList.remove("ativo")
        })

        // adiciona no clicado
        card.classList.add("ativo")

    })

})

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        card.style.setProperty("--x", x + "px")
        card.style.setProperty("--y", y + "px")

    })

})

window.addEventListener("load", () => {

    let loading = document.getElementById("loadingScreen")

    setTimeout(() => {
        loading.classList.add("hide")
    }, 1500) // tempo fake (pode aumentar)

})