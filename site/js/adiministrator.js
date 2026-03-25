let chamados = []
let selecionado = null

const API = "https://cachoeira-resolve.onrender.com"

async function carregarChamados(){

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

        if(c.status === "Aberto"){
            listaAbertos.innerHTML += linha
        }

        if(c.status === "Andamento"){
            listaAndamento.innerHTML += linha
        }

        if(c.status === "Resolvido"){
            listaResolvidos.innerHTML += linha
        }

    })

}

function verDetalhes(i){

    selecionado = i

    let c = chamados[i]

    document.getElementById("detFoto").style.display = c.foto ? "block" : "none"
    document.getElementById("detLocal").innerText = c.local
    document.getElementById("detCategoria").innerText = c.categoriaSelecionada
    document.getElementById("detDescricao").innerText = c.descricaoTexto

}

async function salvar(){

    await fetch(`${API}/salvar`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(chamados)
    })

}

async function marcarAndamento(){

    if(selecionado === null) return

    chamados[selecionado].status = "Andamento"

    await salvar()

    carregarChamados()

}

async function marcarResolvido(){

    if(selecionado === null) return

    chamados[selecionado].status = "Resolvido"

    await salvar()

    carregarChamados()

}

async function rejeitar(){

    if(selecionado === null) return

    chamados.splice(selecionado, 1)

    await salvar()

    carregarChamados()

}

window.onload = carregarChamados