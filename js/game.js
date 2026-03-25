/**
 * 棒球小游戏 - 主游戏类
 */
class BaseballGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏对象
        this.pitcher = new Pitcher();
        this.batter = new Batter();
        this.leaderboard = new Leaderboard();
        
        // 游戏状态
        this.inning = 1;  // 局数
        this.pitchCount = 0;  // 当前球数
        this.maxPitches = 10;  // 每局最多投球数
        this.roundScore = 0;  // 本局得分
        this.totalScore = 0;  // 本局总得分
        
        // 游戏流程状态
        this.gameState = 'playing';  // 'playing', 'roundEnd', 'leaderboard'
        this.ballHit = false;  // 是否击中球
        this.hitFrame = 0;  // 击球的帧数
        this.hitDisplayFrames = 0;  // 显示击球评价的帧数
        
        // 动画相关
        this.hitBallVelocity = null;  // 击出球的速度
        this.hitFrameCount = 0;  // 击球后的帧数
        
        // 计时相关
        this.lastPitchTime = Date.now();  // 上一次投球的时间
        this.pitchInterval = 2000;  // 投球间隔（毫秒） - 每2秒投1球
        this.isWaitingForNextPitch = false;  // 是否等待下一球
        
        // 键盘状态
        this.keysPressed = {};
        
        // 初始化
        this.setup();
    }

    /**
     * 初始化游戏
     */
    setup() {
        // 监听键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // 按钮事件
        document.getElementById('nextRoundBtn').addEventListener('click', () => this.nextRound());
        document.getElementById('viewLeaderboardBtn').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('backToGameBtn').addEventListener('click', () => this.hideLeaderboard());
        document.getElementById('resetLeaderboardBtn').addEventListener('click', () => this.resetLeaderboard());
        
        // 调整 canvas 大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 开始游戏循环
        this.startNewPitch();
        this.update();
    }

    /**
     * 响应键盘按下
     */
    handleKeyDown(e) {
        this.keysPressed[e.code] = true;
        
        // Space 键 - 挥棒
        if (e.code === 'Space' && this.gameState === 'playing') {
            e.preventDefault();
            this.batter.swing();
        }
    }

    /**
     * 响应键盘释放
     */
    handleKeyUp(e) {
        this.keysPressed[e.code] = false;
    }

    /**
     * 调整 canvas 大小以适应容器
     */
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // 保持宽高比
        const targetHeight = (rect.width / 800) * 400;
        this.canvas.style.height = targetHeight + 'px';
    }

    /**
     * 开始新投球
     */
    startNewPitch() {
        if (this.pitchCount >= this.maxPitches) {
            // 局结束
            this.endRound();
            return;
        }
        
        this.pitcher.throwBall();
        this.ballHit = false;
        this.hitBallVelocity = null;
        this.hitFrameCount = 0;
        this.pitchCount++;
        this.lastPitchTime = Date.now();
        this.isWaitingForNextPitch = false;
        
        this.updateUI();
    }

    /**
     * 检查是否该投下一球
     */
    checkNextPitch() {
        if (this.gameState !== 'playing') return;
        
        // 如果没有球在飞行，检查是否该投下一球
        if (!this.pitcher.ball && !this.ballHit) {
            if (!this.isWaitingForNextPitch) {
                this.isWaitingForNextPitch = true;
                this.lastPitchTime = Date.now();
            }
            
            // 如果距离上一次投球已经过了投球间隔，投下一球
            const currentTime = Date.now();
            if (currentTime - this.lastPitchTime >= this.pitchInterval) {
                this.startNewPitch();
            }
        }
    }

    /**
     * 判断击球是否成功
     */
    checkHit() {
        if (this.ballHit || !this.pitcher.ball) return;
        
        // 检测球棒是否击中球
        if (this.batter.isSwinging && 
            this.batter.hitBall(this.pitcher.ball)) {
            
            this.ballHit = true;
            this.hitFrame = this.batter.swingProgress;
            
            // 根据击棒时机计算质量
            const quality = this.batter.calculateHitQuality(this.hitFrame);
            const score = this.calculateScore(quality);
            
            this.roundScore += score;
            this.totalScore = this.roundScore;  // 累加总分
            
            console.log(`击中球！质量: ${quality.toFixed(2)}, 得分: ${score}`);
            
            // 计算击出球的速度
            this.hitBallVelocity = {
                x: 10 + quality * 5,  // 击出距离取决于质量
                y: -5,
                distance: 50 + quality * 150  // 击球距离
            };
            
            // 更新UI显示当前分数
            this.updateUI();
        }
    }

    /**
     * 根据击球质量计算得分
     */
    calculateScore(quality) {
        if (quality >= 0.8) return 150;  // 完美 150分
        if (quality >= 0.5) return 100;  // 很好 100分
        if (quality >= 0.3) return 50;   // 良好 50分
        return 0;                         // 未击中或很差 0分
    }

    /**
     * 更新游戏逻辑
     */
    update() {
        if (this.gameState === 'playing') {
            // 检查是否投下一球
            this.checkNextPitch();
            
            // 更新投手球
            this.pitcher.updateBall();
            
            // 更新打击手挥棒
            this.batter.updateSwing();
            
            // 检测击球
            this.checkHit();
            
            // 显示击球评价几帧后，清除球继续下一球
            if (this.ballHit) {
                this.hitDisplayFrames++;
                if (this.hitDisplayFrames > 60) {  // 显示 60 帧（约 1 秒）
                    this.pitcher.ball = null;
                    this.ballHit = false;
                    this.hitDisplayFrames = 0;
                }
            }
            
            // 球离开打击区，判定为未击中（球超过打者位置之后）
            if (!this.ballHit && this.pitcher.ball && 
                this.pitcher.ball.x > 750) {
                // 错过了这一球，清除球，等待下一球
                this.pitcher.ball = null;
            }
        }

        // 绘制游戏画面
        this.draw();
        
        // 继续游戏循环
        requestAnimationFrame(() => this.update());
    }

    /**
     * 绘制游戏画面
     */
    draw() {
        // 清空画布
        this.ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制投手和打击手
        this.pitcher.draw(this.ctx);
        this.batter.draw(this.ctx);
        
        // 绘制打击范围的虚线框（打者身前的球棒可打击范围）
        // 虚线框：宽度50px，高度是打者身高(50px)的一半(25px)，在打者身前
        this.ctx.strokeStyle = '#FFD700';  // 金色虚线框
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([8, 5]);  // 虚线样式
        
        const strikeBoxX = 680;  // 打者身前的 X 位置
        const strikeBoxY = 213;  // 打者身体中心向上 12px（身高的1/4）
        const strikeBoxWidth = 70;  // 虚线框宽度
        const strikeBoxHeight = 25;  // 虚线框高度（打者身高的一半）
        
        this.ctx.strokeRect(strikeBoxX, strikeBoxY, strikeBoxWidth, strikeBoxHeight);
        this.ctx.setLineDash([]);  // 恢复实线
        
        // 绘制分数提示
        this.drawScoreDisplay();
    }

    /**
     * 绘制分数显示
     */
    drawScoreDisplay() {
        if (this.ballHit && this.hitFrame !== 0) {
            const quality = this.batter.calculateHitQuality(this.hitFrame);
            let text = '';
            let color = '';
            
            if (quality >= 0.8) {
                text = '⭐⭐⭐ 完美！';
                color = '#FFD700';
            } else if (quality >= 0.5) {
                text = '⭐⭐ 很好！';
                color = '#FFA500';
            } else if (quality >= 0.3) {
                text = '⭐ 良好！';
                color = '#87CEEB';
            }
            
            if (text) {
                this.ctx.font = 'bold 28px Arial';
                this.ctx.fillStyle = color;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(text, this.canvas.width / 2, 80);
            }
        }
    }

    /**
     * 更新 UI 信息
     */
    updateUI() {
        document.getElementById('inning').textContent = this.inning;
        document.getElementById('pitchCount').textContent = `${this.pitchCount}/${this.maxPitches}`;
        document.getElementById('currentScore').textContent = this.roundScore;
    }

    /**
     * 局结束
     */
    endRound() {
        this.gameState = 'roundEnd';
        
        // 保存分数到排行榜
        this.leaderboard.addScore(this.inning, this.roundScore);
        
        // 显示局结果
        LeaderboardUI.showRoundResult(this.roundScore);
    }

    /**
     * 开始下一局
     */
    nextRound() {
        LeaderboardUI.hideRoundResult();
        
        this.inning++;
        this.pitchCount = 0;
        this.roundScore = 0;
        this.gameState = 'playing';
        
        this.updateUI();
        this.startNewPitch();
    }

    /**
     * 显示排行榜
     */
    showLeaderboard() {
        this.gameState = 'leaderboard';
        this.leaderboard.render();
        LeaderboardUI.show();
    }

    /**
     * 隐藏排行榜
     */
    hideLeaderboard() {
        this.gameState = 'playing';
        LeaderboardUI.hide();
    }

    /**
     * 重置排行榜
     */
    resetLeaderboard() {
        if (window.confirm('确定要清空排行榜吗？此操作无法撤销。')) {
            this.leaderboard.clear();
            this.leaderboard.render();
        }
    }
}

/**
 * 页面加载完成后启动游戏
 */
document.addEventListener('DOMContentLoaded', () => {
    const game = new BaseballGame();
});
