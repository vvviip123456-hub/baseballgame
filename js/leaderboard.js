/**
 * 排行榜类 - 管理游戏记录
 */
class Leaderboard {
    constructor() {
        this.scores = this.loadScores();
    }

    /**
     * 从 localStorage 加载排行榜
     */
    loadScores() {
        const saved = localStorage.getItem('baseballGameScores');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    /**
     * 保存排行榜到 localStorage
     */
    saveScores() {
        localStorage.setItem('baseballGameScores', JSON.stringify(this.scores));
    }

    /**
     * 添加新记录
     */
    addScore(inning, score) {
        this.scores.push({
            inning: inning,
            score: score,
            date: new Date().toLocaleString('zh-TW')
        });
        
        // 按照得分从高到低排序
        this.scores.sort((a, b) => b.score - a.score);
        
        // 只保留前 20 个记录
        if (this.scores.length > 20) {
            this.scores = this.scores.slice(0, 20);
        }
        
        this.saveScores();
    }

    /**
     * 获取排序后的排行榜（添加排名）
     */
    getRankedScores() {
        return this.scores.map((score, index) => ({
            ...score,
            rank: index + 1
        }));
    }

    /**
     * 清空排行榜
     */
    clear() {
        this.scores = [];
        this.saveScores();
    }

    /**
     * 渲染排行榜到页面
     */
    render() {
        const tableBody = document.getElementById('leaderboardTable');
        tableBody.innerHTML = '';

        const rankedScores = this.getRankedScores();
        
        if (rankedScores.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3" style="color: #999;">目前没有记录</td>';
            tableBody.appendChild(row);
            return;
        }

        rankedScores.forEach(record => {
            const row = document.createElement('tr');
            let medal = '';
            
            if (record.rank === 1) medal = '🥇 ';
            else if (record.rank === 2) medal = '🥈 ';
            else if (record.rank === 3) medal = '🥉 ';
            
            row.innerHTML = `
                <td>${medal}${record.rank}</td>
                <td>${record.inning}</td>
                <td style="font-weight: bold; color: #667eea;">${record.score}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

/**
 * UI 辅助函数
 */
const LeaderboardUI = {
    /**
     * 显示排行榜
     */
    show() {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.classList.remove('hidden');
    },

    /**
     * 隐藏排行榜
     */
    hide() {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.classList.add('hidden');
    },

    /**
     * 显示局结果
     */
    showRoundResult(score) {
        const roundResult = document.getElementById('roundResult');
        document.getElementById('roundScore').textContent = score;
        roundResult.classList.remove('hidden');
    },

    /**
     * 隐藏局结果
     */
    hideRoundResult() {
        const roundResult = document.getElementById('roundResult');
        roundResult.classList.add('hidden');
    }
};
