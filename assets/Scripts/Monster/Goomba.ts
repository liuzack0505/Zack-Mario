// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import GameUI from "../GameUI";
import Mario from "../Mario";

enum State {
    Move = 'Move',
    Die = 'Die', 
    DiebyTurtle = 'DiebyTurtle'
}

@ccclass
export default class Goomba extends cc.Component {

    @property(cc.Vec2)
    moveSpeed:cc.Vec2 = null;

    @property(cc.SpriteFrame)
    dieSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dieByTurtleFrame: cc.SpriteFrame = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(Mario)
    mario :Mario = null;

    @property(GameUI)
    gameUI: GameUI = null;

    private moveDir:number = 1;

    private currentState: State = State.Move;

    private action = null;

    GoombaDie(){
        this.gameUI.updatePoint(500);
        this.moveDir = 0;
        this.node.removeComponent(cc.PhysicsBoxCollider);
        this.node.removeComponent(cc.RigidBody);
        this.getComponent(cc.Animation).stop();
        this.node.anchorY = 0.6;
        this.currentState = State.Die;
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 0.3)
    }

    GoombaDie2(){
        this.moveDir = 0;
        this.node.scaleY = -1;
        this.node.removeComponent(cc.PhysicsBoxCollider);
        this.node.removeComponent(cc.RigidBody);
        this.getComponent(cc.Animation).stop();
        this.currentState = State.DiebyTurtle;
    }

    dieAnimation(){
        this.getComponent(cc.Sprite).spriteFrame = this.dieByTurtleFrame;
        const moveUpAction = cc.moveTo(0.1, cc.v2(this.node.x, this.node.y + 10));
        const moveDownAction = cc.moveTo(0.35, cc.v2(this.node.x, -50));
        this.action = cc.sequence(moveUpAction, moveDownAction, cc.callFunc(this.ondieAnimation, this))
        this.node.runAction(this.action);
    }

    ondieAnimation(){
        this.node.destroy();
    }

    checkGoombaPos(){
        if (this.node.x <= -492 || this.node.x > 1440) {
            this.moveDir = 1;
        }
    }

    marioBounce(){
        this.mario.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 150);
        this.mario.setisJump(true);
    }

    playanimation(){
        switch(this.currentState){
            case State.Move:
                if (!this.animation.getAnimationState("Goomba").isPlaying) {
                    this.animation.play("Goomba");
                }
                break;
            case State.Die:
                this.getComponent(cc.Sprite).spriteFrame = this.dieSpriteFrame;
                break;
            case State.DiebyTurtle:
                if (!this.action) {
                    this.dieAnimation();
                }
                break;
        }
        
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    //     this.gameUI = 
    // }

    // start () {
        
    // }

    update (dt) {
        this.node.x += this.moveSpeed.x * this.moveDir * dt;
        this.node.scaleX = (this.moveDir >= 0) ? 1 : -1;
        this.checkGoombaPos();
        this.playanimation();
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider){
        if (otherCollider.node.name == "Mario") {
            if (contact.getWorldManifold().normal.y === 1) {
                otherCollider.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 150);
                this.GoombaDie();
            } else if (contact.getWorldManifold().normal.x === 1 || contact.getWorldManifold().normal.x === -1) {
                this.mario.beHurt();
            } 
        } else if (otherCollider.node.name === "Shellmove") {
            this.GoombaDie2();
        } if (otherCollider.tag !== 2 && (contact.getWorldManifold().normal.x === 1 || contact.getWorldManifold().normal.x === -1)) {
            this.moveDir *= -1;
        }
    }
}
