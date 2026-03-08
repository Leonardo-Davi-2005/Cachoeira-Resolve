function fechar(){

document.querySelectorAll(".modal").forEach(m => m.style.display="none")

}


function abrirFoto(){
document.getElementById("fotoModal").style.display="flex"
}


function abrirMapa(){
document.getElementById("mapaModal").style.display="flex"
}


function abrirCategoria(){
document.getElementById("categoriaModal").style.display="flex"
}


function abrirDescricao(){
document.getElementById("descricaoModal").style.display="flex"
}



function categoria(nome){

alert("Categoria escolhida: "+nome)

fechar()

}


function salvarDescricao(){

let texto = document.getElementById("descricao").value

alert("Descrição salva: "+texto)

fechar()

}

let foto = false

document.getElementById("fotoInput").addEventListener("change", function(){

const file = this.files[0]

if(file){

foto = true

const reader = new FileReader()

reader.onload = function(e){

let img = document.getElementById("previewFoto")

img.src = e.target.result
img.style.display = "block"

}

reader.readAsDataURL(file)

}

})


// GPS
let mapa
let marcador
let localizacao = false

function abrirMapa(){

document.getElementById("mapaModal").style.display="flex"

setTimeout(iniciarMapa,200)

}

function iniciarMapa(){

if(mapa) return

// centro de Cachoeira de Minas
const centro = [-22.3557, -45.5663]

mapa = L.map('mapa').setView([-22.355, -45.780], 16)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19
}).addTo(mapa)

mapa.on('click', async function(e){

let lat = e.latlng.lat
let lon = e.latlng.lng

if(marcador){
mapa.removeLayer(marcador)
}

marcador = L.marker([lat,lon]).addTo(mapa)

localizacao = true

let url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`

let resposta = await fetch(url)
let dados = await resposta.json()

let rua =
dados.address.road ||
dados.address.residential ||
dados.address.suburb ||
dados.address.city ||
"Local selecionado"

document.getElementById("localTexto").innerText = rua

})

}




// CATEGORIA
let categoriaSelecionada = ""

function categoria(nome){

categoriaSelecionada = nome

document.getElementById("categoriaTexto").innerText = nome

fechar()

}



// DESCRIÇÃO
let descricaoTexto = ""

function salvarDescricao(){

descricaoTexto = document.getElementById("descricao").value

document.getElementById("descricaoTexto").innerText = descricaoTexto

fechar()

}



// ENVIAR
function enviarSolicitacao(){

if(!foto){
alert("Adicione uma foto")
return
}

if(!localizacao){
alert("Selecione a localização")
return
}

if(categoriaSelecionada == ""){
alert("Escolha uma categoria")
return
}

if(descricaoTexto == ""){
alert("Adicione uma descrição")
return
}

// RESETAR VARIÁVEIS
foto = false
localizacao = false
categoriaSelecionada = ""
descricaoTexto = ""

// LIMPAR FOTO
document.getElementById("previewFoto").src = ""
document.getElementById("previewFoto").style.display = "none"
document.getElementById("fotoInput").value = ""

// LIMPAR LOCALIZAÇÃO
document.getElementById("localTexto").innerText = "Nenhuma"

if(marcador){
mapa.removeLayer(marcador)
marcador = null
}

// LIMPAR CATEGORIA
document.getElementById("categoriaTexto").innerText = "Nenhuma"

// LIMPAR DESCRIÇÃO
document.getElementById("descricaoTexto").innerText = "Nenhuma"
document.getElementById("descricao").value = ""

}