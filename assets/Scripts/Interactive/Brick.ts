// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Mario from "../Mario";

const {ccclass, property} = cc._decorator;


@ccclass
export default class Brick extends cc.Component {

    @property(Mario)
    mario: Mario = null;

    @property(cc.Prefab)
    effectPrefab: cc.Prefab = null;


    brokeEffect(){
        const effectPrefab = this.effectPrefab; 
        const effectNode = cc.instantiate(effectPrefab);
        this.node.parent.addChild(effectNode);
        effectNode.position = this.node.position;
    }


    checkCollision(){
        if (this.mario.getMarioType() === 'Big') {
            this.node.active = true;
            this.node.getComponent(cc.Animation).stop();
            this.scheduleOnce(()=>{
                this.brokeEffect();
                this.node.destroy();
            }, 0.1)
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
        
    // }

    // start () {

    // }

    // update (dt) {}
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.node.name === 'Mario') {
            if (contact.getWorldManifold().normal.y === -1) {
                this.checkCollision();
            }
        }
    }
}
