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
        
        // 打击区范围（虚线框范围）：y 在 213-238 之间
        // 这是打者身前的虚线框区域（打者身高的一半）
        const strikeZoneTop = 213;
        const strikeZoneBottom = 238;
        const strikeZoneCenter = (strikeZoneTop + strikeZoneBottom) / 2;  // 225.5
        
        // 根据投球类型设置速度和变化量
        switch(pitchType) {
            case 'fastball':  // 快球 - 速度快，变化小，最容易打
                speed = 8 + Math.random() * 2;  // 速度 8-10
                curve = Math.random() * 8 - 4;  // 变化 -4 到 4（极小变化）
                initialY = strikeZoneCenter + (Math.random() * 10 - 5);  // 在虚线框内
                break;
            case 'slowball':  // 慢球 - 速度慢，变化中等，需要耐心
                speed = 3 + Math.random() * 2;  // 速度 3-5
                curve = Math.random() * 12 - 6;  // 变化 -6 到 6
                initialY = strikeZoneCenter + (Math.random() * 15 - 7.5);  // 在虚线框上下各 7.5px
                break;
            case 'curveball':  // 变化球 - 速度中等，变化自然，最难打
                speed = 5 + Math.random() * 2;  // 速度 5-7
                curve = Math.random() * 14 - 7;  // 变化 -7 到 7（自然的弧度）
                initialY = strikeZoneCenter + (Math.random() * 20 - 10);  // 在虚线框上下各 10px
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
        
        // 应用变化（在接近打者时减弱变化，防止球跑出范围）
        if (this.ball.x < 600) {
            // 前半段：正常变化
            this.ball.vy += this.ball.curve * 0.01;
        } else {
            // 后半段（在打击区附近）：减弱变化，确保球在虚线框范围内
            this.ball.vy += this.ball.curve * 0.004;
        }
        
        this.ball.y += this.ball.vy;

        // 确保球不会离开虚线框范围上下边界
        // 虚线框范围：Y 在 213-238 之间（打者身高的一半，25px）
        // 但允许稍大范围（205-245），防止在飞行中被强制限制
        const minY = 205;
        const maxY = 245;
        
        if (this.ball.y < minY) {
            this.ball.y = minY;
            this.ball.vy *= -0.2;  // 反弹效果很弱
        }
        if (this.ball.y > maxY) {
            this.ball.y = maxY;
            this.ball.vy *= -0.2;  // 反弹效果很弱
        }

        // 当球到达打击点（x > 680）时，确保球在虚线框范围内
        if (this.ball.x > 680 && this.ball.x < 750) {
            const strikeZoneTop = 213;
            const strikeZoneBottom = 238;
            
            if (this.ball.y < strikeZoneTop) {
                this.ball.y = strikeZoneTop;
            }
            if (this.ball.y > strikeZoneBottom) {
                this.ball.y = strikeZoneBottom;
            }
        }

        // 球离开画面判定（球超过场景右边界）
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
