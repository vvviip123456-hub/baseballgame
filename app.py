import streamlit as st

st.set_page_config(
    page_title="⚾ 棒球小遊戲",
    page_icon="⚾",
    layout="wide"
)

st.title("⚾ 棒球小遊戲")
st.write("網頁版棒球遊戲 - 按 SPACE 揮棒，根據時機獲得分數！")

# 嵌入指向 HTML 版本的連結
col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.info("🎮 **點擊下方連結開始遊戲**", icon="👇")
    st.markdown("""
    ### [🎯 開始遊戲 - 點擊進入](http://localhost:8000)
    
    或在新標籤頁開啟：http://localhost:8000
    """)

st.markdown("---")

# 遊戲說明
st.subheader("📋 遊戲規則")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    #### 🎯 基本玩法
    - **每局 10 次打擊**
    - **每 2 秒投 1 球**
    - **按 SPACE 揮棒**
    - **根據時機計分**
    """)

with col2:
    st.markdown("""
    #### 💯 計分方式
    - ⭐⭐⭐ 完美：150 分
    - ⭐⭐ 很好：100 分  
    - ⭐ 良好：50 分
    - ❌ 未擊中：0 分
    """)

st.markdown("---")

st.subheader("🎪 球種特性")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
    #### 🚀 快球
    - 速度：快
    - 變化：小
    - 難度：⭐
    """)

with col2:
    st.markdown("""
    #### 🐢 慢球
    - 速度：慢
    - 變化：中
    - 難度：⭐⭐
    """)

with col3:
    st.markdown("""
    #### 🌀 變化球
    - 速度：中
    - 變化：大
    - 難度：⭐⭐⭐
    """)

st.markdown("---")

st.subheader("🏆 排行榜")
st.write("""
遊戲會自動保存你的每局成績。
在遊戲中點擊「查看排行榜」可以查看所有紀錄。

**目標分數：1500 分（全滿分）**
""")

st.markdown("""
---
<div style="text-align: center; color: #888; font-size: 12px;">
Made with ❤️ | 棒球小遊戲
</div>
""", unsafe_allow_html=True)

