let chamados = []
let selecionado = null

const API = "https://cachoeira-resolve.onrender.com"

async function carregarChamados() {

    const resposta = await fetch(`${API}/chamados`)
    chamados = await resposta.json()

    let listaAbertos = document.getElementById("listaAbertos")
    let listaAndamento = document.getElementById("listaAndamento")
    let listaResolvidos = document.getElementById("listaResolvidos")

    listaAbertos.innerHTML = ""
    listaAndamento.innerHTML = ""
    listaResolvidos.innerHTML = ""

    chamados.forEach((c, i) => {

        let linha = `
        <tr onclick="verDetalhes(${i})">
            <td>${c.categoriaSelecionada}</td>
            <td>${c.local}</td>
            <td><span class="status ${c.status}">${c.status}</span></td>
            <td>Ver</td>
        </tr>
        `

        if (c.status === "Aberto") {
            listaAbertos.innerHTML += linha
        }

        if (c.status === "Andamento") {
            listaAndamento.innerHTML += linha
        }

        if (c.status === "Resolvido") {
            listaResolvidos.innerHTML += linha
        }

    })

    if (chamados.length === 0) {
        document.getElementById("detFoto").src = ""
        document.getElementById("detLocal").innerText = ""
        document.getElementById("detCategoria").innerText = ""
        document.getElementById("detDescricao").innerText = ""

        selecionado = null
    }

}

function verDetalhes(i) {

    selecionado = i

    let c = chamados[i]

    if (c.foto) {
        document.getElementById("detFoto").src = c.foto
        document.getElementById("detFoto").style.display = "block"
    } else {
        document.getElementById("detFoto").style.display = "none"
    }
    document.getElementById("detLocal").innerText = c.local
    document.getElementById("detCategoria").innerText = c.categoriaSelecionada
    document.getElementById("detDescricao").innerText = c.descricaoTexto

}

async function salvar() {

    await fetch(`${API}/salvar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(chamados)
    })

}

async function marcarAndamento() {

    if (selecionado === null) return

    chamados[selecionado].status = "Andamento"

    await salvar()

    carregarChamados()

}

async function marcarResolvido() {

    if (selecionado === null) return

    chamados[selecionado].status = "Resolvido"

    await salvar()

    carregarChamados()

}

async function rejeitar() {

    if (selecionado === null) return

    chamados.splice(selecionado, 1)

    await fetch("https://cachoeira-resolve.onrender.com/salvar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(chamados)
    })

    selecionado = null

    // LIMPA TELA
    document.getElementById("detFoto").src = ""
    document.getElementById("detLocal").innerText = ""
    document.getElementById("detCategoria").innerText = ""
    document.getElementById("detDescricao").innerText = ""

    carregarChamados()
}


window.onload = carregarChamados

window.addEventListener("load", () => {

    setTimeout(() => {

        let splash = document.getElementById("splash")

        splash.classList.add("hide") // fade

        setTimeout(() => {
            splash.style.display = "none"
        }, 800) // tempo da animação

    }, 3500) // tempo total na tela (3.5s)

})

document.querySelectorAll("button").forEach(btn => {

    btn.addEventListener("click", function (e) {

        let circle = document.createElement("span")
        circle.classList.add("ripple")

        let x = e.clientX - btn.offsetLeft
        let y = e.clientY - btn.offsetTop

        circle.style.left = x + "px"
        circle.style.top = y + "px"

        this.appendChild(circle)

        setTimeout(() => circle.remove(), 600)

    })

})

window.addEventListener("load", () => {

    let loading = document.getElementById("loadingScreen")

    setTimeout(() => {
        loading.classList.add("hide")
    }, 1500) // tempo fake (pode aumentar)

})