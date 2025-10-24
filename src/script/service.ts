/*global DingdocsScript*/

/**
 * AI表格边栏插件服务层
 * 运行在 Web Worker 中，提供AI表格操作的核心功能
 */

// 获取当前激活的数据表
function getActiveSheet() {
  try {
    const base = DingdocsScript.base;
    const sheet = base.getActiveSheet();
    if (!sheet) {
      throw new Error('未找到激活的数据表');
    }
    return {
      id: sheet.getId(),
      name: sheet.getName(),
      desc: sheet.getDesc() || '',
      fieldsCount: sheet.getFields().length
    };
  } catch (error: any) {
    throw new Error(`获取激活数据表失败: ${error.message}`);
  }
}

// 获取所有数据表列表
function getAllSheets() {
  try {
    const base = DingdocsScript.base;
    const sheets = base.getSheets();
    return sheets.map((sheet: any) => ({
      id: sheet.getId(),
      name: sheet.getName(),
      desc: sheet.getDesc() || '',
      fieldsCount: sheet.getFields().length
    }));
  } catch (error: any) {
    throw new Error(`获取数据表列表失败: ${error.message}`);
  }
}

// 创建新的数据表
function createSheet(name: string) {
  try {
    if (!name || name.trim() === '') {
      throw new Error('数据表名称不能为空');
    }
    
    const base = DingdocsScript.base;
    // 创建带有基本字段的数据表
    const sheet = base.insertSheet(name.trim(), [
      { name: '标题', type: 'text' },
      { name: '状态', type: 'singleSelect' },
      { name: '创建时间', type: 'date' }
    ]);
    
    return {
      id: sheet.getId(),
      name: sheet.getName(),
      desc: sheet.getDesc() || '',
      fieldsCount: sheet.getFields().length
    };
  } catch (error: any) {
    throw new Error(`创建数据表失败: ${error.message}`);
  }
}

// 删除数据表
function deleteSheet(sheetId: string) {
  try {
    if (!sheetId) {
      throw new Error('数据表ID不能为空');
    }
    console.log('sheetId', sheetId);
    const base = DingdocsScript.base;
    base.deleteSheet(sheetId);
    return { success: true };
  } catch (error: any) {
    throw new Error(`删除数据表失败: ${error.message}`);
  }
}

// 获取数据表字段信息
function getSheetFields(sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const fields = sheet.getFields();
    return fields.map((field: any) => ({
      id: field.getId(),
      name: field.getName(),
      type: field.getType(),
      isPrimary: field.isPrimary?.() || false,
    }));
  } catch (error: any) {
    throw new Error(`获取字段信息失败: ${error.message}`);
  }
}

// 添加字段
function addField(name: string, type: string, sheetId?: string) {
  try {
    if (!name || name.trim() === '') {
      throw new Error('字段名称不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const field = sheet.insertField({
      name: name.trim(),
      type: type as any
    });
    
    return {
      id: field.getId(),
      name: field.getName(),
      type: field.getType(),
      isPrimary: field.isPrimary?.() || false
    };
  } catch (error: any) {
    throw new Error(`添加字段失败: ${error.message}`);
  }
}

// 删除字段
function deleteField(fieldId: string, sheetId?: string) {
  try {
    if (!fieldId) {
      throw new Error('字段ID不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    // 检查是否为主键字段
    const field = sheet.getField(fieldId);
    if (field && field.isPrimary?.()) {
      throw new Error('不能删除主键字段');
    }
    
    sheet.deleteField(fieldId);
    return { success: true };
  } catch (error: any) {
    throw new Error(`删除字段失败: ${error.message}`);
  }
}

// 获取记录数据
async function getRecords(sheetId?: string, pageSize = 20) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const result = await sheet.getRecordsAsync({ pageSize });
    
    return {
      records: result.records.map((record: any) => ({
        id: record.getId(),
        fields: record.getCellValues()
      })),
      hasMore: result.hasMore,
      cursor: result.cursor,
      total: result.records.length
    };
  } catch (error: any) {
    throw new Error(`获取记录失败: ${error.message}`);
  }
}

