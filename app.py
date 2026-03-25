import streamlit as st
import os

st.set_page_config(
    page_title="⚾ 棒球小遊戲",
    page_icon="⚾",
    layout="wide"
)

st.title("⚾ 棒球小遊戲")
st.write("按 **SPACE** 鍵揮棒，根據時機獲得分數！")

# 讀取遊戲檔案
try:
    with open('css/style.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    with open('js/pitcher.js', 'r', encoding='utf-8') as f:
        pitcher_js = f.read()
    
    with open('js/batter.js', 'r', encoding='utf-8') as f:
        batter_js = f.read()
    
    with open('js/leaderboard.js', 'r', encoding='utf-8') as f:
        leaderboard_js = f.read()
    
    with open('js/game.js', 'r', encoding='utf-8') as f:
        game_js = f.read()
    
    # 構建完整的 HTML
    html_content = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        {css_content}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="game-info">
                <div class="info-item">
                    <span class="label">局數：</span>
                    <span class="value" id="inning">1</span>
                </div>
                <div class="info-item">
                    <span class="label">第幾球：</span>
                    <span class="value" id="pitchCount">0/10</span>
                </div>
                <div class="info-item">
                    <span class="label">局得分：</span>
                    <span class="value" id="currentScore">0</span>
                </div>
            </div>

            <canvas id="gameCanvas" width="800" height="400"></canvas>

            <div class="game-instructions">
                <p><strong>按下 SPACE 鍵揮棒！</strong></p>
                <p>🎯 根據揮棒時機獲得分數</p>
                <ul>
                    <li>⭐⭐⭐ 完美：150分</li>
                    <li>⭐⭐ 很好：100分</li>
                    <li>⭐ 良好：50分</li>
                    <li>未擊中：0分</li>
                </ul>
            </div>

            <div id="roundResult" class="round-result hidden">
                <h2>局結束！</h2>
                <p>本局得分: <span id="roundScore">0</span></p>
                <button id="nextRoundBtn">進行下一局</button>
                <button id="viewLeaderboardBtn">查看排行榜</button>
            </div>
        </div>

        <div id="leaderboard" class="leaderboard hidden">
            <div class="leaderboard-content">
                <h2>🏆 排行榜</h2>
                <div class="leaderboard-body">
                    <table>
                        <thead>
                            <tr>
                                <th>排名</th>
                                <th>局數</th>
                                <th>得分</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboardTable">
                        </tbody>
                    </table>
                </div>
                <div class="leaderboard-actions">
                    <button id="backToGameBtn">返回遊戲</button>
                    <button id="resetLeaderboardBtn">重置排行榜</button>
                </div>
            </div>
        </div>

        <script>
        {pitcher_js}
        {batter_js}
        {leaderboard_js}
        {game_js}
        </script>
    </body>
    </html>
    """
    
    # 嵌入遊戲
    st.components.v1.html(html_content, height=800, scrolling=False)
    
except FileNotFoundError as e:
    st.error(f"❌ 找不到遊戲文件：{e}")
    st.write("請確保 css/style.css 和 js/ 目錄中的文件存在")

st.markdown("---")

st.subheader("📋 遊戲說明")
col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    #### 🎯 基本規則
    - 每局 **10 次打擊**
    - 每 **2 秒投 1 球**
    - 按 **SPACE 揮棒**
    - 根據時機計分
    """)

with col2:
    st.markdown("""
    #### 💯 計分方式
    - ⭐⭐⭐ 完美（150分）
    - ⭐⭐ 很好（100分）
    - ⭐ 良好（50分）
    - ❌ 未擊中（0分）
    """)


