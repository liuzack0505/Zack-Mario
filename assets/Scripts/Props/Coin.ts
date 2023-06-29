// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import GameUI from './../GameUI'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    @property(GameUI)
    gameUI: GameUI = null;

    @property(cc.AudioClip)
    coinClip: cc.AudioClip = null;

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider){
        if (otherCollider.node.name === 'Mario') {
            this.node.destroy();
            this.gameUI.updatePoint(100);
            this.gameUI.updateCoin();
            cc.audioEngine.playEffect(this.coinClip, false);
        }
    }
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    // update (dt) {}
}
