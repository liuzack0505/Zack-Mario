// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Mario from "../Mario";
import GameUI from "../GameUI";

enum State {
    Move = 'Move',
    Shell = 'Shell',
    ShellMove = 'ShellMove',
    Die = 'Die'
}

@ccclass
export default class Turtle extends cc.Component {

    @property(cc.Vec2)
    moveSpeed:cc.Vec2 = null;

    @property(cc.Vec2)
    shellMoveSpeed:cc.Vec2 = null;

    @property(cc.SpriteFrame)
    shellSprite :cc.SpriteFrame = null;

    @property(cc.PhysicsBoxCollider)
    physicsBoxCollider :cc.PhysicsBoxCollider = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(Mario)
    mario :Mario = null;

    @property(GameUI)
    gameUI: GameUI = null;

    @property(cc.SpriteFrame)
    dieByTurtleFrame: cc.SpriteFrame = null;

    private moveDir:number = 1;

    private currentState: State = State.Move;

    private action = null;

    checkTurtlePos(){
        if (this.node.x <= -492 || this.node.x > 1440) {
            this.moveDir *= -1;
        }
    }

    becomeShell(){
        this.currentState = State.Shell;
        this.physicsBoxCollider.size.height = 16;
        this.physicsBoxCollider.apply();
        this.node.name = "Shell";
    }

    shellMoving(){
        this.currentState = State.ShellMove;
        this.node.name = "Shellmove";
    }

    shellStopMoving(){
        this.currentState = State.Shell;
        this.node.name = "Shell";
    }

    turtleDie(){
        this.gameUI.updatePoint(500);
        this.moveDir = 0;
        this.node.scaleY = -1;
        this.node.removeComponent(cc.PhysicsBoxCollider);
        this.node.removeComponent(cc.RigidBody);
        this.getComponent(cc.Animation).stop();
        this.currentState = State.Die;
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

    marioBounce(){
        this.mario.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 150);
        this.mario.setisJump(true);
    }

    playanimation(){
        switch(this.currentState){
            case State.Move:
                if (!this.animation.getAnimationState("Turtle").isPlaying) {
                    this.animation.play("Turtle");
                }
                break;
            case State.Shell:
                this.animation.stop();
                this.getComponent(cc.Sprite).spriteFrame = this.shellSprite;
                break;
            case State.ShellMove:
                if (!this.animation.getAnimationState("TurtleShell").isPlaying) {
                    this.animation.play("TurtleShell");
                }
                break;
            case State.Die:
                if (!this.action) {
                    this.dieAnimation();
                }
        }
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    update (dt) {
        if (this.currentState === State.ShellMove) {
            this.node.x += this.shellMoveSpeed.x * this.moveDir * dt;
        } else if(this.currentState === State.Move){
            this.node.x += this.moveSpeed.x * this.moveDir * dt;
        }
        this.node.scaleX = (this.moveDir >= 0) ? 1 : -1;
        this.checkTurtlePos();
        this.playanimation();
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider){
        if (otherCollider.node.name === "Mario") {
            if (contact.getWorldManifold().normal.y === 1) {
                this.marioBounce();
                if (this.mario.getMarioState() === 'Squat') {
                    this.turtleDie();
                }else {
                    switch (this.currentState) {
                        case State.Move:
                            this.becomeShell();
                            break;
                        case State.Shell:
                            this.shellMoving();
                            break;
                        case State.ShellMove:
                            this.shellStopMoving();
                            break;
                        default:
                            break;
                    }
                }
            } else if (contact.getWorldManifold().normal.x === 1) {
                if (this.currentState === State.Shell) {
                    this.moveDir = -1;
                    this.shellMoving()
                } else {
                    this.mario.beHurt();
                }
            } else if (contact.getWorldManifold().normal.x === -1) {
                if (this.currentState === State.Shell) {
                    this.moveDir = 1;
                    this.shellMoving()
                } else {
                    this.mario.beHurt();
                }
            }
        } else if(otherCollider.node.name === "Shellmove"){
            this.turtleDie();
        } else if (otherCollider.tag === 0 && (contact.getWorldManifold().normal.x === 1 || contact.getWorldManifold().normal.x === -1)) {
            this.moveDir *= -1;
        } else if (otherCollider.tag === 1 && (contact.getWorldManifold().normal.x === 1 || contact.getWorldManifold().normal.x === -1)) {
            if (this.currentState === State.Move) {
                this.moveDir *= -1;
            }
            
        }
    }
}
