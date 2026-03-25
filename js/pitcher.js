/**
 * 投手类 - 控制投球逻辑
 */
class Pitcher {
    constructor() {
        this.x = 100;  // 投手位置 X
        this.y = 200;  // 投手位置 Y
        this.width = 40;
        this.height = 50;
        
        // 当前球的状态
        this.ball = null;
        this.pitchTypes = ['fastball', 'slowball', 'curveball'];  // 投球类型
    }

    /**
     * 投出新球
     */
    throwBall() {
        const pitchType = this.pitchTypes[Math.floor(Math.random() * this.pitchTypes.length)];
        
        let speed, curve, initialY; 
        
        // 打击区范围：y 在 150-250 之间
        // 投球的初始高度应该在打击区范围内或附近
        const strikeZoneTop = 150;
        const strikeZoneBottom = 250;
        const strikeZoneCenter = (strikeZoneTop + strikeZoneBottom) / 2;  // 200
        
        // 根据投球类型设置速度和变化量
        // 确保球总是从打击区附近投出，即使有变化也能被打到
        switch(pitchType) {
            case 'fastball':  // 快球 - 速度快，变化小
                speed = 8 + Math.random() * 2;  // 速度 8-10
                curve = Math.random() * 15 - 7.5;  // 变化 -7.5 到 7.5（减小变化）
                initialY = strikeZoneCenter + (Math.random() * 20 - 10);  // 在 190-210 范围内
                break;
            case 'slowball':  // 慢球 - 速度慢，变化中等
                speed = 3 + Math.random() * 2;  // 速度 3-5
                curve = Math.random() * 25 - 12.5;  // 变化 -12.5 到 12.5（减小变化）
                initialY = strikeZoneCenter + (Math.random() * 30 - 15);  // 在 185-215 范围内
                break;
            case 'curveball':  // 变化球 - 速度中等，变化较大但可控
                speed = 5 + Math.random() * 2;  // 速度 5-7
                curve = Math.random() * 35 - 17.5;  // 变化 -17.5 到 17.5（控制在合理范围）
                initialY = strikeZoneCenter + (Math.random() * 40 - 20);  // 在 180-220 范围内
                break;
        }

        this.ball = {
            x: this.x + this.width,
            y: initialY,
            vx: speed,
            vy: 0,
            curve: curve,
            radius: 8,
            type: pitchType,
            speed: speed,
            hitZoneFrame: null  // 进入打击区的帧数
        };
    }

    /**
     * 更新球的位置
     */
    updateBall() {
        if (!this.ball) return;

        // 球向右运动
        this.ball.x += this.ball.vx;
        
        // 应用变化
        this.ball.vy += this.ball.curve * 0.01;
        this.ball.y += this.ball.vy;

        // 确保球在打者范围内：当球接近打者（x > 600）时，强制限制y在打击区范围内
        if (this.ball.x > 600) {
            const strikeZoneTop = 150;
            const strikeZoneBottom = 250;
            
            // 如果球超出范围，将其拉回范围内
            if (this.ball.y < strikeZoneTop) {
                this.ball.y = strikeZoneTop;
                this.ball.vy *= -0.5;  // 反弹效果
            }
            if (this.ball.y > strikeZoneBottom) {
                this.ball.y = strikeZoneBottom;
                this.ball.vy *= -0.5;  // 反弹效果
            }
        }

        // 球离开画面判定
        if (this.ball.x > 850) {
            this.ball = null;
        }
    }

    /**
     * 绘制投手
     */
    draw(ctx) {
        // 投手身体
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 投手头部
        ctx.fillStyle = '#fdbcb4';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // 投来的球
        if (this.ball) {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#dc143c';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 缝线
            ctx.strokeStyle = '#dc143c';
            ctx.lineWidth = 1;
            for (let i = 0; i < 2; i++) {
                ctx.beginPath();
                ctx.arc(this.ball.x, this.ball.y, this.ball.radius - 2, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    /**
     * 检查球是否到达打击区
     */
    isInStrikeZone() {
        if (!this.ball) return false;
        
        // 打击区的范围：x在 600-650 之间，y在 150-250 之间
        return this.ball.x >= 600 && this.ball.x <= 650 &&
               this.ball.y >= 150 && this.ball.y <= 250;
    }
}
