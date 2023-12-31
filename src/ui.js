const UI_BOARD = 'ui_board';
const BLACK_IMG = './image/black.png';
const WHITE_IMG = './image/white.png';

//盤面の初期設定
function initUi() {
    createBoardTable(); //盤面のテーブルを作成
    updateUi();         //ゲーム情報を反映
}

//盤面のテーブル作成
function createBoardTable() {
    //ボードの子要素を一旦削除
    const uiBoard = document.getElementById(UI_BOARD);
    removeChilds(uiBoard);
    //ヘッダを含めた盤面をテーブルで作成
    const table = document.createElement('table');
    uiBoard.appendChild(table);
    for (let y=0; y<BOARD_SIZE; y++) {
        const tr = document.createElement('tr');
        table.appendChild(tr);
        for (let x=0; x<BOARD_SIZE; x++) {
            const td = document.createElement('td');
            tr.appendChild(td);
            td.addEventListener('click', onBoardClicked);
            td.setAttribute('id', UI_BOARD + (y * BOARD_SIZE + x)); // id="ui_board1" 
        }
    }
    //盤面のサイズと背景色
    for (let i=0; i<BOARD.length; i++) {
        const square = document.getElementById(UI_BOARD + i);
        square.width = 60;
        square.height = 60;
        if (reversi.board[i] !== X) {
            square.style.backgroundColor = 'green';
            
        }
    }
    //盤面のヘッダー情報を追加
    for (let i=0; i<PLAYABLE_SIZE; i++) {
        //上辺のヘッダ（アルファベット）
        const topHeader = document.getElementById(UI_BOARD + (i + 1));
        topHeader.textContent = String.fromCharCode('A'.charCodeAt(0) + i);
        //左辺のヘッダ（数字）
        const leftHeader = document.getElementById(UI_BOARD + ((i + 1) * BOARD_SIZE));
        leftHeader.textContent = i + 1;
    }
    //石の初期配置
    setupDiscs(PLAYABLE_INDEXS);
}

//マスをクリックしたときの処理
function onBoardClicked(event) {
    if (reversi.state !== GAME_STOP) return;
    if (reversi.player.name === HUMAN) {
        const index = Number(this.getAttribute('id').replace(UI_BOARD, ''));
        const flippables  = getFlippablesAtIndex(reversi.turn, reversi.board, index);
        if (flippables.length > 0) {
            reversi.humanMove = index;
            reversi.loop();
        }
    }
}

//盤面の更新
function updateUi() {
    setupDiscs(reversi.updatedDiscs);
    const turn = document.getElementById('turn');
    turn.textContent = getGameTurnText(reversi.turn);
    const score = document.getElementById('score');
    score.textContent = reversi.blackScore + ' : ' + reversi.whiteScore;
}

//石を並べる
//（引数）
//indexs : 石を置く位置(マスを示す番号)の配列
function setupDiscs(indexs) {
    for (let index of indexs) {
        const square = document.getElementById(UI_BOARD + index);
        switch (reversi.board[index]) {
            case B:
                setImg(square, BLACK_IMG);
                break;
            case W:
                setImg(square, WHITE_IMG);
                break;
            default:
                break;
        }
    }
}

//画像を配置
//（引数）
//element:Document要素
// imgPath:画像
function setImg(element, imgPath) {
    removeChilds(element);                      //一旦、子要素削除
    const img = document.createElement('img');  //画像要素作成
    img.src = imgPath;                          //画像パス
    img.width = 40;                             //横サイズ（px）
    img.height = 40;                            //縦サイズ（px）
    element.appendChild(img);                   //画像追加
}

//要素の子を削除
function removeChilds(element) {
    for (let i=element.childNodes.length-1; i>=0; i--) {
        element.removeChild(element.childNodes[i]);
    }
}

//手番の文字列を取得
function getGameTurnText(turn) {
    if (turn === B) return 'Black';
    if (turn === W) return 'White';
    return GAME_TURN_END;
}