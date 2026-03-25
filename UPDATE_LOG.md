# 棒球小遊戲 - 更新說明

## 修改內容

### 1️⃣ 投手投球確保打者能打到 (pitcher.js)

**修改 `updateBall()` 方法**
- 當球接近打者位置（x > 600）時，強制限制球的 Y 座標在打擊區範圍（150-250）內
- 如果球超出範圍，會自動反彈回範圍內，模擬球的自然行為
- 這確保了無論投球有多大變化，球總是在打者可以打到的位置

```javascript
if (this.ball.x > 600) {
    const strikeZoneTop = 150;
    const strikeZoneBottom = 250;
    
    // 自動限制球在打擊區內
    if (this.ball.y < strikeZoneTop) {
        this.ball.y = strikeZoneTop;
        this.ball.vy *= -0.5;
    }
    if (this.ball.y > strikeZoneBottom) {
        this.ball.y = strikeZoneBottom;
        this.ball.vy *= -0.5;
    }
}
```

### 2️⃣ 打者往投手方向揮棒 (batter.js)

**修改球棒的初始角度和揮棒范圍**
- 初始角度從 `-45°` 改為 `135°`（往左上方指向投手）
- 揮棒范圍從 `[-45°, 45°]` 改為 `[135°, 225°]`（往投手方向揮）
- 這使打者的挥棒动作更加符合棒球规则

```javascript
// 球棒初始角度
this.batAngle = 135;  // 指向投手方向（左上方）

// 揮棒時，角度從 135° 摆动到 225°（往投手方向揮）
angle = this.batAngle + (this.swingProgress * 90);
```

### 3️⃣ 每2秒投1球，10球為一局 (game.js)

**新增計時系統**
- 新增 `lastPitchTime` - 記錄上次投球時間
- 新增 `pitchInterval` - 投球間隔（默認 2000ms 即 2 秒）
- 新增 `isWaitingForNextPitch` - 等待投下一球的標誌

**新增 `checkNextPitch()` 方法**
- 定期檢查是否該投下一球
- 確保每次投球間隔 2 秒
- 只有投滿 10 球後才結束本局

```javascript
checkNextPitch() {
    if (this.gameState !== 'playing') return;
    
    // 如果没有球在飘行且没有刚击中球
    if (!this.pitcher.ball && !this.ballHit) {
        if (!this.isWaitingForNextPitch) {
            this.isWaitingForNextPitch = true;
            this.lastPitchTime = Date.now();
        }
        
        // 等待投球间隔后投下一球
        const currentTime = Date.now();
        if (currentTime - this.lastPitchTime >= this.pitchInterval) {
            this.startNewPitch();
        }
    }
}
```

**修改 `update()` 方法**
- 在每幀更新中呼叫 `checkNextPitch()`
- 確保球離開打擊區後立即清除
- 保證流暢的遊戲節奏

**修改 `checkHit()` 方法**
- 击中球後立即清除球對象
- 重置 `ballHit` 標誌為 `false`
- 更新 UI 顯示最新分數

## 遊戲流程

```
初始化
  ↓
第 1 球投出 (t=0s)
  ↓ 等待 2 秒
第 2 球投出 (t=2s)
  ↓ 等待 2 秒
...
  ↓
第 10 球投出 (t=18s)
  ↓
計算本局總分
  ↓
顯示結果 → 進行下一局 / 查看排行榜
```

## 特點

✅ **公平的打擊環境** - 無論球速多快或變化多大，球總是在可打擊範圍內
✅ **真實的挥棒動作** - 打者向投手方向揮棒
✅ **規律的遊戲節奏** - 每 2 秒一球，共 10 球一局
✅ **清晰的分數統計** - 实时显示本局分数和投球进度

## 測試建議

1. 按 SPACE 鍵在不同時機挥棒，測試計分機制
2. 觀察球是否總是在打擊區內（即使有極大變化）
3. 驗證每 2 秒自動投一球
4. 確認 10 球後局結束並計算總分
5. 檢查排行榜是否正確記錄局數和得分
