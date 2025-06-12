<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 主要內容區域 -->
        <div class="footer-main">
          <!-- 聯繫區域 -->
          <div class="contact-section">
            <h4>📝 與我聯繫</h4>
            <p>有任何建議或意見嗎？歡迎填寫回饋表單！</p>
            <a
              href="mailto:orion@lineagew-labs.com?subject=LineageW-Labs意見回饋&body=親愛的Orion，%0A%0A我對工具有以下建議：%0A%0A"
              class="feedback-link"
            >
              📧 點擊寄送意見回饋
            </a>
          </div>

          <!-- 版權和連結區域 -->
          <div class="info-section">
            <div class="links-section">
              <span class="version-info">V3.0</span>
            </div>
            <div class="author-info">Created by <strong>Orion</strong></div>
            <div class="copyright-info">&copy; 2025 OrionLabs. All rights reserved.</div>
            <p class="footer-note">本工具僅供參考，實際遊戲數據可能有所差異</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer 組件不需要額外邏輯
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-top: 3px solid #3498db;
  padding: 2rem 0 1rem;
  margin-top: auto;
  color: #ecf0f1;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;
}

.contact-section {
  flex: 1;
  max-width: 400px;
}

.contact-section h4 {
  color: #3498db;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.contact-section p {
  color: #bdc3c7;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.feedback-link {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.feedback-link:hover {
  background: linear-gradient(135deg, #2980b9, #1abc9c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.info-section {
  text-align: right;
  color: #bdc3c7;
}

.links-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.version-info {
  color: #95a5a6;
  font-size: 0.9rem;
}

.author-info {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.copyright-info {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.footer-note {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 1rem;
  margin-bottom: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .footer-container {
    padding: 0 1rem;
  }

  .footer-main {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    align-items: center;
  }

  .contact-section {
    max-width: 100%;
    width: 100%;
  }

  .info-section {
    text-align: center;
    width: 100%;
  }

  .links-section {
    justify-content: center;
  }

  .contact-section h4 {
    font-size: 1.1rem;
  }

  .app-footer {
    margin-bottom: 80px; /* 為手機版底部導航留空間 */
    padding: 1.5rem 0 1rem;
  }
}

/* 極小螢幕優化 */
@media (max-width: 480px) {
  .footer-container {
    padding: 0 0.5rem;
  }

  .footer-main {
    gap: 1rem;
  }

  .contact-section h4 {
    font-size: 1rem;
  }

  .contact-section p {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .feedback-link {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }

  .footer-note {
    font-size: 0.75rem;
  }
}

/* 大螢幕優化 */
@media (min-width: 1024px) {
  .footer-container {
    padding: 0 3rem;
  }
}
</style>
