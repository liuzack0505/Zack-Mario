// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Mario from "./Mario";


const {ccclass, property} = cc._decorator;
@ccclass
export default class GameUI extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    lifeLabel: cc.Label = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    private scheduleID;

    private point: number = 0;

    private coinNum: number = 0;

    private life: number = 5;

    private MAXpoint: number = 99999999;

    private time: number = 500;

    private userData;

    updatePoint(P:number){
        if (P) {
            this.point += P;
        } else {
            this.point = P;
        }
        if (this.point > this.MAXpoint) {
            this.point = this.MAXpoint;
        }
        this.scoreLabel.string = this.point.toString().padStart(8, '0');
    }

    updateCoin(){
        this.coinNum++;
        if (this.coinNum > 99) {
            this.updateLife(1);
            this.coinNum = 0;
        }
        this.coinLabel.string = this.coinNum.toString().padStart(2, '0');
    }

    updateLife(L:number){
        this.life += L;
        if (this.life > 99) {
            this.life = 99;
        } 
        this.lifeLabel.string = this.life.toString().padStart(2, '0');
    }

    updateTime(){
        this.time--;
        this.timeLabel.string = this.time.toString().padStart(3, '0');
        if (this.time == 0) {
            console.log("end game!");
        }
    }


    setallLabel(){
        this.scoreLabel.string = this.point.toString().padStart(8, '0');
        this.coinLabel.string = this.coinNum.toString().padStart(2, '0');
        this.lifeLabel.string = this.life.toString().padStart(2, '0');
        this.timeLabel.string = this.time.toString().padStart(3, '0');
    }

    stopTimeSchedule(){
        this.unschedule(this.scheduleID);
    }

    win(challengeFinished: boolean = false){
        this.stopTimeSchedule();
        this.userData.life = this.life;
        this.userData.coin = this.coinNum;
        this.userData.score = this.point;
        if (cc.director.getScene().name === "stage_2") {
            this.userData.stage = 2;
        } else {
            if (this.userData.stage === 0) {
                this.userData.stage = 1;
            }
        }
        if (challengeFinished) {
            this.userData.challengeFinished = true;
            this.switchScene(this.userData, "ChallengeFinish");
            console.log("successful");
        } else {
            this.switchScene(this.userData, "Gameclear");
        }
        
    }

    lose(){
        this.updateLife(-1);
        this.userData.life = this.life <= 0 ? 5 : this.life;
        this.userData.coin = this.coinNum;
        this.userData.score = this.point;
        this.stopTimeSchedule();
        this.switchScene(this.userData, "Gameover");
    }

    switchScene(userData, sceneName: string){
        cc.director.loadScene(sceneName, ()=>{
            cc.director.emit("userData", userData);
        })
    }

    // LIFE-CYCLE CALLBACKS:
    start() {
        this.scheduleID = this.schedule(this.updateTime, 1);
        
    }
    onLoad () {
        cc.director.on("userData", (userData)=>{
            this.userData = userData;
            this.point = userData.score;
            this.coinNum = userData.coin;
            this.life = userData.life;
            console.log("GameUI get:" + userData.id)
            this.setallLabel();
        }, this)
    }

    // update (dt) {}
}
