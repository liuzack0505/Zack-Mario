// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import GameUI from "./GameUI";

enum State {
    Idle = 'Idle',
    Squat = 'Squat',
    Run = 'Run',
    Die = 'Die',
    Win = 'Win'
}

enum Type {
    Small = 'Small', 
    Big = 'Big',
}

@ccclass
export default class Mario extends cc.Component {

    @property(cc.Vec2)
    moveSpeed: cc.Vec2 = cc.v2(150, 0);

    @property(cc.Vec2)
    jumpSpeed: cc.Vec2 = cc.v2(0, 250);

    @property(cc.Vec2)
    squatSpeed: cc.Vec2 = cc.v2(0, -250);

    @property(cc.Vec3)
    rebournPos: cc.Vec3 = cc.v3(0, 0, 0);

    @property(cc.Vec2)
    minLocation: cc.Vec2 = null;

    @property(cc.Vec2)
    maxLocation: cc.Vec2 = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.SpriteFrame)
    big_idleFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    small_jumpFrame:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    small_squatFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    big_squatFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    die_Frame:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    win_Frame:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    big_win_Frame:cc.SpriteFrame = null;
    
    @property(cc.SpriteFrame)
    big_jumpFrame:cc.SpriteFrame = null;

    @property(cc.RigidBody)
    rigidBody: cc.RigidBody = null; //mario rigidbody

    @property(cc.PhysicsBoxCollider)
    physicsboxcollider: cc.PhysicsBoxCollider = null;

    @property(cc.AudioClip)
    BgmClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    jumpClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    powerUpClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    powerDownClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    winClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    dieClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    reserveClip: cc.AudioClip = null;

    @property(GameUI)
    gameUI: GameUI = null;

    @property
    debugMode: boolean = false;

    private physicManager: cc.PhysicsManager = null;

    private idleFrame:cc.SpriteFrame = null;

    private moveDir:number = 0

    private currentState:State = State.Idle;

    private currentType: Type = Type.Small;

    private leftDown: boolean = false;

    private rightDown: boolean = false;

    private isJump: boolean = false;

    private action: cc.Action = null;

    private BgmID: number;

    private groundTime: number = 0;;


    //the keyboard control
    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.leftDown = true;
                this.moveLeft();
                break;
            case cc.macro.KEY.right:
                this.rightDown = true;
                this.moveRight();
                break;
            case cc.macro.KEY.space:
                if (!this.isJump) {
                    this.jump();
                }
                break;
            case cc.macro.KEY.down:
                this.squat();
                break;
            case cc.macro.KEY.enter:
                cc.log(this.node.position);
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.leftDown = false;
                if (this.rightDown) {
                    this.moveRight();
                } else {
                    this.stopMoving();
                }
                break;
            case cc.macro.KEY.right:
                this.rightDown = false;
                if (this.leftDown) {
                    this.moveLeft();
                } else {
                    this.stopMoving();
                }
                break;
            case cc.macro.KEY.down:
                this.stopMoving();
                break;
            default:
                break;
        }
        
    }

    moveLeft() {
        this.currentState = State.Run;
        this.moveDir = -1;
        
    }

    moveRight() {
        this.currentState = State.Run;
        this.moveDir = 1;
    }
    
    jump(){
        cc.audioEngine.playEffect(this.jumpClip, false);
        this.rigidBody.linearVelocity = this.jumpSpeed;
        this.setisJump(true);
    }

    setisJump(J :boolean){
        this.isJump = J;
    }

    squat(){
        this.leftDown = this.rightDown = false;
        this.currentState = State.Squat;
        if (this.isJump) {
            this.rigidBody.linearVelocity = this.squatSpeed;
        }
    }

    stopMoving() {
        this.currentState = State.Idle;
        this.moveDir = 0;
    }

    //check whether the Mario exceed the boundary
    checkMarioPos(){
        if (this.node.x < this.minLocation.x) {
            this.node.x = this.minLocation.x;
        } else if(this.node.x > this.maxLocation.x){
            this.node.x = this.maxLocation.x;
        }

        if (this.node.y < this.minLocation.y) {
            if (this.currentState != State.Die) {
                this.die();
            }
        }
    }

    turnToBig(){
        cc.audioEngine.playEffect(this.powerUpClip, false);
        this.physicsboxcollider.size.height = 26;
        this.physicsboxcollider.apply();
        this.currentType = Type.Big;
        this.gameUI.updatePoint(1000);
    }

    turnToSmall(){
        cc.audioEngine.playEffect(this.powerDownClip, false);
        this.physicsboxcollider.size.height = 16;
        this.physicsboxcollider.apply();
        this.currentType = Type.Small;
    }
    beReserve(){
        cc.audioEngine.playEffect(this.reserveClip, false);
        this.gameUI.updateLife(1);
    }

    beHurt(){
        switch (this.currentType) {
            case Type.Small:
                this.die();
                break;
            case Type.Big:
                this.turnToSmall();
                this.beSuper();
                break;
            default:
                break;
        }
    }

    beSuper(){
        this.node.opacity = 175;
        this.node.group = "Superplayer";
        cc.director.getScheduler().schedule(() => {
            this.node.opacity = 255;
            this.node.group = "Player";
        }, this, 2, 0, 0);
    }

    die(){
        this.node.removeComponent(cc.PhysicsBoxCollider);
        this.node.removeComponent(cc.RigidBody);
        this.setisJump(false);
        this.animation.stop();
        this.currentState = State.Die;
        console.log("die");

        //close the key event
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        //play the sound
        cc.audioEngine.stop(this.BgmID);
        let audioID = cc.audioEngine.play(this.dieClip, false, 1);
        cc.audioEngine.setFinishCallback(audioID, ()=>{
            if (this.action.isDone()) {
                this.node.destroy()
                this.gameUI.lose();
            }
        })
    }

    dieAnimation(){
        this.getComponent(cc.Sprite).spriteFrame = this.die_Frame;
        const moveUpAction = cc.moveTo(0.05, cc.v2(this.node.x, this.node.y + 10));
        const moveDownAction = cc.moveTo(0.35, cc.v2(this.node.x, -340));
        this.action = cc.sequence(moveUpAction, moveDownAction);
        this.node.runAction(this.action);
    }

    win(){
        this.node.removeComponent(cc.PhysicsBoxCollider);
        this.node.removeComponent(cc.RigidBody);
        this.setisJump(false);
        this.animation.stop();
        this.currentState = State.Win;
        let isChallenge: boolean = this.groundTime === 0 ? true : false;


        //close the key event
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        //play the sound
        cc.audioEngine.stop(this.BgmID);
        let audioID = cc.audioEngine.play(this.winClip, false, 1);
        cc.audioEngine.setFinishCallback(audioID, ()=>{
            if (this.action.isDone()) {
                this.node.destroy()
                this.gameUI.win(isChallenge);
                
            }
        })
    }

    winAnimation(){
        switch (this.currentType) {
            case Type.Small:
                this.getComponent(cc.Sprite).spriteFrame = this.win_Frame;
                break;
            case Type.Big:
                this.getComponent(cc.Sprite).spriteFrame = this.big_win_Frame;
                break;
            default:
                break;
        }
        const moveDownAction = cc.moveTo(1, cc.v2(this.node.x, -280));
        this.action = cc.sequence(moveDownAction, cc.delayTime(1));
        this.node.runAction(this.action);
    }

    getMarioState(){
        return this.currentState;
    }

    getMarioType(){
        return this.currentType;
    }

    //the animation control

    playAnimation() {
        if (this.currentState === State.Squat) {
            this.animation.stop();
            switch (this.currentType) {
                case Type.Small:
                    this.getComponent(cc.Sprite).spriteFrame = this.small_squatFrame;
                    break;
                case Type.Big:
                    this.node.anchorY = 0.7;
                    this.getComponent(cc.Sprite).spriteFrame = this.big_squatFrame;
                    break;
                default:
                    break;
            }
        } else if (this.isJump) {
            this.animation.stop();
            this.node.anchorY = 0.5;
            switch (this.currentType) {
                case Type.Small:
                    this.getComponent(cc.Sprite).spriteFrame = this.small_jumpFrame;
                    break;
                case Type.Big:
                    this.getComponent(cc.Sprite).spriteFrame = this.big_jumpFrame;
                    break;
                default:
                    break;
            }
        } else {
            this.node.anchorY = 0.5;
            switch(this.currentState){
                case State.Run:
                    switch (this.currentType) {
                        case Type.Small:
                            if (!this.animation.getAnimationState("Mario_run").isPlaying) {
                                this.animation.play("Mario_run");
                            }
                            break;
                        case Type.Big:
                            if (!this.animation.getAnimationState("Mario_big_run").isPlaying) {
                                this.animation.play("Mario_big_run");
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case State.Idle:
                    this.animation.stop();
                    switch (this.currentType) {
                        case Type.Small:
                            this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
                            break;
                        case Type.Big:
                            this.getComponent(cc.Sprite).spriteFrame = this.big_idleFrame;
                            break;
                        default:
                            break;
                    }
                    break;
                case State.Die:
                    if(!this.action){
                        this.dieAnimation();
                    }
                    break;
                case State.Win:
                    if(!this.action){
                        this.winAnimation();
                    }
                    break;
            }
        }
        
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicManager.gravity = cc.v2 (0, -350);
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (!this.debugMode) {
            this.node.position = this.rebournPos;
        }
        //play the background
        this.BgmID = cc.audioEngine.play(this.BgmClip, true, 1);
    }
    start() {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
    }

    update(dt:number){
        //move
        if (this.currentState === State.Run) {
            this.node.x += this.moveSpeed.x * this.moveDir * dt;
            this.node.scaleX = (this.moveDir >= 0) ? 1 : -1;
        }
        this.checkMarioPos();
        //animation
        this.playAnimation();
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }   


    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.node.name == 'Mushroom') {
            if (this.currentType !== Type.Big) {
                this.scheduleOnce(this.turnToBig, 0.1);
            }
        } else if(otherCollider.node.name == 'MushroomReserve'){
            this.scheduleOnce(this.beReserve, 0.1);
        } 
        else if (otherCollider.tag === 0 ) {
            if (contact.getWorldManifold().normal.y === -1) {
                this.setisJump(false);
                this.groundTime++;
                cc.log("touch the ground");
            }
        } else if (otherCollider.tag === 1) {
            if (contact.getWorldManifold().normal.y === -1) {
                this.setisJump(false);   
            }
        }
    }

    // onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        
    // }
    // start () {

    // }
    

    // update (dt) {}
}
