import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyATwhZXqSm_UIDQC3n8dldUlPq4fbAeQGs",

  authDomain: "atividade-avaliativa-ii.firebaseapp.com",

  databaseURL: "https://atividade-avaliativa-ii-default-rtdb.firebaseio.com",

  projectId: "atividade-avaliativa-ii",

  storageBucket: "atividade-avaliativa-ii.appspot.com",

  messagingSenderId: "193502624389",

  appId: "1:193502624389:web:b729a2620dbc09134cc7ec",

  measurementId: "G-5WSBZGRT8P",
};

const app = initializeApp(firebaseConfig);

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

import {
  getDatabase,
  ref as dRef,
  onValue,
  set,
  push,
  remove,
  update,
  query,
  orderByChild,
  orderByValue,
  equalTo,
  limitToFirst,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
  getStorage,
  ref as sRef,
  getDownloadURL,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getDatabase(app);

const storage = getStorage(app);

let usuario;

const btnSairProdutoEditar = document.getElementById("btnEditarSairProduto");
const btnAuthUsuarioSenha = document.getElementById("btnAuthUsuarioSenha");
const btnCancelarCadastro = document.getElementById("btnCancelarCadastro");
const btnTelaCriarProduto = document.getElementById("btnTelaCriarProduto");
const btnAbrirFaleConosco = document.getElementById("btnAbrirFaleConosco");
const btnSairReclamacao = document.getElementById("btnSairReclamacao");
const btnCarrinhoAbrir = document.getElementById("btnCarrinhoAbrir");
const btnEditarProduto = document.getElementById("btnEditarProduto");
const btnCriarProduto = document.getElementById("btnCriarProduto");
const btnSairCarrinho = document.getElementById("btnSairCarrinho");
const btnSairProduto = document.getElementById("btnSairProduto");
const btnVoltarBusca = document.getElementById("btnVoltarBusca");
const btnReclamacao = document.getElementById("btnReclamacao");
const btnAuthGoogle = document.getElementById("btnAuthGoogle");
const btnPesquisar = document.getElementById("btnPesquisar");
const btnCadastro = document.getElementById("btnCadastro");

const editarProdutoPopup = document.getElementById("editarProdutoPopup");
const fotoProdutoEditar = document
  .getElementsByClassName("editarFotoProduto")
  .item(0);
const criarProdutoPopup = document.getElementById("criarProdutoPopup");
const linkCriarConta = document.getElementById("linkCriarConta");
const fotoProdutoCriar = document.getElementById("fotoProduto");
const cadastroPopup = document.getElementById("cadastro-popup");
const localProdutos = document.getElementById("localProdutos");
const telaCarrinho = document.getElementById("telaCarrinho");
const faleConosco = document.getElementById("faleConosco");
const loginPopup = document.getElementById("login-popup");
const linkLogin = document.getElementById("linkLogin");

let cadastroEmail = false;
let itemId;

//-----------------EVENTOS--------------------//

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    usuario = auth.currentUser;

    if (cadastroEmail == true) {
      adicionarUsuarioBd(usuario.uid);
    }

    ativarTelaCasoUsuarioLogado();

    carregarCarrinho();
    criarProduto();
    telaDefinidaPorTipoDeUsuario();
  } else {
    esconderTelaCasoUsuarioDeslogado();
  }
});

btnAuthUsuarioSenha.addEventListener("click", function () {
  let email = document.getElementById("emailLogin");
  let senha = document.getElementById("senhaLogin");
  try {
    if (email.value.length == 0 && senha.value.length == 0) {
      throw new Error("Email ou senha não podem estar vazios");
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, senha.value)
      .then(function (result) {
        console.log(result);
        alert("Autenticado " + email.value);
      })
      .catch(function (error) {
        console.error(error.code);
        console.error(error.message);
        alert(error.message);
      });
  } catch (error) {
    console.error(error.code);
    console.error(error.message);
    alert(error.message);
  }
});

btnAuthGoogle.addEventListener("click", function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      console.log(result);
      var token = result.credential.accessToken;
      alert("Bem vindo, " + result.user.displayName);
    })
    .catch(function (error) {
      console.log(error);
      alert("Falha na autenticação");
    });
});

btnLogOut.addEventListener("click", function () {
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        alert("Você se deslogou");
      },
      function (error) {
        console.error(error);
      }
    );
});

