import '../styles/index.scss';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

document.addEventListener("DOMContentLoaded", function() {

  var audio = document.getElementById('backgroundMusic');

  document.querySelector('.stopButton').addEventListener('click', (e) => {
    audio.pause();
    audio.loop = true;
      audio.volume = 0.3;
    document.querySelector('.stopButton').style.display = 'none';
    document.querySelector('.playButton').style.display = 'block';
  });
  document.querySelector('.playButton').addEventListener('click', (e) => {
    audio.play();
    document.querySelector('.stopButton').style.display = 'block';
    document.querySelector('.playButton').style.display = 'none';
  });


let ysdk;

function initGame(params) {
  YaGames
  .init(params)
  .then(_sdk => {
    ysdk = _sdk;

    ysdk.features.LoadingAPI?.ready(); // Показываем SDK, что игра загрузилась и можно начинать играть
  })
  .catch(console.error);
}

initGame();




  let i = 0;
  let n = 0;
  let play = false;
  let gameOverAudio = document.getElementById('loseMusic');
  let winAudio = document.getElementById('winMusic');


  const cards = document.querySelectorAll(".memory-card");

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;

  function flipCard(){
    if(lockBoard) return;
    if(this === firstCard) return;

    this.classList.toggle('flip');

    if(!hasFlippedCard){
      // first click
      hasFlippedCard = true;
      firstCard = this;

      return;
    }

    if(!play) {
      audio.play();
      audio.loop = true;
      audio.volume = 0.3;
      play = true;
    }

    // second click
    secondCard = this;

    checkForMath();
  }

  document.querySelectorAll('.restart_button').forEach(button => {
    button.addEventListener('click', restartGame);
  });

  function restartGame(){
    document.querySelector('.num').textContent = document.querySelector('.all_healf').textContent;

    cards.forEach(card => {
      if(card.classList.contains('flip')){
        card.classList.remove('flip');
      }
      card.addEventListener('click', flipCard);
    });

    document.querySelector('.hidden').style.display = 'none';
    document.querySelector('#popup_1').style.display = 'none';
    document.querySelector('#popup_2').style.display = 'none';
    
    i = 0;
    n = 0;

    ysdk.adv.showFullscreenAdv();
  }

  function checkForMath(){
     let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    
    if(isMatch) {
      disableCards();
      i++;

      if(i == 6){
        winAudio.play();
        setTimeout(() => {
          document.querySelector('.hidden').style.display = 'flex';
          document.querySelector('#popup_2').style.display = 'block';
        }, 500);
      }
      
    } else {
      unflipCards();
      n++; 

      let num = document.querySelector('.num').textContent * 1; 
      let all_healf = document.querySelector('.all_healf').textContent * 1;


      if(n == all_healf){
        gameOverAudio.play();

        setTimeout(() => {
          document.querySelector('.hidden').style.display = 'flex';
          document.querySelector('#popup_1').style.display = 'block';

          
        }, 500);
      }

      document.querySelector('.num').textContent  = num - 1;
    }
  }

  function disableCards(){
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
  }

  function unflipCards(){
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      resetBoard();
     }, 1500)
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  (function shuffle() {
    cards.forEach( card => {
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    })
  })();



  cards.forEach(card => card.addEventListener('click', flipCard));
});