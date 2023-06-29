// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Mario from "../Mario";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    @property(Mario)
    mario: Mario = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    // update (dt) {}

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider){
        if (otherCollider.node.name === "Mario") {
            if (contact.getWorldManifold().normal.x === -1) {
                this.mario.win('left')
            } else {
                this.mario.win('right');
            }
        }
    }
}