btnCadastro.addEventListener("click", function () {
  const email = document.getElementById("emailCadastro");
  const senha = document.getElementById("senhaCadastro");
  try {
    if (email.value.length == 0 && senha.value.length == 0) {
      throw new Error("Email ou senha não podem estar vazios");
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, senha.value)
      .then(function () {
        alert("Cadastro feito " + email.value);
        cadastroPopup.style.display = "none";
        loginPopup.style.diplay = "block";
        cadastroEmail = true;
      })
      .catch(function (error) {
        console.error(error.code);
        console.error(error.message);
        alert(error.message);
      });
  } catch (error) {
    console.error(error.code);
    console.error(error.message);
    alert(error.message);
  }
});

linkCriarConta.addEventListener("click", function () {
  loginPopup.style.display = "none";
  cadastroPopup.style.display = "block";
});

linkLogin.addEventListener("click", function () {
  cadastroPopup.style.display = "none";
  loginPopup.style.display = "block";
});

btnCancelarCadastro.addEventListener("click", function () {
  cadastroPopup.style.display = "none";
  loginPopup.style.display = "block";
});

btnTelaCriarProduto.addEventListener("click", function () {
  criarProdutoPopup.style.display = "block";
});

btnSairProduto.addEventListener("click", function () {
  sairProdutoCriar();
});

btnSairProdutoEditar.addEventListener("click", function () {
  sairProdutoEditar();
});

btnCriarProduto.addEventListener("click", function () {
  adicionarItem();
});

btnEditarProduto.addEventListener("click", function () {
  editarItem();
});

btnCarrinhoAbrir.addEventListener("click", function () {
  telaCarrinho.style.display = "block";
});

btnSairCarrinho.addEventListener("click", function () {
  telaCarrinho.style.display = "none";
});

btnReclamacao.addEventListener("click", function () {
  carregarReclamacao();
});

btnAbrirFaleConosco.addEventListener("click", function () {
  faleConosco.style.display = "block";
});

btnSairReclamacao.addEventListener("click", function () {
  sairReclamacao();
});

btnPesquisar.addEventListener("click", function () {
  criarProduto(true);
});

btnVoltarBusca.addEventListener("click", function () {
  console.log("teste");
  criarProduto(false);
});

fotoProdutoCriar.addEventListener("change", function (event) {
  chooseFile(event);
});

fotoProdutoEditar.addEventListener("change", function (event) {
  chooseFileEditar(event);
});

document
  .getElementById("head")
  .addEventListener("load", initializeApp(firebaseConfig));

//-----------------FUNÇÕES--------------------//

