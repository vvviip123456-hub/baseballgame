# 棒球小遊戲 - 網路部署指南

## 🚀 快速部署方案

### 方案 1️⃣：用 Streamlit Cloud 部署（推薦 - 最簡單）

#### 前置準備
1. **GitHub 賬戶**：https://github.com
2. **Streamlit Cloud 賬戶**：https://streamlit.io/cloud

#### 部署步驟

```bash
# 1. 將項目推送到 GitHub
git add .
git commit -m "Add Streamlit deployment files"
git push origin main
```

2. **登錄 Streamlit Cloud**
   - 訪問 https://share.streamlit.io
   - 點擊「New app」
   - 選擇你的 GitHub repo（baseballgame）
   - 設置 `app.py` 作為主文件
   - 點擊「Deploy」

✅ **完成**！你將獲得一個公開網址，任何人都可以訪問

**優點**：
- 免費託管
- 自動更新（推送到 GitHub 後自動同步）
- 無需配置服務器
- 全球 CDN 加速

---

### 方案 2️⃣：用 GitHub Pages 部署（只有 HTML）

如果你只想部署 HTML 版本（效能更好）：

```bash
# 1. 在項目根目錄創建 gh-pages 分支
git checkout -b gh-pages

# 2. 確保 index.html、css/ 和 js/ 文件夾在根目錄
# 3. 推送到 GitHub
git push origin gh-pages

# 4. 在 GitHub repo 設置中啟用 GitHub Pages
# Settings → Pages → Source: gh-pages
```

**網址**：`https://vvviip123456-hub.github.io/baseballgame/`

**優點**：
- 效能最好（純靜態）
- 完全免費
- 無需服務器

---

### 方案 3️⃣：本地 Streamlit 運行（開發測試）

```bash
# 1. 安裝依賴
pip install streamlit

# 2. 運行應用
streamlit run app.py

# 3. 瀏覽器會自動打開
# 訪問：http://localhost:8501
```

**缺點**：
- 只能在開發機訪問
- 需要一直運行服務器

---

### 方案 4️⃣：部署到 Vercel 或 Netlify（HTML）

如果使用 HTML 版本：

#### Vercel 部署
```bash
# 安裝 Vercel CLI
npm install -g vercel

# 部署
vercel
```

#### Netlify 部署
1. 訪問 https://app.netlify.com
2. 拖拽項目文件夾上傳
3. 自動獲得公開網址

**優點**：
- 效能極快
- 全球 CDN
- 免費方案足夠

---

## 🌐 推薦部署方案排序

| 排名 | 方案 | 難度 | 效能 | 成本 | 推薦度 |
|------|------|------|------|------|--------|
| 1️⃣ | **Streamlit Cloud** | ⭐ 簡單 | ⭐⭐⭐ | 免費 | ⭐⭐⭐⭐⭐ |
| 2️⃣ | GitHub Pages | ⭐ 簡單 | ⭐⭐⭐⭐⭐ | 免費 | ⭐⭐⭐⭐ |
| 3️⃣ | Vercel | ⭐⭐ 簡單 | ⭐⭐⭐⭐⭐ | 免費 | ⭐⭐⭐⭐ |
| 4️⃣ | Netlify | ⭐⭐ 簡單 | ⭐⭐⭐⭐ | 免費 | ⭐⭐⭐ |
| 5️⃣ | 本地 Streamlit | ⭐ 簡單 | ⭐⭐ | 免費 | ⭐⭐ |

---

## 📋 環境要求

### 用 Streamlit 部署需要
- `streamlit >= 1.0`
- `python >= 3.7`

### 用 HTML 版本部署（GitHub Pages / Vercel / Netlify）無需任何依賴

---

## 📦 project 文件結構

```
baseballgame/
├── index.html           # HTML 主文件（GitHub Pages / Vercel / Netlify 用）
├── app.py              # Streamlit 應用（Streamlit Cloud 用）
├── css/
│   └── style.css
├── js/
│   ├── game.js
│   ├── pitcher.js
│   ├── batter.js
│   └── leaderboard.js
├── .streamlit/
│   └── config.toml     # Streamlit 配置（可選）
└── README.md
```

---

## 🔧 Streamlit 配置（可選）

如果部署到 Streamlit Cloud，可創建 `.streamlit/config.toml`：

```toml
[theme]
primaryColor = "#667eea"
backgroundColor = "#f0f0f0"
secondaryBackgroundColor = "#f0f0f0"
textColor = "#333333"
font = "sans serif"

[client]
showErrorDetails = true

[logger]
level = "info"
```

---

## 🔐 分享部署的遊戲

部署後，分享以下信息給朋友：

### Streamlit Cloud
```
🎮 棒球小遊戲 - 線上版本
點擊打開：https://[your-username]-baseballgame.streamlit.app/
```

### GitHub Pages
```
🎮 棒球小遊戲 - 線上版本
點擊打開：https://vvviip123456-hub.github.io/baseballgame/
```

---

## 📊 訪問統計（Streamlit Cloud）

部署後，在 Streamlit Cloud 的儀表板可看到：
- 訪問次數
- 用戶來源
- 平均加載時間
- 錯誤日誌

---

## 🆘 常見問題

### Q: 排行榜數據會消失嗎？
**A**: 
- HTML 版本（GitHub Pages/Vercel）：保存在本地瀏覽器 localStorage，每個用戶獨立
- Streamlit 版本：也是保存在用戶的瀏覽器，不上傳到服務器

### Q: 能支持多人使用嗎？
**A**: 完全支持！每個訪問者都獨立運行遊戲，互不影響

### Q: 如何同步更新？
**A**:
- GitHub Pages：提交代碼即自動更新
- Streamlit Cloud：同樣自動同步 GitHub 推送
- Vercel/Netlify：需重新部署或配置自動部署

### Q: 需要付費嗎？
**A**: 不需要，所有推薦方案都完全免費

---

## 🚀 立即開始

**我推薦：Streamlit Cloud** 🏆

1. 推送代碼到 GitHub
2. 登錄 Streamlit Cloud
3. 一鍵部署
4. 分享公開網址

就這麼簡單！⚾
