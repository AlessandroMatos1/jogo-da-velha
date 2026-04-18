const celulas = document.querySelectorAll('.celula');
const jogadorAtualSpan = document.getElementById('jogador-atual');
const btnReiniciar = document.getElementById('reiniciar');
const zeraPlacar = document.getElementById('zerar-placar')
const btnModo = document.getElementById('modo-btn');
const info = document.getElementById('info');
const placarX = document.getElementById('placar-x');
const placarO = document.getElementById('placar-o');
const placarEmpate = document.getElementById('placar-empate');

let jogadorAtual = 'X';
let tabuleiro = ['', '', '', '', '', '', '', '', ''];
let jogoAtivo = true;
let modoIA = false;
let pontos = { X: 0, O: 0, empate: 0 };

const combinacoesVitoria = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function jogar(e) {
  const index = e.target.dataset.index;
  if (tabuleiro[index]!== '' ||!jogoAtivo) return;
  if (modoIA && jogadorAtual === 'O') return;

  fazerJogada(index);

  if (modoIA && jogoAtivo && jogadorAtual === 'O') {
    setTimeout(jogadaComputador, 500);
  }
}

function fazerJogada(index) {
  tabuleiro[index] = jogadorAtual;
  celulas[index].textContent = jogadorAtual;
  celulas[index].classList.add(jogadorAtual.toLowerCase());

  if (verificarVitoria()) {
    info.textContent = `Jogador ${jogadorAtual} venceu!`;
    pontos[jogadorAtual]++;
    atualizarPlacar();
    jogoAtivo = false;
    return;
  }

  if (tabuleiro.every(celula => celula!== '')) {
    info.textContent = 'Deu velha!';
    pontos.empate++;
    atualizarPlacar();
    jogoAtivo = false;
    return;
  }

  jogadorAtual = jogadorAtual === 'X'? 'O' : 'X';
  jogadorAtualSpan.textContent = jogadorAtual;
  info.innerHTML = `Vez do jogador: <span id="jogador-atual">${jogadorAtual}</span>`;
}

function jogadaComputador() {
  let melhorJogada = encontrarMelhorJogada();
  fazerJogada(melhorJogada);
}

function encontrarMelhorJogada() {
  // 1. Tenta ganhar
  for (let i = 0; i < 9; i++) {
    if (tabuleiro[i] === '') {
      tabuleiro[i] = 'O';
      if (verificarVitoriaJogador('O')) {
        tabuleiro[i] = '';
        return i;
      }
      tabuleiro[i] = '';
    }
  }

  // 2. Bloqueia o X
  for (let i = 0; i < 9; i++) {
    if (tabuleiro[i] === '') {
      tabuleiro[i] = 'X';
      if (verificarVitoriaJogador('X')) {
        tabuleiro[i] = '';
        return i;
      }
      tabuleiro[i] = '';
    }
  }

  // 3. Pega o centro
  if (tabuleiro[4] === '') return 4;

  // 4. Pega um canto
  const cantos = [0, 2, 6, 8];
  const cantosVazios = cantos.filter(i => tabuleiro[i] === '');
  if (cantosVazios.length > 0) {
    return cantosVazios[Math.floor(Math.random() * cantosVazios.length)];
  }

  // 5. Qualquer lugar
  const vazios = tabuleiro.map((val, idx) => val === ''? idx : null).filter(val => val!== null);
  return vazios[Math.floor(Math.random() * vazios.length)];
}

function verificarVitoria() {
  return verificarVitoriaJogador(jogadorAtual);
}

function verificarVitoriaJogador(jogador) {
  return combinacoesVitoria.some(combinacao => {
    return combinacao.every(index => tabuleiro[index] === jogador);
  });
}

function atualizarPlacar() {
  placarX.textContent = pontos.X;
  placarO.textContent = pontos.O;
  placarEmpate.textContent = pontos.empate;
}

function reiniciarRodada() {
  jogadorAtual = 'X';
  tabuleiro = ['', '', '', '', '', '', '', '', ''];
  jogoAtivo = true;
  info.innerHTML = `Vez do jogador: <span id="jogador-atual">X</span>`;

  celulas.forEach(celula => {
    celula.textContent = '';
    celula.classList.remove('x', 'o');
  });

  if (modoIA && jogadorAtual === 'O') {
    setTimeout(jogadaComputador, 500);
  }
}

function trocarModo() {
  modoIA =!modoIA;
  btnModo.textContent = modoIA? 'Modo: vs Computador' : 'Modo: 2 Jogadores';
  reiniciarRodada();
}

function zerarPlacar() {
  console.log('zerei')
}

celulas.forEach(celula => celula.addEventListener('click', jogar));
btnReiniciar.addEventListener('click', reiniciarRodada);
zeraPlacar.addEventListener('click', zerarPlacar)
btnModo.addEventListener('click', trocarModo);