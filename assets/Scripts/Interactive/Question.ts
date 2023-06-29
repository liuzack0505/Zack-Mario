// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameUI from "../GameUI";

const {ccclass, property} = cc._decorator;

enum props{
    Mushroom = 'Mushroom',
    Coin = 'Coin',
    MushroomReserve = 'MushroomReserve'
}

@ccclass
export default class Question extends cc.Component {

    @property(GameUI)
    gameUI: GameUI = null;

    @property(cc.String)
    prop: string = '';

    @property(cc.SpriteFrame)
    newSpriteFrame: cc.SpriteFrame = null;

    @property(cc.Prefab)
    mushroomPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    mushroomReservePrefab: cc.Prefab = null;
    
    @property(cc.AudioClip)
    mushroomClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    coinClip: cc.AudioClip = null;

    @property
    isConceal: boolean = false;
    
    //whether the prop insides the question brick
    private isProp:boolean = true;

    spawnMushroom(){
        const mushroomPrefab = this.mushroomPrefab; 
        const mushroomNode = cc.instantiate(mushroomPrefab);
        this.node.addChild(mushroomNode);
        mushroomNode.setPosition(new cc.Vec2(0, 16));
    }

    spawnMushroomReserve(){
        const mushroomPrefab = this.mushroomReservePrefab; 
        const mushroomNode = cc.instantiate(mushroomPrefab);
        this.node.addChild(mushroomNode);
        mushroomNode.setPosition(new cc.Vec2(0, 16));
    }

    spawnCoin(){
        this.gameUI.updatePoint(100);
        this.gameUI.updateCoin();
        const coinPrefab = this.coinPrefab; 
        const coinNode = cc.instantiate(coinPrefab);
        this.node.addChild(coinNode);
        coinNode.setPosition(new cc.Vec2(0, 16));
        coinNode.getComponent(cc.Animation).play('Coin');
        coinNode.getComponent(cc.Animation).on('finished', ()=>{
            coinNode.destroy();
        })
    }
    //check the type of prop, and do the corresponding action
    checkProp(){
        if (this.prop === props.Mushroom) {
            this.scheduleOnce(this.spawnMushroom, 0.1);
            cc.audioEngine.playEffect(this.mushroomClip, false);
        } else if(this.prop === props.Coin){
            this.scheduleOnce(this.spawnCoin, 0.1);
            cc.audioEngine.playEffect(this.coinClip, false);
        } else if(this.prop === props.MushroomReserve){
            this.scheduleOnce(this.spawnMushroomReserve, 0.1);
            cc.audioEngine.playEffect(this.mushroomClip, false);
        }
    }
    checkCollision(){
        if (this.isConceal) {
            this.node.opacity = 255;
        }
        this.node.getComponent(cc.Animation).stop();
        this.node.getComponent(cc.Sprite).spriteFrame = this.newSpriteFrame; 
    }

    // LIFE-CYCLE CALLBACKS:
 
    onLoad () {
        if (this.isConceal) {
            this.node.opacity = 0;
        }
    }

    // start () {
        
    // }
    
    // update (dt) {}

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.node.name === 'Mario' && this.isProp) {
            if (contact.getWorldManifold().normal.y === -1) {
                this.checkCollision();
                this.checkProp();
                this.isProp = false;
            }
        }
    }
}
