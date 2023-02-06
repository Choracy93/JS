let bombs = {
    total : 10,
    height : 10,
    width : 10,
  
    board : [],
    xCell : 0, 
  
    reset : () => {
      bombs.board = [];
      bombs.xCell = bombs.height * bombs.width;
       
      let wrap = document.getElementById("sapper"),
          cssWidth = 100 / 10;
          wrap.innerHTML = "";


          function countdown( timepiece, minutes, seconds )
          {
              let piece, timeUp, hours, ms, msLeft, time;
          
              function numerals( q )
              {
                  return (q <= 9 ? "0" + q : q);
              }
          
              function update()
              {
                  msLeft = timeUp - (+new Date);
                  if ( msLeft < 1000 ) {
                      // element.innerHTML = "Koniec czasu";
                      let sound = new Audio(   
                        src="OOPS.WAV");   
                                sound.play();
                      alert("Koniec czasu!");
                      bombs.reset();
                  } else {
                      time = new Date( msLeft );
                      hours = time.getUTCHours();
                      ms = time.getUTCMinutes();
                      piece.innerHTML = (hours ? hours + ':' + numerals( ms ) : ms) + ':' + numerals( time.getUTCSeconds() );
                      setTimeout( update, time.getUTCMilliseconds() + 500 );
                  }
              }
          
              piece = document.getElementById( timepiece );
              timeUp = (+new Date) + 1000 * (60*minutes + seconds) + 500;
              // clearTimeout(timeUp);
              update();
          }
          
          countdown( "timer", 10, 0 );


//           let timer;
// let clock = document.getElementById('timer');

// (function (){
//   let sec = 0;
//   timer = setInterval(()=>{
//     clock.innerHTML = sec;
//     sec ++;
//   }, 1000)
// })() 


// function clear(){
  // clearInterval(timer);
// }
  
      for (let line = 0; line<bombs.height; line++) {
        bombs.board.push([]);
        for (let col = 0; col<bombs.width; col++) {
          bombs.board[line].push({
            x : false, 
            y : false, 
            z : false, 
            a : 0, 
            c : document.createElement("div") 
          });
  
          let cell = bombs.board[line][col].c;
          cell.classList.add("cell");
          cell.id = "bombs-" + line + "-" + col;
          cell.dataset.line = line;
          cell.dataset.col = col;
          cell.onclick = () => { bombs.open(cell); };
          cell.oncontextmenu = (e) => {
            e.preventDefault();
            bombs.flag(cell);
          };
          cell.style.width = cssWidth + "%";
          cell.innerHTML = "&nbsp;";
          wrap.appendChild(cell);
        }   
      }
  
      let zCol = bombs.width - 1,
          zLine = bombs.height - 1,
          zLocation = bombs.total;
      while (zLocation > 0) {
        let line = Math.floor(Math.random() * zCol);
        let col = Math.floor(Math.random() * zLine);
        if (!bombs.board[col][line].z) {
          bombs.board[col][line].z = true;

          zLocation--;
        }
      }
  
      for (let line = 0; line<bombs.height; line++) {
        let lastLine = line - 1,
            nextLine = line + 1;
        if (nextLine == bombs.height) { nextLine = -1; }
  
        for (let col=0; col<bombs.width; col++) {
          let lastCol = col - 1,
              nextCol = col + 1;
          if (nextCol == bombs.width) { nextCol = -1; }
  

          if (!bombs.board[line][col].z) {
            if (lastLine != -1) {
              if (lastCol != -1) { if (bombs.board[lastLine][lastCol].z) { bombs.board[line][col].a++; } }
              if (bombs.board[lastLine][col].z) { bombs.board[line][col].a++; }
              if (nextCol != -1) { if (bombs.board[lastLine][nextCol].z) { bombs.board[line][col].a++; } }
            }
  
            if (lastCol != -1) { if (bombs.board[line][lastCol].z) { bombs.board[line][col].a++; } }
            if (nextCol != -1) { if (bombs.board[line][nextCol].z) { bombs.board[line][col].a++; } }
  
            if (nextLine != -1) {
              if (lastCol != -1) { if (bombs.board[nextLine][lastCol].z) { bombs.board[line][col].a++; } }
              if (bombs.board[nextLine][col].z) { bombs.board[line][col].a++; }
              if (nextCol != -1) { if (bombs.board[nextLine][nextCol].z) { bombs.board[line][col].a++; } }
            }
          }
  
        }
      }
    },
  
    flag : (cell) => {
      let line = cell.dataset.line,
          col = cell.dataset.col;

      if (!bombs.board[line][col].x) {
        cell.classList.toggle("flag");
        bombs.board[line][col].y = !bombs.board[line][col].y;
      }
    },
  
    open : (cell) => {
      let line = cell.dataset.line,
          col = cell.dataset.col;
  
      if (!bombs.board[line][col].y && bombs.board[line][col].z) {
        cell.classList.add("explosion");
        let sound = new Audio(   
          src="OOPS.WAV");   
                  sound.play();
        setTimeout(() => {
          alert("Bomba wybuchła!!!");
          bombs.reset();
          // refreshPage();
          // clearTimeout(update);
        }, 1);
      }
      
      else {
        let toShow = [],
            toCheck = [], 
            checked = []; 
        for (let i=0; i<bombs.height; i++) { checked.push({}); }
        toCheck.push([line, col]);
  
        while (toCheck.length>0) {

          let thisLine = parseInt(toCheck[0][0]),
              thisCol = parseInt(toCheck[0][1]);

          if (bombs.board[thisLine][thisCol].m || bombs.board[thisLine][thisCol].x || bombs.board[thisLine][thisCol].y) {}
          else {

            if (!checked[thisLine][thisCol]) { toShow.push([thisLine, thisCol]); }
  
            if (bombs.board[thisLine][thisCol].a == 0) {
              let lastLine = thisLine - 1,
                  nextLine = thisLine + 1,
                  lastCol = thisCol - 1,
                  nextCol = thisCol + 1;
              if (nextLine == bombs.height) { nextLine = -1; }
              if (nextCol == bombs.width) { nextCol = -1; }
  
              if (lastLine != -1) {
                if (lastCol != -1 && !checked[lastLine][lastCol]) { toCheck.push([lastLine, lastCol]); }
                if (!checked[lastLine][thisCol]) { toCheck.push([lastLine, thisCol]); }
                if (nextCol != -1 && !checked[lastLine][nextCol]) { toCheck.push([lastLine, nextCol]); }
              }
  
              if (lastCol != -1 && !checked[thisLine][lastCol]) { toCheck.push([thisLine, lastCol]); }
              if (nextCol != -1 && !checked[thisLine][nextCol]) { toCheck.push([thisLine, nextCol]); }
  
              if (nextLine != -1) {
                if (lastCol != -1 && !checked[nextLine][lastCol]) { toCheck.push([nextLine, lastCol]); }
                if (!checked[nextLine][thisCol]) { toCheck.push([nextLine, thisCol]); }
                if (nextCol != -1 && !checked[nextLine][nextCol]) { toCheck.push([nextLine, nextCol]); }
              }
            }
          }
  
          checked[thisLine][thisCol] = true;
          toCheck.shift();
        }
  
        if (toShow.length > 0) {
          for (let cell of toShow) {
            let thisLine = parseInt(cell[0]);
            let thisCol = parseInt(cell[1]);
            bombs.board[thisLine][thisCol].x = true;
            if (bombs.board[thisLine][thisCol].a != 0) {
              bombs.board[thisLine][thisCol].c.innerHTML = bombs.board[thisLine][thisCol].a;
            }
            bombs.board[thisLine][thisCol].c.classList.add("show");
            bombs.xCell = bombs.xCell - 1;
          }
        }
  
        if (bombs.xCell == bombs.total) {
          let soundV = new Audio(   
            src="VICTORY.WAV");   
                    soundV.play();
          alert("Zwycięstwo!");
          bombs.reset();
        }
      }
    }
  };

  function refreshPage(){
    window.location.reload();
} 
  window.addEventListener("DOMContentLoaded", bombs.reset);