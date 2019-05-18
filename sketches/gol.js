var grid;

function setup () {
  createCanvas(400, 400);
  grid = new Grid(20);
  grid.randomize();

}

function draw () {
  background(250);
  grid.updateNeighborCounts();
  grid.updatePopulation();
  grid.draw();
  tick();
}

function tick() { //keeps game going indefinitely
  // console.time("loop");
	grid.draw();
	// console.timeEnd("loop");
	grid.updatePopulation(tick);
	requestAnimationFrame(tick);
}

function mousePressed(){
  
  grid.updateNeighborCounts();
  print(grid.cells);
}

function pauseGame() { 
  game = clearTimeout(game); //clears timer set with the setTimeout() method
}
 
function keyDown(e) {
  if (e.keyCode === 0) pauseGame(); //left button of mouse pressed
}
 
function pauseGame() {
  if (!gamePaused) {
    game = clearTimeout(game);
    gamePaused = true;
  } else if (gamePaused) {
    game = setTimeout(loop, 1000 / 30); //evaluates 
    gamePaused = false;
  }
}

class Grid {
  constructor (cellSize) {
    //assign values for numberOfColumns and numberOfRows
    this.cellSize = cellSize;
    this.numberOfColumns = floor(width / this.cellSize);
    this.numberOfRows = floor(height / this.cellSize);
    
    this.cells = new Array(this.numberOfColumns);
    for(var i = 0; i < this.cells.length; i++){
      this.cells[i] = new Array(this.numberOfRows);
    }
    //go into each position in the 2D array and create a new `Cell`.
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row] = new Cell(column, row, cellSize);
    }
  }
    print(this.cells);
  }

  draw () {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row].draw();
      }
    }
  }
  
  randomize(){
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        var value = floor(random(2)); //returns interger between 0 and 2
        this.cells[column][row].setIsAlive(value);
      }
    }
  }
  
  updatePopulation () {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row].liveOrDie();
      }
    }
  }
  
  getNeighbors(currentCell) {
  var neighbors = [];

  //logic to get neighbors and add them to the array
  for (var xOffset = -1; xOffset <= 1; xOffset++) {
  for (var yOffset = -1; yOffset <= 1; yOffset++) {
    var neighborColumn = currentCell.column + xOffset;
    var neighborRow = currentCell.row + yOffset;

    // do something with neighborColumn and neighborRow
    if(this.isValidPosition(neighborColumn, neighborRow)){
      var neighborCell = this.cells[neighborColumn][neighborRow];
      
      if(neighborCell != currentCell){
        neighbors.push(neighborCell);
      }
    }
  }
}

  return neighbors;
}

  isValidPosition (column, row) {
  //checks if the column and row exist in the grid
    var validColumn = column >= 0 && column < this.numberOfColumns;
    var validRow = row >= 0 && row < this.numberOfRows;

    return  validColumn && validRow;
  
}

  updateNeighborCounts (grid, x, y) {
  // for each cell in the grid
    // reset it's neighbor count to 0
    // get the cell's neighbors
    // increase liveNeighborCount by 1 for each neighbor that is alive
    
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        var currentCell = this.cells[column][row];
        currentCell.liveNeighborCount = 0;

        var neighborsArray = this.getNeighbors(currentCell);

        for (var position in neighborsArray) {
          if (neighborsArray[position].isAlive) {
            currentCell.liveNeighborCount += 1;
          }
        }
      }
    }
}
  
}

class Cell {
  constructor (column, row, size) {
    this.column = column;
    this.row = row;
    this.size = size;
    this.isAlive = false;
    this.liveNeighborCount = 0;
  }
  
  draw(){
    if (this.isAlive) {
      fill(color(200, 0, 200));
    } else {
      fill(color(240));
    }
    noStroke();
    rect(this.column * this.size + 1, this.row * this.size + 1, this.size - 1, this.size - 1);
  }
  
  setIsAlive(value){
    if (value){
      this.isAlive = true;
    } else {
      this.isAlive = false;
    }
  }
  
  liveOrDie(){ 
    if (this.isAlive && this.liveNeighborCount < 2){
      this.isAlive = false; //underpopulation
    } else if (this.isAlive && this.liveNeighborCount > 3){
      this.isAlive = false; //overpopulation
    } else if (!this.isAlive && this.liveNeighborCount === 3){
      this.isAlive = true; //reproduction
    } else if (this.isAlive && this.liveNeighborCount === 2 || this.liveNeighborCount === 3) {
      this.isAlive = true; //lives on the next generation
    }
  }
  
}
