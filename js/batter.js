/**
 * 打击手类 - 玩家控制
 */
class Batter {
    constructor() {
        this.x = 650;  // 打击手位置 X
        this.y = 200;  // 打击手位置 Y
        this.width = 40;
        this.height = 50;
        
        // 挥棒状态
        this.isSwinging = false;
        this.swingProgress = 0;  // 0-1，表示挥棒进度
        this.swingDuration = 6;  // 挥棒持续帧数（6帧 ≈ 0.1秒，按60fps计算）
        this.swingStartFrame = 0;
        
        // 球棒
        this.batLength = 50;
        this.batAngle = 135;  // 初始角度（度）- 往投手方向指向（左上方）
    }

    /**
     * 开始挥棒
     */
    swing() {
        if (!this.isSwinging) {
            this.isSwinging = true;
            this.swingProgress = 0;
            this.swingStartFrame = 0;
        }
    }

    /**
     * 更新挥棒动作
     */
    updateSwing() {
        if (this.isSwinging) {
            this.swingProgress += 1 / this.swingDuration;
            
            if (this.swingProgress >= 1) {
                this.isSwinging = false;
                this.swingProgress = 0;
            }
        }
    }

    /**
     * 获取当前球棒位置（用于碰撞检测）
     */
    getBatPosition() {
        // 计算球棒对应的挥棒角度
        let angle = this.batAngle;
        
        if (this.isSwinging) {
            // 挥棒时，角度从 135 度摆动到 225 度（往投手方向挥）
            angle = this.batAngle + (this.swingProgress * 90);
        }
        
        const rad = angle * Math.PI / 180;
        const batX = this.x + this.width / 2 + Math.cos(rad) * this.batLength;
        const batY = this.y + this.height / 2 + Math.sin(rad) * this.batLength;
        
        return { x: batX, y: batY, angle: angle };
    }

    /**
     * 检测是否击中球
     */
    hitBall(ball) {
        if (!ball) return false;
        
        const batPos = this.getBatPosition();
        const batStartX = this.x + this.width / 2;
        const batStartY = this.y + this.height / 2;
        
        // 计算球与球棒的距离
        const dx = ball.x - batStartX;
        const dy = ball.y - batStartY;
        
        // 使用点线距离公式检测
        const dist = this.pointToLineDistance(
            ball.x, ball.y,
            batStartX, batStartY,
            batPos.x, batPos.y
        );
        
        return dist < ball.radius + 5;  // 考虑球棒宽度
    }

    /**
     * 计算点到线段的距离
     */
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;

        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 绘制打击手和球棒
     */
    draw(ctx) {
        // 打击手身体
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 打击手头部
        ctx.fillStyle = '#fdbcb4';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // 球棒
        const batPos = this.getBatPosition();
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
        ctx.lineTo(batPos.x, batPos.y);
        ctx.stroke();
    }

    /**
     * 计算击球质量（0-1，1表示完美）
     * 基于挥棒进度和球在打击区的时间
     */
    calculateHitQuality(swingProgressAtHit) {
        // 完美击球时间在挥棒进度的 30% - 60%
        const perfectZoneMin = 0.3;
        const perfectZoneMax = 0.6;
        
        if (swingProgressAtHit < perfectZoneMin) {
            // 太早
            return 0.3;  // 50分
        } else if (swingProgressAtHit <= perfectZoneMax) {
            // 完美区间，靠近中点更好
            const center = (perfectZoneMin + perfectZoneMax) / 2;
            const distance = Math.abs(swingProgressAtHit - center);
            return 1 - (distance / ((perfectZoneMax - perfectZoneMin) / 2));
        } else {
            // 太晚
            return 0.3;  // 50分
        }
    }
}