// 添加记录
async function addRecord(fields: Record<string, any>, sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const records = await sheet.insertRecordsAsync([{ fields }]);
    const record = records[0];
    
    return {
      id: record.getId(),
      fields: record.getCellValues()
    };
  } catch (error: any) {
    throw new Error(`添加记录失败: ${error.message}`);
  }
}

// 更新记录
async function updateRecord(recordId: string, fields: Record<string, any>, sheetId?: string) {
  try {
    if (!recordId) {
      throw new Error('记录ID不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const records = await sheet.updateRecordsAsync([{ id: recordId, fields }]);
    const record = records[0];
    
    return {
      id: record.getId(),
      fields: record.getCellValues()
    };
  } catch (error: any) {
    throw new Error(`更新记录失败: ${error.message}`);
  }
}

// 删除记录
async function deleteRecord(recordId: string, sheetId?: string) {
  try {
    if (!recordId) {
      throw new Error('记录ID不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    await sheet.deleteRecordsAsync(recordId);
    return { success: true };
  } catch (error: any) {
    throw new Error(`删除记录失败: ${error.message}`);
  }
}

// 获取文档信息
function getDocumentInfo() {
  try {
    const base = DingdocsScript.base;
    const uuid = base.getDentryUuid();
    const sheets = base.getSheets();
    
    return {
      uuid,
      sheetsCount: sheets.length,
      currentSheet: base.getActiveSheet()?.getName() || '无'
    };
  } catch (error: any) {
    throw new Error(`获取文档信息失败: ${error.message}`);
  }
}

// 获取当前视图
function getActiveView(sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const views = sheet.getViews();
    const gridView = views.find((view: any) => view.getType() === 'Grid');
    
    if (!gridView) {
      throw new Error('未找到表格视图');
    }
    
    return gridView.asGridView();
  } catch (error: any) {
    throw new Error(`获取视图失败: ${error.message}`);
  }
}

// 获取所有视图
function getAllViews(sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const views = sheet.getViews();
    return views.map((view: any) => ({
      id: view.getId(),
      name: view.getName(),
      type: view.getType()
    }));
  } catch (error: any) {
    throw new Error(`获取视图列表失败: ${error.message}`);
  }
}

// 按内容调整列宽
async function adjustColumnWidthByContent(applyScope: string = 'current', sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheets = [];
    
    // 根据应用范围获取数据表
    if (applyScope === 'allSheets') {
      sheets = base.getSheets();
    } else {
      const sheet = sheetId ? base.getSheet(sheetId) : base.getActiveSheet();
      if (!sheet) {
        throw new Error('未找到指定的数据表');
      }
      sheets = [sheet];
    }
    
    let totalViewsCount = 0;
    
    for (const sheet of sheets) {
      const views = sheet.getViews();
      const targetViews = applyScope === 'current'
        ? [views.find((v: any) => v.getType() === 'Grid')].filter(Boolean)
        : views.filter((v: any) => v.getType() === 'Grid');
      
      if (targetViews.length === 0) continue;
      
      // 获取所有记录来计算内容宽度
      const records = await sheet.getRecordsAsync({ pageSize: 100 });
      const fields = sheet.getFields();
      
      for (const view of targetViews) {
        const gridView = view.asGridView();
        
        for (const field of fields) {
          const fieldId = field.getId();
          const fieldName = field.getName();
          
          // 计算字段名称宽度（每个字符约14px，加上padding）
          let maxWidth = fieldName.length * 14 + 40;
          
          // 计算内容宽度
          for (const record of records.records) {
            const value = record.getCellValue(fieldId);
            if (value !== null && value !== undefined) {
              let contentLength = 0;
              if (typeof value === 'string') {
                contentLength = value.length;
              } else if (typeof value === 'object' && value.text) {
                contentLength = value.text.length;
              } else {
                contentLength = String(value).length;
              }
              const width = contentLength * 14 + 40;
              maxWidth = Math.max(maxWidth, width);
            }
          }
          
          // 限制宽度范围：最小100px，最大500px
          maxWidth = Math.max(100, Math.min(500, maxWidth));
          gridView.setFieldWidth(fieldId, maxWidth);
        }
        totalViewsCount++;
      }
    }
    
    return { success: true, viewsCount: totalViewsCount, sheetsCount: sheets.length };
  } catch (error: any) {
    throw new Error(`调整列宽失败: ${error.message}`);
  }
}

// 按表头调整列宽
function adjustColumnWidthByHeader(applyScope: string = 'current', sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheets = [];
    
    // 根据应用范围获取数据表
    if (applyScope === 'allSheets') {
      sheets = base.getSheets();
    } else {
      const sheet = sheetId ? base.getSheet(sheetId) : base.getActiveSheet();
      if (!sheet) {
        throw new Error('未找到指定的数据表');
      }
      sheets = [sheet];
    }
    
    let totalViewsCount = 0;
    
    for (const sheet of sheets) {
      const views = sheet.getViews();
      const targetViews = applyScope === 'current'
        ? [views.find((v: any) => v.getType() === 'Grid')].filter(Boolean)
        : views.filter((v: any) => v.getType() === 'Grid');
      
      if (targetViews.length === 0) continue;
      
      const fields = sheet.getFields();
      
      for (const view of targetViews) {
        const gridView = view.asGridView();
        
        for (const field of fields) {
          const fieldId = field.getId();
          const fieldName = field.getName();
          
          // 计算字段名称宽度（每个字符约14px，加上padding）
          let width = fieldName.length * 14 + 40;
          
          // 限制宽度范围：最小100px，最大400px
          width = Math.max(100, Math.min(400, width));
          gridView.setFieldWidth(fieldId, width);
        }
        totalViewsCount++;
      }
    }
    
    return { success: true, viewsCount: totalViewsCount, sheetsCount: sheets.length };
  } catch (error: any) {
    throw new Error(`调整列宽失败: ${error.message}`);
  }
}