function criarProduto(pesquisa = false) {
  let produtosRef;
  let queryT;
  if (pesquisa == false) {
    produtosRef = dRef(db, "principal/0/produtos");
    queryT = query(produtosRef, orderByValue());
  } else {
    const buscaValor = document.getElementById("txtBusca").value;

    if (buscaValor.length > 0) {
      console.log(buscaValor);
      produtosRef = dRef(db, "principal/0/produtos/");
      queryT = query(produtosRef, orderByChild("nome"), equalTo(buscaValor));
      console.log(produtosRef);
    }
  }
  let id, nome, preco, foto, promocao, descricao;

  reiniciarProdutos();
  onValue(queryT, (snapshot) => {
    snapshot.forEach((produto) => {
      id = produto.key;
      foto = produto.child("foto").val();
      nome = produto.child("nome").val();
      preco = produto.child("preco").val();
      promocao = produto.child("promocao").val();
      descricao = produto.child("descricao").val();

      console.log(id, nome, preco, foto, promocao, descricao);

      //-----------------VAR-------------------//
      const footerTextCenterDiv = document.createElement("div");
      const footerCartaoDiv = document.createElement("div");
      const textCenterDiv = document.createElement("div");
      const cardBodyDiv = document.createElement("div");
      const badgeDiv = document.createElement("div");
      const cardDiv = document.createElement("div");
      const colDiv = document.createElement("div");

      const pathExcluir = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const svgExcluir = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      const svgEditar = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      const adicionarCarrinhoLink = document.createElement("a");
      const btnExcluir = document.createElement("a");
      const btnEditar = document.createElement("a");

      const nomeProdutoH5 = document.createElement("h5");
      const descricaoProduto = document.createElement("h7");

      const precoProduto = document.createTextNode("R$" + preco.toFixed(2));

      let fotoProdutoUrl;
      const img = document.createElement("img");

      //--------------CÓDIGO--------------//

      colDiv.classList.add("col", "mb-5");
      colDiv.setAttribute("id", id);

      cardDiv.classList.add("card", "h-100");

      if (promocao) {
        badgeDiv.classList.add(
          "badge",
          "bg-dark",
          "text-white",
          "position-absolute",
          "promocao"
        );
        badgeDiv.style.top = "0.5rem";
        badgeDiv.style.right = "0.5rem";
        badgeDiv.textContent = "Promoção";
      }

      btnEditar.classList.add(
        "btn",
        "btn-outline-dark",
        "mt-auto",
        "position-absolute",
        "btnEditar",
        "hidden"
      );
      btnEditar.setAttribute("id", id);
      btnEditar.style.top = "0.5rem";
      btnEditar.style.left = "0.5rem";

      svgEditar.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgEditar.setAttribute("width", "16");
      svgEditar.setAttribute("height", "16");
      svgEditar.setAttribute("fill", "currentColor");
      svgEditar.setAttribute("class", "bi bi-pencil");
      svgEditar.setAttribute("viewBox", "0 0 16 16");

      path.setAttribute(
        "d",
        "M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
      );

      svgEditar.appendChild(path);

      btnEditar.appendChild(svgEditar);

      btnExcluir.classList.add(
        "btn",
        "btn-outline-dark",
        "mt-auto",
        "position-absolute",
        "btnExcluir",
        "hidden"
      );
      btnExcluir.setAttribute("id", id);
      btnExcluir.style.top = "0.5rem";
      btnExcluir.style.left = "3.4rem";

      svgExcluir.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgExcluir.setAttribute("width", "16");
      svgExcluir.setAttribute("height", "16");
      svgExcluir.setAttribute("fill", "currentColor");
      svgExcluir.setAttribute("class", "bi bi-trash3");
      svgExcluir.setAttribute("viewBox", "0 0 16 16");

      pathExcluir.setAttribute(
        "d",
        "M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
      );
      svgExcluir.appendChild(pathExcluir);

      btnExcluir.appendChild(svgExcluir);

      if (foto.length > 0) {
        getDownloadURL(sRef(storage, "/img/" + foto)).then((imgUrl) => {
          fotoProdutoUrl = imgUrl;

          img.classList.add("card-img-top");
          img.src = fotoProdutoUrl;
          img.alt = "...";
        });
      } else {
        fotoProdutoUrl = "https://dummyimage.com/450x300/dee2e6/6c757d.jpg";
        img.classList.add("card-img-top");
        img.src = fotoProdutoUrl;
        img.alt = "...";
      }

      cardBodyDiv.classList.add("card-body", "p-4");

      textCenterDiv.classList.add("text-center");

      nomeProdutoH5.classList.add("fw-bolder");
      nomeProdutoH5.textContent = nome;

      textCenterDiv.appendChild(nomeProdutoH5);
      textCenterDiv.appendChild(document.createElement("br"));
      textCenterDiv.appendChild(precoProduto);

      descricaoProduto.textContent = descricao;
      descricaoProduto.classList.add("descricao-produto");
      textCenterDiv.appendChild(descricaoProduto);

      footerCartaoDiv.classList.add(
        "card-footer",
        "p-4",
        "pt-0",
        "border-top-0",
        "bg-transparent"
      );

      footerTextCenterDiv.classList.add("text-center");

      adicionarCarrinhoLink.classList.add(
        "btn",
        "btn-outline-dark",
        "mt-auto",
        "btn-carrinho"
      );
      adicionarCarrinhoLink.textContent = "Adicionar ao carrinho";
      adicionarCarrinhoLink.setAttribute("id", id);

      footerTextCenterDiv.appendChild(adicionarCarrinhoLink);
      footerCartaoDiv.appendChild(footerTextCenterDiv);

      textCenterDiv.appendChild(nomeProdutoH5);
      textCenterDiv.appendChild(precoProduto);

      cardBodyDiv.appendChild(textCenterDiv);

      if (promocao) {
        cardDiv.appendChild(badgeDiv);
      }
      cardDiv.appendChild(img);
      cardDiv.appendChild(cardBodyDiv);
      cardDiv.appendChild(btnEditar);
      cardDiv.appendChild(btnExcluir);
      cardDiv.appendChild(footerCartaoDiv);

      colDiv.appendChild(cardDiv);

      document.getElementById("localProdutos").appendChild(colDiv);

      adicionarCarrinhoLink.addEventListener("click", function () {
        adicionarCarrinho(this.id);
      });

      btnEditar.addEventListener("click", function () {
        itemId = this.id;
        editarItemTela(this.id);
      });

      btnExcluir.addEventListener("click", function () {
        excluirItem(this.id);
      });
    });
  });
  telaDefinidaPorTipoDeUsuario();
}

