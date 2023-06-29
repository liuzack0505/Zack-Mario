// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameUI from "../GameUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Mushroom extends cc.Component {

    @property(cc.Vec2)
    moveSpeed: cc.Vec2 = cc.v2(100, 0);

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.RigidBody)
    rigidbody: cc.RigidBody = null;

    @property(cc.PhysicsBoxCollider)
    physicsBoxCollider: cc.PhysicsBoxCollider = null;
    
    //whther the mushrrom should move
    private isMove = false;

    private moveDir:number = 1;

    onAnimationFinished(){
        this.rigidbody.active = true;
        this.physicsBoxCollider.enabled = true;
        this.rigidbody.gravityScale = 1;
        this.isMove = true;
    }
    //check whether the mushroom exceed the boundary
    checkMushroomPos(){
        if (this.node.x < -520 || this.node.x > 1440) {
            this.node.destroy();
        }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.rigidbody.active = false;
        this.physicsBoxCollider.enabled = false;
        this.rigidbody.gravityScale = 0;
        this.animation.on('finished', this.onAnimationFinished, this);
    }

    update (dt:number) {
        if (this.isMove) {
            this.node.x += this.moveSpeed.x * this.moveDir * dt;
        }
        this.checkMushroomPos();
        
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.node.name == "Mario") {
            this.node.destroy();
        } else if (otherCollider.tag === 0 || otherCollider.tag === 1) {
            if (contact.getWorldManifold().normal.x == -1) {
                this.moveDir = 1;
            } else if (contact.getWorldManifold().normal.x == 1) {
                this.moveDir = -1;
            }
        }
    }
}
