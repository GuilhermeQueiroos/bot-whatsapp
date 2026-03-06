const wppconnect = require('@wppconnect-team/wppconnect');
const XLSX = require('xlsx');
const { exec } = require("child_process");

let convidados = [];
let aguardandoNome = {};

function salvarExcel(){

const ws = XLSX.utils.json_to_sheet(convidados);
const wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb, ws, "Presenca");

XLSX.writeFile(wb, "lista_presenca.xlsx");

}

// abre whatsapp web
exec("start https://web.whatsapp.com");

wppconnect.create({
session:'aniversario-bot',
headless:false
})
.then((client)=>start(client))
.catch((error)=>console.log(error));


function start(client){

console.log("BOT ONLINE 🚀");


client.onMessage(async (message)=>{

if(message.isGroupMsg) return;

const numero = message.from;
const texto = message.body.toLowerCase();


// COMANDO PARA VER LISTA
if(texto === "/lista"){

let lista = convidados.map(c =>
`${c.nome} - ${c.resposta}`
).join("\n");

await client.sendText(numero,

`📋 Lista de presença

${lista}`);

return;

}


// LINK DO CONVITE
if(texto === "confirmar"){

aguardandoNome[numero] = true;

await client.sendText(numero,

`Oi! 🩷

Antes de confirmar presença me diga seu *nome*.`);

return;

}


// RECEBER NOME
if(aguardandoNome[numero] === true){

aguardandoNome[numero] = message.body;

await client.sendText(numero,

`Prazer ${message.body}! 🎉

Você confirma presença no aniversário?

Responda:

1 - SIM
2 - NÃO`);

return;

}


// CONFIRMOU
if(texto === "1" || texto === "sim"){

convidados.push({

nome: aguardandoNome[numero] || "Convidado",
numero: numero,
resposta:"CONFIRMADO",
data:new Date().toLocaleString()

});

salvarExcel();

await client.sendText(numero,

`🎉 Presença confirmada!

Vai ser muito bom ter você lá 🩷`);

}


// NÃO VAI
if(texto === "2" || texto === "não" || texto === "nao"){

convidados.push({

nome: aguardandoNome[numero] || "Convidado",
numero: numero,
resposta:"NÃO VAI",
data:new Date().toLocaleString()

});

salvarExcel();

await client.sendText(numero,

`Tudo bem! Obrigado por avisar 🩷`);

}

});

}