function sairProdutoCriar() {
  const nome = document.getElementById("nomeProduto");
  const preco = document.getElementById("precoProduto");
  const descricao = document.getElementById("descricaoProduto");
  const radioButton = document.querySelectorAll(".radio");

  nome.value = " ";
  nome.innerHTML = " ";

  preco.value = " ";
  preco.innerHTML = " ";

  descricao.value = " ";
  descricao.innerHTML = " ";

  radioButton.forEach((element) => {
    element.checked = false;
  });

  criarProdutoPopup.style.display = "none";
}

function sairProdutoEditar() {
  const descricao = document.getElementById("editarDescricaoProduto");
  const radioButton = document.querySelectorAll(".radioEditar");
  const preco = document.getElementById("editarPrecoProduto");
  const nome = document.getElementById("editarNomeProduto");

  nome.value = " ";
  nome.innerHTML = " ";

  preco.value = " ";
  preco.innerHTML = " ";

  descricao.value = " ";
  descricao.innerHTML = " ";

  radioButton.forEach((element) => {
    element.checked = false;
  });

  editarProdutoPopup.style.display = "none";
}

function sairReclamacao() {
  const email = document.getElementById("email");
  const radioButton = document.querySelectorAll(".radioProblema");
  const reclamacao = document.getElementById("reclamacao");

  email.value = " ";
  email.innerHTML = " ";

  reclamacao.value = " ";
  reclamacao.innerHTML = " ";

  radioButton.forEach((element) => {
    element.checked = false;
  });

  faleConosco.style.display = "none";
}

function adicionarCarrinho(id) {
  const carrinhoRef = dRef(
    db,
    "principal/2/carrinho/" + usuario.uid + "/" + id + "/"
  );

  const item = {
    quantidade: 1,
    id: id,
  };

  set(carrinhoRef, item).then(
    alert("Item adicionado ao carrinho com sucesso"),
    carregarCarrinho()
  );
}

function adicionarUsuarioBd(uid) {
  if (usuario != null) {
    const usuarioRef = dRef(db, "principal/1/usuarios/" + uid);
    const carrinhoRef = dRef(db, "principal/2/carrinho/" + uid);

    const usuarios = {
      userType: "comum",
    };
    const carrinho = {
      itemId: [],
    };
    set(usuarioRef, usuarios);
    set(carrinhoRef, carrinho);
  }
}

function excluirItem(id) {
  if (confirm("Você tem certeza?")) {
    const produtosRef = dRef(db, "principal/0/produtos/" + id);
    const carrinhoRef = dRef(db, "principal/2/");
    const usuariosRef = dRef(db, "principal/1/usuarios/");

    onValue(usuariosRef, (snapshot) => {
      snapshot.forEach((usuarioCarrinho) => {
        const pathUsuario = usuarioCarrinho.ref._path.toString();
        const usuarioCarrinhoUid = pathUsuario.substring(
          pathUsuario.lastIndexOf("/") + 1
        );

        console.log("usuarioCarrinhoUid: ", usuarioCarrinhoUid);
        const itemRef = dRef(
          db,
          "principal/2/carrinho/" + usuarioCarrinhoUid + "/" + id
        );
        remove(itemRef).then(console.log("Apagado"));
      });
    });

    remove(produtosRef).then(function () {
      alert("Produto excluido com sucesso");
      criarProduto();
      carregarCarrinho();
    });
  }
}

