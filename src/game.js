const BLACK = new Player(HUMAN);    //人が操作
const WHITE = new Player(RANDOM);   //コンピュータが操作（ランダム）
const PASS_END = 2;                 //終了判定用のパス累積回数
const WAIT_TIME = 800;              //ウェイト時間（ms）
const GAME_INIT = 0;
const GAME_PLAY = 0;
const GAME_STOP = 0;
const GAME_END = 0;
const GAME_TURN_END = 'End';
const DRAW = 'Draw';
const PASS = 'Pass';
const WIN = 'Win';

//ゲームの管理
class Game {
    constructor(board, turn, black, white) {
        this.board = board.concat();    //board配列
        this.turn = turn;   //B = 2
        this.black = black; //'human'
        this.white = white; //'random'
        this.player = this.turn === B ? this.black : this.white;    //'human'
        this.pass = 0;
        this.wait = this.getWaitTime(); //800 or 0
        this.humanMove = NO_MOVE;   //NO_MOVE = -1
        this.updateScore();
        this.updatedDiscs = [];
        this.state = GAME_INIT;     //GAME_INIT = 0
    }

    //待ち時間取得
    getWaitTime() {
        //ユーザー同士、コンピュータ同士の場合はウェイトなし
        const isNotSamePlayer = (this.black.name !== this.white.name);
        const human = (this.black.name === HUMAN || this.white.name === HUMAN);

        //＊＊デバッグ用＊＊
        console.log(isNotSamePlayer);
        console.log(human);

        return (isNotSamePlayer && human) ? WAIT_TIME : 0;
    }

    //ゲームループ
    loop() {
        this.updatedDiscs = [];
        this.state = this.play();
        this.updateScore();
        updateUi();
        switch (this.state) {
            case GAME_PLAY:
                setTimeout(() => this.loop(), this.wait);
                break;
            case GAME_STOP:
                break;
            case GAME_END:
                alert(this.getWinnerMessage());
                break;
            default:
                break;
        }
    }

    //1手プレイ
    play() {
        if (this.isEnd()) return GAME_END;
        if (this.indicatePass()) alert(this.getPassMessage());
        this.pass = 0;
        this.updatedDiscs = this.player.actMove(this);
        if (this.updatedDiscs.length === 0) return GAME_STOP;
        this.setNextPlayer();
        return GAME_PLAY;
    }

    //次のプレイヤーを設定する
    setNextPlayer() {
        this.turn = this.turn === B ? W : B;
        this.player = this.turn === B ? this.black : this.white;
    }

    //スコアの更新
    updateScore() {
        this.blackScore = this.board.filter(e => e === B).length;   //コールバック関数がアロー関数で書かれている？
        this.whiteScore = this.board.filter(e => e === W).length;
    }

    //終了の判定
    isEnd() {
        if (this.isPass() && this.isPass()) {   /////
            this.turn = GAME_TURN_END;
            return true;
        }
        return false;
    }

    //パスの判定
    isPass() {
        if (getLegalMoves(this.turn, this.board).length <= 0) { //?
            this.setNextPlayer(this.turn);
            this.pass++;
            return true;
        }
        return false;
    }

    //パス通知の有無
    indicatePass() {
        const pass = (this.pass < PASS_END && this.pass > 0);
        const human = (this.black.name === HUMAN || this.white.name === HUMAN);
        return pass && human;
    }

    //パス通知のメッセージを取得
    getPassMessage() {
        const pre = this.turn === B ? W : B;
        return getGameTurnText(pre) + ' ' + PASS;
    }

    //勝利プレイヤー通知のメッセージを取得
    getWinnerMessage() {
        let winner = DRAW;
        if (this.blackScore > this.whiteScore) winner = B;
        if (this.whiteScore > this.blackScore) winner = W;
        return winner;
    }


}