// 按固定值调整列宽
function adjustColumnWidthByFixedValue(width: number, applyScope: string = 'current', sheetId?: string) {
  try {
    if (!width || width < 100 || width > 1000) {
      throw new Error('列宽必须在 100-1000 像素之间');
    }
    
    const base = DingdocsScript.base;
    let sheets = [];
    
    // 根据应用范围获取数据表
    if (applyScope === 'allSheets') {
      sheets = base.getSheets();
    } else {
      const sheet = sheetId ? base.getSheet(sheetId) : base.getActiveSheet();
      if (!sheet) {
        throw new Error('未找到指定的数据表');
      }
      sheets = [sheet];
    }
    
    let totalViewsCount = 0;
    
    for (const sheet of sheets) {
      const views = sheet.getViews();
      const targetViews = applyScope === 'current'
        ? [views.find((v: any) => v.getType() === 'Grid')].filter(Boolean)
        : views.filter((v: any) => v.getType() === 'Grid');
      
      if (targetViews.length === 0) continue;
      
      const fields = sheet.getFields();
      
      for (const view of targetViews) {
        const gridView = view.asGridView();
        
        for (const field of fields) {
          const fieldId = field.getId();
          gridView.setFieldWidth(fieldId, width);
        }
        totalViewsCount++;
      }
    }
    
    return { success: true, viewsCount: totalViewsCount, sheetsCount: sheets.length };
  } catch (error: any) {
    throw new Error(`调整列宽失败: ${error.message}`);
  }
}

// 更新字段名称
function updateFieldName(fieldId: string, newName: string, sheetId?: string) {
  try {
    if (!newName || newName.trim() === '') {
      throw new Error('字段名称不能为空');
    }
    
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    const field = sheet.getField(fieldId);
    if (!field) {
      throw new Error('未找到指定的字段');
    }
    
    field.setName(newName.trim());
    
    return {
      id: field.getId(),
      name: field.getName(),
      type: field.getType()
    };
  } catch (error: any) {
    throw new Error(`更新字段名称失败: ${error.message}`);
  }
}

// 获取字段可见性状态
function getFieldVisibility(fieldId: string, sheetId?: string) {
  try {
    const gridView = getActiveView(sheetId);
    const visibleFields = gridView.getVisibleFieldIdList();
    return visibleFields.includes(fieldId);
  } catch (error: any) {
    throw new Error(`获取字段可见性失败: ${error.message}`);
  }
}