let fileEditar = {};
function chooseFileEditar(e) {
  fileEditar = e.target.files[0];
}
function editarItem() {
  try {
    const nome = document.getElementById("editarNomeProduto").value.trim();
    const preco = document.getElementById("editarPrecoProduto").value.trim();
    const descricao = document
      .getElementById("editarDescricaoProduto")
      .value.trim();
    const foto = document
      .getElementsByClassName("editarFotoProduto")
      .item(0).value;
    const promocao = document.getElementById("editarPromocaoSim");

    if (
      nome.length &&
      descricao.length > 0 &&
      typeof nome &&
      typeof descricao == "string" &&
      preco != null &&
      parseFloat(preco) >= 1
    ) {
      let item = {};

      if (fileEditar != null) {
        const nomeFoto = foto.substring(foto.lastIndexOf("\\" || "/") + 1);
        const imagemRef = sRef(storage, "/img/" + nomeFoto);
        uploadBytes(imagemRef, fileEditar).then(function () {
          console.log("sucesso");
        });
        fileEditar = {};

        item = {
          nome: nome,
          preco: parseFloat(preco),
          descricao: descricao,
          foto: nomeFoto,
          promocao: promocao.checked,
        };
        console.log("\n\n\nflçjasçlasjasçlkj");
      } else {
        item = {
          nome: nome,
          preco: parseFloat(preco),
          descricao: descricao,
          promocao: promocao.checked,
        };
      }
      const produtoRef = dRef(db, "principal/0/produtos/" + itemId);

      update(produtoRef, item).then(() => {
        alert("Produto editado com sucesso");
        sairProdutoEditar();
        criarProduto();
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function editarItemTela(id) {
  const nomeCampo = document.getElementById("editarNomeProduto");
  const precoCampo = document.getElementById("editarPrecoProduto");
  const descricaoCampo = document.getElementById("editarDescricaoProduto");
  const fotoCampo = document
    .getElementsByClassName("editarFotoProduto")
    .item(0);
  const promocaoCampoSim = document.getElementById("editarPromocaoSim");
  const promocaoCampoNao = document.getElementById("editarPromocaoNao");

  const usuarioRef = dRef(db, "principal/0/produtos/" + id);
  onValue(usuarioRef, (snapshot) => {
    const nome = snapshot.child("nome").val();
    const preco = snapshot.child("preco").val();
    const descricao = snapshot.child("descricao").val();
    const foto = snapshot.child("foto").val();
    const promocao = snapshot.child("promocao").val();

    nomeCampo.value = nome;
    precoCampo.value = preco;
    descricaoCampo.value = descricao;
    fotoCampo.setAttribute("id", foto);
    if (promocao == true) {
      promocaoCampoSim.checked = true;
    } else {
      promocaoCampoNao.checked = true;
    }

    editarProdutoPopup.style.display = "block";
  });
}

let file = {};
function chooseFile(e) {
  file = e.target.files[0];
}
function adicionarItem() {
  try {
    const nome = document.getElementById("nomeProduto").value.trim();
    const preco = document.getElementById("precoProduto").value.trim();
    const descricao = document.getElementById("descricaoProduto").value.trim();
    const foto = document.getElementById("fotoProduto").value;
    const promocao = document.getElementById("sim");

    if (
      nome.length &&
      descricao.length > 0 &&
      typeof nome &&
      typeof descricao == "string" &&
      preco != null &&
      parseFloat(preco) >= 1 &&
      file != null
    ) {
      const nomeFoto = foto.substring(foto.lastIndexOf("\\" || "/") + 1);

      const imagemRef = sRef(storage, "/img/" + nomeFoto);
      uploadBytes(imagemRef, file).then(function () {
        console.log("sucesso");
      });
      file = {};

      const produtoRef = dRef(db, "principal/0/produtos/");

      const item = {
        nome: nome,
        preco: parseFloat(preco),
        descricao: descricao,
        foto: nomeFoto,
        promocao: promocao.checked,
      };

      push(produtoRef, item).then(() => {
        alert("Produto criado com sucesso");
        criarProduto();
      });

      sairProdutoCriar();
    } else {
      alert(
        "Algum dos campos está com o tipo de dado errado ou vazio, cheque e tente novamente"
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function telaDefinidaPorTipoDeUsuario() {
  const usuarioRef = dRef(
    db,
    "principal/1/usuarios/" + usuario.uid + "/userType"
  );
  onValue(usuarioRef, (snapshot) => {
    const userType = snapshot.val();
    if (userType == "Administrador") {
      console.log("admin");
      const elementos = document.querySelectorAll(".hidden");
      elementos.forEach((elemento) => {
        elemento.style.display = "block";
      });
    } else {
      const elementos = document.querySelectorAll(".hidden");
      elementos.forEach((elemento) => {
        elemento.style.display = "none";
      });
    }
  });
}

function esconderTelaCasoUsuarioDeslogado() {
  const nav = document.getElementById("nav");
  const main = document.getElementById("main");
  const footer = document.getElementById("footer");
  console.log("Não logado");
  loginPopup.style.display = "block";
  nav.style.display = "none";
  main.style.display = "none";
  footer.style.display = "none";
}

function ativarTelaCasoUsuarioLogado() {
  console.log("logado");
  loginPopup.style.display = "none";
  nav.style.display = "block";
  main.style.display = "block";
  footer.style.display = "block";
  sairProdutoCriar();
  sairProdutoEditar();
}

function carregarCarrinho() {
  const carrinhoRef = dRef(db, "principal/2/carrinho/" + usuario.uid + "/");
  reiniciarCarrinho();
  onValue(carrinhoRef, (snapshot) => {
    snapshot.forEach((item) => {
      console.log(item.child("id").val());
      const produtosRef = dRef(
        db,
        "principal/0/produtos/" + item.child("id").val()
      );

      let id, nome, preco, foto, promocao, descricao;

      onValue(produtosRef, (produto) => {
        id = produto.key;
        foto = produto.child("foto").val();
        nome = produto.child("nome").val();
        preco = produto.child("preco").val();
        promocao = produto.child("promocao").val();
        descricao = produto.child("descricao").val();

        const containerCarrinho = document.getElementById("containerCarrinho");

        let decrementBtn = document.createElement("div");
        let incrementBtn = document.createElement("div");
        let cartItem = document.createElement("div");
        let imageBox = document.createElement("div");
        let counter = document.createElement("div");
        let prices = document.createElement("div");
        let amount = document.createElement("div");
        let remove = document.createElement("div");
        let count = document.createElement("div");
        let about = document.createElement("div");
        let save = document.createElement("div");

        let vegImage = document.createElement("img");
        let imagem = document.createElement("img");

        let title = document.createElement("h1");

        containerCarrinho.className = "container-carrinho";

        cartItem.className = "Cart-Items";

        imageBox.className = "image-box";
        imageBox.appendChild(imagem);

        about.className = "about";
        title.className = "title";
        title.innerText = nome;
        about.appendChild(title);
        about.appendChild(vegImage);

        counter.className = "counter";
        incrementBtn.className = "btn";
        incrementBtn.innerText = "+";
        count.className = "count";
        count.innerText = "1";
        decrementBtn.className = "btn";
        decrementBtn.innerText = "-";
        counter.appendChild(incrementBtn);
        counter.appendChild(count);
        counter.appendChild(decrementBtn);

        prices.className = "prices";
        amount.className = "amount";
        amount.innerText = "R$" + preco.toFixed(2);
        save.className = "save";
        save.innerHTML = "<u>Salvar</u>";
        remove.className = "remove";
        remove.innerHTML = "<u>Remover</u>";
        prices.appendChild(amount);
        prices.appendChild(save);
        prices.appendChild(remove);

        cartItem.appendChild(imageBox);
        cartItem.appendChild(about);
        cartItem.appendChild(counter);
        cartItem.appendChild(prices);

        containerCarrinho.appendChild(cartItem);
      });
    });
  });
}

function carregarReclamacao() {
  try {
    const email = document.getElementById("email").value;
    const reclamacao = document.getElementById("reclamacao").value;
    const radioProblemaSite = document.getElementById("problemaSite").checked;
    const radioProblemaProduto =
      document.getElementById("problemaProduto").checked;

    if (
      email.length &&
      reclamacao.length > 0 &&
      typeof email &&
      typeof reclamacao == "string" &&
      (radioProblemaProduto == true || radioProblemaSite == true)
    ) {
      let tipoProblema;
      if (radioProblemaProduto == true) {
        tipoProblema = "Produto";
      } else {
        tipoProblema = "Site";
      }

      let database = firebase.database();
      const reclamacaoRef = database.ref(
        "principal/3/reclamacoes/" + usuario.uid
      );

      const reclamacaoInfo = {
        email: email,
        reclamacao: reclamacao,
        tipoProblema: tipoProblema,
      };

      reclamacaoRef.push(reclamacaoInfo).then(() => {
        alert("Reclamação criada com sucesso");
      });

      sairReclamacao();
    } else {
      alert(
        "Algum dos campos está com o tipo de dado errado ou vazio, cheque e tente novamente"
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function reiniciarProdutos() {
  const colDiv = document.querySelectorAll(".localProdutos");

  colDiv.forEach((col) => {
    while (col.firstChild) {
      col.firstChild.remove();
    }
  });
  console.log("PRODUTOS REINICIADOS");
}
function reiniciarCarrinho() {
  const container = document.querySelectorAll(".container-carrinho");

  container.forEach((item) => {
    while (item.firstChild) {
      item.firstChild.remove();
    }
    console.log("CARRINHO REINICIADO");
  });
}
