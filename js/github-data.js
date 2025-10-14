// GitHub仓库数据管理
class GitHubLoveData {
    constructor() {
        this.dataFile = 'data/love-letters.json';
        this.letters = [];
        this.hasNewData = false;
    }

    // 从GitHub加载情书数据
    async loadLetters() {
        try {
            console.log('正在从GitHub加载情书数据...');
            const response = await fetch(this.dataFile);
            
            if (response.ok) {
                this.letters = await response.json();
                console.log('成功加载情书数据:', this.letters.length + '封情书');
                this.hasNewData = false;
            } else {
                console.log('首次使用或数据文件不存在，使用空数据');
                this.letters = [];
            }
            return this.letters;
        } catch (error) {
            console.log('加载失败，使用本地备份数据');
            // 失败时使用本地存储
            return this.loadFromLocalStorage();
        }
    }

    // 从本地存储加载
    loadFromLocalStorage() {
        const localData = localStorage.getItem('loveLetters');
        if (localData) {
            this.letters = JSON.parse(localData);
            console.log('从本地存储加载:', this.letters.length + '封情书');
        } else {
            this.letters = [];
        }
        return this.letters;
    }

    // 添加新情书
    async addLetter(letter) {
        this.letters.unshift(letter);
        this.hasNewData = true;
        
        // 保存到本地备份
        this.saveToLocalStorage();
        
        // 显示数据同步指引
        this.showSyncInstructions();
        
        return true;
    }

    // 添加回复
    async addReply(letterId, reply) {
        const letter = this.letters.find(l => l.id === letterId);
        if (letter) {
            letter.reply = reply;
            this.hasNewData = true;
            this.saveToLocalStorage();
            this.showSyncInstructions();
            return true;
        }
        return false;
    }

    // 保存到本地存储
    saveToLocalStorage() {
        localStorage.setItem('loveLetters', JSON.stringify(this.letters));
        console.log('数据已备份到本地存储');
    }

    // 显示同步指引
    showSyncInstructions() {
        const jsonOutput = document.getElementById('jsonOutput');
        const jsonData = document.getElementById('jsonData');
        
        if (jsonOutput && jsonData) {
            const jsonString = JSON.stringify(this.letters, null, 2);
            jsonData.value = jsonString;
            jsonOutput.style.display = 'block';
            
            // 滚动到数据区域
            jsonOutput.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 获取所有情书
    getLetters() {
        return this.letters;
    }

    // 检查是否有新数据需要同步
    hasUnsavedData() {
        return this.hasNewData;
    }
}

// 创建全局实例
const githubLoveData = new GitHubLoveData();

// 复制JSON数据到剪贴板
function copyJsonData() {
    const jsonData = document.getElementById('jsonData');
    jsonData.select();
    document.execCommand('copy');
    alert('✅ JSON数据已复制到剪贴板！现在请按照指南操作。');
}

// 显示详细操作指南
function showStepByStepGuide() {
    const guideSteps = document.getElementById('guideSteps');
    const stepGuide = document.getElementById('stepGuide');
    
    guideSteps.innerHTML = `
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h5>🎯 第一步：创建数据文件夹</h5>
            <p>1. 进入你的GitHub仓库</p>
            <p>2. 点击 "Add file" → "Create new file"</p>
            <p>3. 输入文件名：<code>data/love-letters.json</code></p>
            <p><strong>注意：</strong>一定要包含 <code>data/</code> 文件夹路径</p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h5>🎯 第二步：粘贴JSON数据</h5>
            <p>1. 在文件编辑器中，粘贴刚才复制的JSON数据</p>
            <p>2. 确保格式正确（系统会自动验证）</p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h5>🎯 第三步：提交文件</h5>
            <p>1. 滚动到页面底部</p>
            <p>2. 点击 "Commit new file"</p>
            <p>3. 等待GitHub Pages自动部署（约1-2分钟）</p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h5>🎯 第四步：验证同步</h5>
            <p>1. 2分钟后刷新你的爱情网站</p>
            <p>2. 在其他浏览器打开网站，应该能看到新情书！</p>
            <p>3. 如果看不到，请检查JSON格式是否正确</p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h5>💡 后续更新：</h5>
            <p>每次写新情书后：</p>
            <p>1. 复制新的JSON数据</p>
            <p>2. 进入GitHub，编辑 <code>data/love-letters.json</code> 文件</p>
            <p>3. 替换全部内容，提交更改</p>
        </div>
    `;
    
    stepGuide.style.display = 'block';
}
