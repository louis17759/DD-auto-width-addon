# 需求文档

## 简介

字段管理器插件是一个 AI 表格边栏插件，旨在提供便捷的字段管理和视图美化功能，帮助用户更高效地管理多维表格视图，提升工作效率和视图美观性。

## 术语表

- **System**: 字段管理器插件系统
- **User**: 使用插件的用户
- **Field**: AI 表格中的字段（列）
- **View**: AI 表格的视图
- **Active View**: 当前激活的视图
- **Column Width**: 字段列的宽度
- **Field Visibility**: 字段的显示或隐藏状态
- **Primary Field**: 数据表的主键字段，不可删除

## 需求

### 需求 1: 一键美化视图

**用户故事:** 作为用户，我希望能够一键调整视图中的列宽，使视图更加美观易读，从而提高工作效率。

#### 验收标准

1. WHEN User 点击"按照内容调整列宽"按钮, THE System SHALL 根据字段内容自动计算并设置每个字段的最优列宽
2. WHEN User 点击"按照表头调整列宽"按钮, THE System SHALL 根据字段名称长度自动计算并设置每个字段的列宽
3. WHEN User 选择"仅当前视图生效"选项, THE System SHALL 仅对当前激活的视图应用列宽调整
4. WHEN User 选择"对所有视图生效"选项, THE System SHALL 对数据表的所有视图应用列宽调整
5. WHEN 列宽调整完成, THE System SHALL 显示操作成功的反馈信息

### 需求 2: 字段列表展示

**用户故事:** 作为用户，我希望能够查看当前数据表的所有字段列表，包括字段名称、类型和数量，以便了解数据表结构。

#### 验收标准

1. THE System SHALL 在字段管理区域显示当前数据表的所有字段列表
2. THE System SHALL 为每个字段显示序号、字段类型图标和字段名称
3. THE System SHALL 在列表顶部显示字段总数量
4. WHEN 数据表的字段发生变化, THE System SHALL 自动更新字段列表显示
5. THE System SHALL 为主键字段提供特殊的视觉标识

### 需求 3: 字段搜索和筛选

**用户故事:** 作为用户，我希望能够通过名称搜索字段或按类型筛选字段，以便快速找到目标字段。

#### 验收标准

1. THE System SHALL 提供字段名称搜索输入框
2. WHEN User 在搜索框输入文本, THE System SHALL 实时过滤并显示匹配的字段
3. THE System SHALL 提供字段类型下拉筛选器
4. WHEN User 选择特定字段类型, THE System SHALL 仅显示该类型的字段
5. WHEN User 同时使用搜索和类型筛选, THE System SHALL 显示同时满足两个条件的字段

### 需求 4: 编辑字段名称

**用户故事:** 作为用户，我希望能够直接在插件中编辑字段名称，以便快速修改字段而无需切换到表格主界面。

#### 验收标准

1. THE System SHALL 为每个字段提供编辑按钮
2. WHEN User 点击字段的编辑按钮, THE System SHALL 显示字段名称编辑对话框
3. WHEN User 在编辑对话框中修改字段名称并确认, THE System SHALL 更新该字段的名称
4. WHEN 字段名称为空, THE System SHALL 显示错误提示并阻止保存
5. WHEN 字段名称更新成功, THE System SHALL 刷新字段列表并显示成功反馈

### 需求 5: 复制字段名称

**用户故事:** 作为用户，我希望能够快速复制字段名称到剪贴板，以便在其他地方使用。

#### 验收标准

1. THE System SHALL 为每个字段提供复制按钮
2. WHEN User 点击字段的复制按钮, THE System SHALL 将该字段名称复制到系统剪贴板
3. WHEN 复制操作成功, THE System SHALL 显示"已复制"的提示信息
4. THE System SHALL 在 2 秒后自动隐藏复制成功提示

### 需求 6: 隐藏和显示字段

**用户故事:** 作为用户，我希望能够批量隐藏或显示字段，以便根据需要调整视图的显示内容。

#### 验收标准

1. THE System SHALL 为每个字段提供复选框用于选择
2. THE System SHALL 为每个非主键字段提供显示/隐藏切换按钮
3. WHEN User 点击字段的显示/隐藏按钮, THE System SHALL 切换该字段在当前视图中的可见性
4. THE System SHALL 提供"显示"批量操作按钮
5. WHEN User 选中多个字段并点击"显示"按钮, THE System SHALL 在当前视图中显示所有选中的字段
6. THE System SHALL 提供"隐藏"批量操作按钮
7. WHEN User 选中多个字段并点击"隐藏"按钮, THE System SHALL 在当前视图中隐藏所有选中的字段
8. THE System SHALL 阻止隐藏主键字段的操作

### 需求 7: 删除字段

**用户故事:** 作为用户，我希望能够批量删除不需要的字段，以便清理数据表结构。

#### 验收标准

1. THE System SHALL 为每个非主键字段提供删除按钮
2. WHEN User 点击字段的删除按钮, THE System SHALL 显示确认对话框
3. WHEN User 在确认对话框中确认删除, THE System SHALL 删除该字段
4. THE System SHALL 提供"删除"批量操作按钮
5. WHEN User 选中多个字段并点击"删除"按钮, THE System SHALL 显示批量删除确认对话框
6. WHEN User 确认批量删除, THE System SHALL 删除所有选中的非主键字段
7. THE System SHALL 阻止删除主键字段的操作
8. WHEN 字段删除成功, THE System SHALL 刷新字段列表

### 需求 8: 重置功能

**用户故事:** 作为用户，我希望能够重置字段列表的搜索和筛选条件，以便快速返回完整列表视图。

#### 验收标准

1. THE System SHALL 提供"重置"按钮
2. WHEN User 点击"重置"按钮, THE System SHALL 清空搜索输入框
3. WHEN User 点击"重置"按钮, THE System SHALL 重置字段类型筛选器为默认状态
4. WHEN User 点击"重置"按钮, THE System SHALL 取消所有字段的选中状态
5. WHEN User 点击"重置"按钮, THE System SHALL 显示完整的字段列表

### 需求 9: 国际化支持

**用户故事:** 作为用户，我希望插件界面能够根据我的语言环境自动切换语言，以便更好地理解和使用插件功能。

#### 验收标准

1. THE System SHALL 支持简体中文、英文和日文三种语言
2. WHEN User 的 DingTalk 环境语言为简体中文, THE System SHALL 显示简体中文界面
3. WHEN User 的 DingTalk 环境语言为英文, THE System SHALL 显示英文界面
4. WHEN User 的 DingTalk 环境语言为日文, THE System SHALL 显示日文界面
5. THE System SHALL 确保所有界面文本、按钮标签和提示信息都支持国际化

### 需求 10: 错误处理

**用户故事:** 作为用户，我希望在操作失败时能够看到清晰的错误提示，以便了解问题并采取相应措施。

#### 验收标准

1. WHEN 字段操作失败, THE System SHALL 显示具体的错误信息
2. WHEN User 没有操作权限, THE System SHALL 显示权限不足的提示信息
3. WHEN 网络请求超时, THE System SHALL 显示超时错误提示
4. WHEN 发生未知错误, THE System SHALL 显示通用错误提示并记录错误日志
5. THE System SHALL 在错误提示中提供可能的解决建议
