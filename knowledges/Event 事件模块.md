# Event 事件模块

### onSheetInserted

监听 Sheet 添加事件，将返回一个取消监听函数。

```typescript
onSheetInserted: (handler: (data: { baseId: string }) => void) => OffListener;
```

#### 示例

```typescript
const off = Dingdocs.base.event.onSheetInserted((event) => {
  console.log('sheet inserted')
});
```

### onSheetDeleted

监听 Sheet 删除事件，将返回一个取消监听函数。

```typescript
onSheetDeleted: (handler: (data: { baseId: string }) => void) => OffListener;
```

#### 示例

```typescript
const off = Dingdocs.base.event.onSheetDeleted((event) => {
  console.log('sheet deleted')
});
```

### onFieldInserted

监听 Field 添加事件，返回一个取消监听函数。

```typescript
onFieldInserted: (handler: (data: { baseId: string; sheetId: string }) => void) => OffListener;
```

#### 示例

```typescript
const off = Dingdocs.base.event.onFieldInserted((event) => {
  console.log('event:', event);
});

// 新增一个文本类型的字段，用于验证触发事件
const fieldId = await sheet.insertField({
  type: FieldType.Text,
  name: 'field_test'
});
```

### onFieldModified

监听字段修改事件，返回一个取消监听函数。

```typescript
onFieldModified: (handler: (data: { baseId: string; sheetId: string }) => void) => OffListener;
```

#### 示例

```typescript
const off = Dingdocs.base.event.onFieldModified((event) => {
  console.log('field modify:', event);
});
```

### onFieldDeleted

监听字段删除事件，返回一个取消监听函数。

```typescript
onFieldDeleted: (handler: (data: { baseId: string; sheetId: string }) => void) => OffListener;
```

#### 示例

```typescript
const off = Dingdocs.base.event.onFieldDeleted((event) => {
  console.log('field delete:', event);
});
```

### onRecordInserted

监听 Record 添加事件，返回一个取消监听方法。

```typescript
onRecordInserted: (handler: (data: { baseId: string; sheetId: string; recordId: string }) => void) => OffListener;
```

#### 示例

```typescript
const off = Dingdocs.base.event.onRecordInserted((event) => {
  console.log('record inserted:', event);
});
```

### onRecordModified

监听 Record 修改事件，返回一个取消监听方法。

```typescript
onRecordModified: (handler: (data: { baseId: string; sheetId: string; recordId: string }) => void) => OffListener;
```

#### 示例

```typescript
const off = Dingdocs.base.event.onRecordModified((event) => {
  console.log('record modify:', event);
});
```

### onRecordDeleted

监听 Record 删除事件，返回一个取消监听方法。

```typescript
onRecordDeleted: (handler: (data: { baseId: string; sheetId: string; recordId: string }) => void) => OffListener;
```

#### 示例

```typescript
const off = Dingdocs.base.event.onRecordDeleted((event) => {
  console.log('record delete:', event);
});
```

### onSelectionChanged

监听当前选中（数据表、单元格、视图）改变事件，将返回一个取消监听函数。

```typescript
onSelectionChanged: (handler: (data: Selection) => void) => OffListener;

interface Selection {
  /** 当前AI表格的ID */
  baseId: string;
  /** 当前选中区域所属数据表ID，未选中数据表时返回null */
  sheetId: SheetId | null;
  /** 当前选中区域所属视图ID，未选中视图时返回null */
  viewId: string | null;
  /** 当前选中区域所属字段ID，未选中单元格时返回null */
  fieldId: FieldId | null;
  /** 当前选中区域所属记录ID，未选中单元格时返回null */
  recordId: string | null;
}
```

#### 示例

```typescript
const off = Dingdocs.base.event.onSelectionChanged((event) => {
  console.log('current selection', event)
});
```