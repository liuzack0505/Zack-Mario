// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import type firebase from '../firebase';
declare const firebase: any;

@ccclass
export default class GameEnd extends cc.Component {

    @property(cc.AudioClip)
    gameoverClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameclearClip: cc.AudioClip = null;

    @property(cc.Boolean)
    isClear: boolean = false;

    private audioID = null;

    private userData;

    switchScene(userData) {
        cc.director.loadScene("LevelSelect", ()=>{
            cc.director.emit("userData", userData);
        });
    }

    async updateData(){
        await firebase.database().ref(this.userData.id).set(this.userData);
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.on("userData", (userData)=>{
            this.userData = userData;
            console.log("Game end get:" + userData.id)
            this.updateData();
        }, this)
        if (!this.isClear) {
            this.audioID = cc.audioEngine.play(this.gameoverClip, false, 1);
        } else {
            this.audioID = cc.audioEngine.play(this.gameclearClip, false, 1);
        } 
        this.scheduleOnce(()=>{
            this.switchScene(this.userData);
        }, 3)
    }

    // start () {

    // }

    // update (dt) {}
}