// 显示字段
function showFields(fieldIds: string | string[], sheetId?: string) {
  try {
    const gridView = getActiveView(sheetId);
    const result = gridView.showField(fieldIds);
    return { success: result };
  } catch (error: any) {
    throw new Error(`显示字段失败: ${error.message}`);
  }
}

// 隐藏字段
function hideFields(fieldIds: string | string[], sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    // 检查是否包含主键字段
    const fieldIdArray = Array.isArray(fieldIds) ? fieldIds : [fieldIds];
    for (const fieldId of fieldIdArray) {
      const field = sheet.getField(fieldId);
      if (field && field.isPrimary?.()) {
        throw new Error('不能隐藏主键字段');
      }
    }
    
    const gridView = getActiveView(sheetId);
    const result = gridView.hideField(fieldIds);
    return { success: result };
  } catch (error: any) {
    throw new Error(`隐藏字段失败: ${error.message}`);
  }
}

// 批量删除字段
async function deleteFields(fieldIds: string[], sheetId?: string) {
  try {
    const base = DingdocsScript.base;
    let sheet;
    if (sheetId) {
      sheet = base.getSheet(sheetId);
    } else {
      sheet = base.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('未找到指定的数据表');
    }
    
    let successCount = 0;
    const errors: string[] = [];
    
    for (const fieldId of fieldIds) {
      try {
        const field = sheet.getField(fieldId);
        if (field && field.isPrimary?.()) {
          errors.push(`字段 ${field.getName()} 是主键，不能删除`);
          continue;
        }
        
        sheet.deleteField(fieldId);
        successCount++;
      } catch (error: any) {
        errors.push(`删除字段失败: ${error.message}`);
      }
    }
    
    return { 
      success: successCount > 0,
      successCount,
      totalCount: fieldIds.length,
      errors
    };
  } catch (error: any) {
    throw new Error(`批量删除字段失败: ${error.message}`);
  }
}

// 注册所有方法供UI层调用
DingdocsScript.registerScript('getActiveSheet', getActiveSheet);
DingdocsScript.registerScript('getAllSheets', getAllSheets);
DingdocsScript.registerScript('createSheet', createSheet);
DingdocsScript.registerScript('deleteSheet', deleteSheet);
DingdocsScript.registerScript('getSheetFields', getSheetFields);
DingdocsScript.registerScript('addField', addField);
DingdocsScript.registerScript('deleteField', deleteField);
DingdocsScript.registerScript('getRecords', getRecords);
DingdocsScript.registerScript('addRecord', addRecord);
DingdocsScript.registerScript('updateRecord', updateRecord);
DingdocsScript.registerScript('deleteRecord', deleteRecord);
DingdocsScript.registerScript('getDocumentInfo', getDocumentInfo);

export {};


// ==================== 注册所有脚本服务 ====================
// 根据 AI表格边栏插件开发指南，需要使用 registerScript 注册所有函数

DingdocsScript.registerScript('getActiveSheet', getActiveSheet);
DingdocsScript.registerScript('getAllSheets', getAllSheets);
DingdocsScript.registerScript('createSheet', createSheet);
DingdocsScript.registerScript('deleteSheet', deleteSheet);
DingdocsScript.registerScript('getSheetFields', getSheetFields);
DingdocsScript.registerScript('addField', addField);
DingdocsScript.registerScript('deleteField', deleteField);
DingdocsScript.registerScript('getRecords', getRecords);
DingdocsScript.registerScript('addRecord', addRecord);
DingdocsScript.registerScript('updateRecord', updateRecord);
DingdocsScript.registerScript('deleteRecord', deleteRecord);
DingdocsScript.registerScript('getDocumentInfo', getDocumentInfo);

// 新增的列宽调整功能
DingdocsScript.registerScript('adjustColumnWidthByContent', adjustColumnWidthByContent);
DingdocsScript.registerScript('adjustColumnWidthByHeader', adjustColumnWidthByHeader);
DingdocsScript.registerScript('adjustColumnWidthByFixedValue', adjustColumnWidthByFixedValue);
