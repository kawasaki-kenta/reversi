const HUMAN = 'human';
const RANDOM = 'random';
const NO_MOVE = -1;

//プレイヤー
class Player {
    constructor(name) {
        this.name = name;
    }

    //1手打つ
    actMove(game) {
        let move = NO_MOVE;
        switch (this.name) {
            case HUMAN:
                move = getMoveByHuman(game);
                break;
            case RANDOM:
                move = getMoveByRandom(game);
                break;
            default:
                break;
        }
        return putDisc(game.turn, game.board, move);
    }

}

 //ユーザーが選んだ手を返す
 function getMoveByHuman(game) {
    const move = game.humanMove;
    game.humanMove = NO_MOVE;
    return move;
}

//ランダムに選んだ手を返す
function getMoveByRandom(game) {
    const legalMoves = getLegalMoves(game.turn, game.board);
    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomIndex];
}