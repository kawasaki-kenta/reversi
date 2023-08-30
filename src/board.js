const X = 0;
const E = 1;
const B = 2;
const W = 3;


const BOARD = [
    X, X, X, X, X, X, X, X, X, X,
    X, E, E, E, E, E, E, E, E, X,
    X, E, E, E, E, E, E, E, E, X,
    X, E, E, E, E, E, E, E, E, X,
    X, E, E, E, W, B, E, E, E, X,
    X, E, E, E, B, W, E, E, E, X,
    X, E, E, E, E, E, E, E, E, X,
    X, E, E, E, E, E, E, E, E, X,
    X, E, E, E, E, E, E, E, E, X,
    X, X, X, X, X, X, X, X, X, X,
];

const DIRECTION_XY = [
    {'x': 0, 'y':-1},   //上
    {'x': 1, 'y':-1},   //右上
    {'x': 1, 'y': 0},   //右
    {'x': 1, 'y': 1},   //右下
    {'x': 0, 'y': 1},   //下
    {'x':-1, 'y': 1},   //左下
    {'x':-1, 'y': 0},   //左
    {'x':-1, 'y':-1},   //左上
];

const BOARD_SIZE = Math.sqrt(BOARD.length);
const PLAYABLE_SIZE = BOARD_SIZE - 2;
const BOARD_ELEMENT_NUM = BOARD_SIZE * BOARD_SIZE;
const PLAYABLE_START = BOARD_SIZE + 1;
const PLAYABLE_END = (BOARD_SIZE + 1) * PLAYABLE_SIZE;
const PLAYABLE_INDEXS = getPlayableIndexes();

//ゲームで遊べる範囲の全ての盤面位置を取得
function getPlayableIndexes() {
    const all = Array(BOARD_ELEMENT_NUM).fill().map((value, i) => i)
    const limited = all.filter(e => (e >= PLAYABLE_START && e <= PLAYABLE_END));
    return limited.filter(e => (e % BOARD_SIZE !== 0 && (e + 1) % BOARD_SIZE !== 0));
}

//ひっくり返せる石を取得する処理
function getFlippablesAtIndex(turn, board, index) {
    let flippables = [];
    if (board[index] !== E) return flippables;  //index = 56
    const opponent = turn === B ? W : B;        
    const size = Math.sqrt(board.length);       //size = 10
    for (let {x, y} of DIRECTION_XY) {          
        const dir = (size * y) + x;             //y = 0, x = -1, dir = -1
        let opponentDiscs = [];
        let next = index + dir;                 //next = 55
        //相手のディスクが連続しているものを候補とする
        while (opponent === board[next]) {
            opponentDiscs.push(next);
            next += dir;
        }
        //連続が途切れた個所が自ディスクの場合、候補を戻り値に追加
        if (board[next] === turn) {
            flippables = flippables.concat(opponentDiscs);
        }
    }
    return flippables;
}

//打てる手を取得する処理
function getLegalMoves(turn, board) {
    let legalMoves = [];
    for (let i=0; i<board.length; i++) {
        const flippables = getFlippablesAtIndex(turn, board, i);
        if (flippables.length > 0) legalMoves.push(i);
    }
    return legalMoves;
}

//石を置く処理
function putDisc(turn, board, index) {
    if (index === NO_MOVE) return [];
    const flippables = getFlippablesAtIndex(turn, board, index);
    board[index] = turn;
    for (let flippable of flippables) {
        board[flippable] = turn;
    }
    return flippables.concat(index);
}