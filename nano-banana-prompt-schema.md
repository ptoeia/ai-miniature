
# Nano Banana Prompt 分享页面设计方案（记录版）

以下为将要落地的简化版页面设计方案，便于你在 [nano-banana-prompt](cci:7://file:///d:/xiangyi/project/banana-ai/nano-banana-prompt:0:0-0:0) 中留档作为实现规范。

## 一、页面目标与范围
- 目标：提供一个英文页面，展示精选 Nano Banana Prompts，支持搜索、分类、一键复制和快速试用。
- 范围：不包含用户系统、点赞、评论、作者展示等社区功能（MVP）。

## 二、路径与文件结构
- 路由：`/prompts`（英文子页面）
- 关键文件：
  - `app/prompts/page.tsx`（页面入口）
  - `components/prompts/PromptsClientContent.tsx`（页面主体/客户端交互）
  - `components/prompts/PromptCard.tsx`（提示卡片）
  - `lib/data/promptsData.ts`（静态数据）
  - `types/prompts.ts`（类型定义）

## 三、页面信息架构与区块布局
- Hero Section
  - 标题：Nano Banana Prompt Gallery
  - 文案：简述功能 + SEO 关键词包含 “Banana AI / Nano Banana / prompts”
  - 简要 CTA：浏览/搜索提示词
- 控件区（搜索 + 分类）
  - 搜索框：关键词匹配 title/description/promptText/tags
  - 分类导航：All / Portrait / Style Transfer / Background / Product / Restoration
- Prompt 展示网格
  - 卡片项：示例图、标题、标签、可展开的 prompt 文本预览、按钮（Copy / Try Now）
  - 分页或“加载更多”（如数据量较大时再加）
- 快速提交（可选，后续再加）
  - 一个极简链接或说明，未来接入表单
- 底部说明区
  - “How to write effective prompts”（简短最佳实践）
  - “Best practices for Nano Banana”（连接现有 [detail.md](cci:7://file:///d:/xiangyi/project/banana-ai/detail.md:0:0-0:0) 内容要点）

## 四、组件清单（简要职责）
- `PromptsClientContent`
  - 容器组件，维护搜索与分类状态，执行过滤逻辑，渲染网格
- `PromptCard`
  - 展示单个 Prompt，负责复制、展开/折叠、跳转
- 后续可选组件（MVP不含）：
  - `CategoryFilter`（如逻辑复杂则拆分）
  - `PromptSubmissionForm`（提交新 Prompt）

## 五、数据模型（MVP）
- PromptData
  - id, title, description, promptText, category, tags[], exampleImage, difficulty
- PromptCategory
  - id, name, description, icon
- 数据来源：静态文件 `lib/data/promptsData.ts`（从 [detail.md](cci:7://file:///d:/xiangyi/project/banana-ai/detail.md:0:0-0:0) 精选整理）

## 六、核心交互与体验
- 搜索：前端本地模糊匹配，多字段匹配
- 分类：切换 tab 即时过滤
- 一键复制：复制 prompt 内容，toast 提示复制成功
- Try Now：跳转到主页 `Create with Banana AI` 工具区，预填充 prompt（后续落地）
- 响应式布局：移动 1 列 / 平板 2 列 / 桌面 3-4 列

## 七、UI/风格规范
- 继承现有风格：
  - 渐变背景（`gradient-hero`）
  - 卡片（`gradient-card` / `bg-card`）
  - 字体（`font-poppins` / `font-roboto`）
  - 按钮样式与阴影规范一致
- 图片：使用 Next/Image 或 img，优先复用 `public/` 示例图资源

## 八、SEO 与可访问性
- Metadata
  - title、description、keywords、OpenGraph
- 语义化标签 + alt 文本
- 英文页面文案，关键词自然分布（banana ai / nano banana / prompts）

## 九、性能与可维护性
- 静态数据本地过滤，首屏快
- 组件职责单一，类型明确（遵循 SOLID）
- 未来可平滑升级为服务端分页/搜索

## 十、未来扩展（非MVP）
- 详情页（/prompts/[id]）
- 点赞/收藏（需要用户体系）
- 上传示例图/社区投稿流
- 分类管理与多标签组合筛选
- 服务端搜索与统计

## 十一、验收标准（MVP）
- 页面可访问 `/prompts`
- 搜索/分类可用，网格展示正确
- 复制按钮工作正常
- Try Now 跳转正确（预留行为：滚动到工具区并预填充）
- 移动端显示正常，SEO 元信息完整

# 下一步建议
- 我来基于此方案继续补齐组件并接线静态数据；完成后你可在本地访问 `/prompts` 验收。
- 如需把本方案固化到仓库，可将本段内容粘贴到 [nano-banana-prompt](cci:7://file:///d:/xiangyi/project/banana-ai/nano-banana-prompt:0:0-0:0) 作为规格文档。

# 状态
- 设计方案已整理与记录。准备进入实现阶段（组件 + 数据 + 交互）。